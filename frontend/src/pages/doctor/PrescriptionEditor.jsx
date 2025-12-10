// pages/doctor/PrescriptionEditor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import Modal from '../../components/shared/Modal';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaFilePdf,
  FaSpinner,
  FaPills,
  FaNotesMedical,
} from 'react-icons/fa';
import * as prescriptionService from '../../services/prescriptionService';
import axios from 'axios';

const PrescriptionEditor = () => {
  const { appointmentId, prescriptionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [isEditMode, setIsEditMode] = useState(!!prescriptionId);

  // Form state
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }
    if (prescriptionId) {
      fetchPrescription();
    }
  }, [appointmentId, prescriptionId]);

  const fetchAppointment = async () => {
    if (!appointmentId) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await axios.get(`${API_URL}/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setAppointment(response.data?.data || response.data);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      toast.error('Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescription = async () => {
    try {
      setLoading(true);
      const response = await prescriptionService.getPrescription(prescriptionId);
      const data = response.data;
      setPrescription(data);
      setMedications(data.medications || [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
      setDiagnosis(data.diagnosis || '');
      setInstructions(data.instructions || '');
      setNotes(data.notes || '');
      setExpiryDate(data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : '');
    } catch (error) {
      console.error('Error fetching prescription:', error);
      toast.error('Failed to load prescription');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleRemoveMedication = (index) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const validateForm = () => {
    if (!diagnosis.trim()) {
      toast.error('Please enter a diagnosis');
      return false;
    }
    if (medications.some(med => !med.name.trim())) {
      toast.error('Please fill in all medication names');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const prescriptionData = {
        appointmentId: appointmentId || prescription?.appointmentId,
        patientId: appointment?.patientId || prescription?.patientId,
        doctorId: user?.doctorId || user?.id,
        medications: medications.filter(med => med.name.trim()),
        diagnosis,
        instructions,
        notes,
        expiryDate: expiryDate || null,
      };

      let response;
      if (isEditMode) {
        response = await prescriptionService.updatePrescription(prescriptionId, prescriptionData);
        toast.success('Prescription updated successfully');
      } else {
        response = await prescriptionService.createPrescription(prescriptionData);
        toast.success('Prescription created successfully');
      }

      // Generate PDF
      if (response.data?.id) {
        try {
          await prescriptionService.generatePDF(response.data.id);
          toast.success('PDF generated successfully');
        } catch (error) {
          console.error('Error generating PDF:', error);
          toast.error('Prescription saved but PDF generation failed');
        }
      }

      navigate('/doctor/prescriptions');
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error(error.response?.data?.error || 'Failed to save prescription');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!prescriptionId) {
      toast.error('Please save the prescription first');
      return;
    }

    try {
      setLoading(true);
      await prescriptionService.generatePDF(prescriptionId);
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !prescription && prescriptionId) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Prescription' : 'Create Prescription'}
            </h1>
            <p className="text-gray-600 mt-1">
              {appointment?.patient 
                ? `Patient: ${appointment.patient.firstName} ${appointment.patient.lastName}`
                : prescription?.patient
                ? `Patient: ${prescription.patient.firstName} ${prescription.patient.lastName}`
                : 'New Prescription'}
            </p>
          </div>
          <div className="flex gap-2">
            {prescriptionId && (
              <Button
                variant="outline"
                onClick={handleGeneratePDF}
                disabled={loading}
              >
                <FaFilePdf className="w-4 h-4 mr-2" />
                Generate PDF
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4 mr-2" />
                  Save Prescription
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Diagnosis Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaNotesMedical className="w-5 h-5 text-primary" />
            Diagnosis
          </h2>
          <Input
            type="text"
            placeholder="Enter diagnosis (e.g., Hypertension, Diabetes Type 2)"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full"
          />
        </Card>

        {/* Medications Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FaPills className="w-5 h-5 text-primary" />
              Medications
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddMedication}
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </div>

          <div className="space-y-4">
            {medications.map((med, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                <Input
                  type="text"
                  placeholder="Medication Name"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  className="md:col-span-2"
                  required
                />
                <Input
                  type="text"
                  placeholder="Dosage (e.g., 500mg)"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Frequency (e.g., 2x daily)"
                  value={med.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Duration (e.g., 7 days)"
                  value={med.duration}
                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Instructions"
                    value={med.instructions}
                    onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                    className="flex-1"
                  />
                  {medications.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMedication(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Instructions & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">General Instructions</h2>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter general instructions for the patient..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Card>
        </div>

        {/* Expiry Date */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Prescription Validity</h2>
          <Input
            type="date"
            label="Expiry Date (Optional)"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full md:w-1/3"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PrescriptionEditor;

