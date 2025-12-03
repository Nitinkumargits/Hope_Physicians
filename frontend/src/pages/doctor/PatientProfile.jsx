import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import { getPatientById } from '../../services/patientService';
import toast from 'react-hot-toast';
import { 
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaIdCard,
  FaFileMedical,
  FaCalendarAlt,
  FaClock,
  FaStethoscope,
  FaNotesMedical,
  FaPrescriptionBottle,
  FaHeartbeat,
  FaAllergies,
  FaHistory,
  FaEdit,
  FaPrint,
  FaDownload,
  FaSpinner
} from 'react-icons/fa';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log(`🔍 Fetching patient data for ID: ${id}`);
      const result = await getPatientById(id);
      
      if (!result || !result.data) {
        console.warn('⚠️ No patient data received');
        setLoading(false);
        return;
      }

      const patientData = result.data;
      
      // Transform patient data
      const transformedPatient = {
        id: patientData.id,
        name: `${patientData.firstName} ${patientData.lastName}`,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        email: patientData.email,
        phone: patientData.phone,
        dob: patientData.dateOfBirth ? new Date(patientData.dateOfBirth).toISOString().split('T')[0] : null,
        age: patientData.dateOfBirth 
          ? Math.floor((new Date() - new Date(patientData.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
          : null,
        address: patientData.address || 'N/A',
        gender: patientData.gender || 'Not specified',
        bloodType: 'Not specified', // Not in schema yet
        allergies: [], // Not in schema yet
        emergencyContact: {
          name: patientData.emergencyContact || 'Not provided',
          relationship: 'Not specified',
          phone: patientData.emergencyPhone || 'Not provided'
        },
        insurance: {
          provider: patientData.insuranceProvider || 'Not provided',
          policyNumber: patientData.insuranceNumber || 'Not provided',
          groupNumber: 'Not provided'
        },
        registrationDate: patientData.createdAt ? new Date(patientData.createdAt).toISOString().split('T')[0] : null,
        kycStatus: patientData.kycStatus,
      };

      setPatient(transformedPatient);

      // Transform appointments
      const transformedAppointments = (patientData.appointments || []).map(apt => ({
        id: apt.id,
        date: apt.date ? (typeof apt.date === 'string' ? apt.date : apt.date.toISOString().split('T')[0]) : null,
        time: apt.time || 'N/A',
        type: apt.type || 'Consultation',
        status: apt.status || 'scheduled',
        doctor: apt.doctor ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}` : 'Dr. Okonkwo',
        notes: apt.notes || '',
        department: apt.department || '',
      }));

      setAppointments(transformedAppointments);

      // Prescriptions and medical history not in schema yet - keep empty or mock
      setPrescriptions([]);
      setMedicalHistory([]);

      console.log('✅ Patient data loaded:', {
        patient: transformedPatient.name,
        appointments: transformedAppointments.length,
      });

    } catch (error) {
      console.error('❌ Failed to fetch patient data:', error);
      toast.error('Failed to load patient information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      'scheduled': 'primary',
      'in-progress': 'info',
      'completed': 'success',
      'cancelled': 'danger',
      'Active': 'success',
      'Inactive': 'default'
    };
    return variants[status] || 'default';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading patient information...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <FaUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-4">The patient with ID {id} could not be found.</p>
          <Button onClick={() => navigate('/doctor/patients')}>
            Back to Patients
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/doctor/patients')}
              className="flex items-center gap-2"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600 mt-1">Patient ID: #{patient.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <FaEdit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              <FaPrint className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <FaDownload className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Patient Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FaUser className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-semibold text-gray-900">{patient.gender || 'Not specified'}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FaBirthdayCake className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-semibold text-gray-900">
                  {patient.age ? `${patient.age} years` : 'Not specified'}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FaHeartbeat className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">KYC Status</p>
                <Badge variant={patient.kycStatus === 'approved' ? 'success' : patient.kycStatus === 'pending' ? 'warning' : 'default'}>
                  {patient.kycStatus || 'pending'}
                </Badge>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FaCalendarAlt className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-semibold text-gray-900">
                  {patient.registrationDate ? formatDate(patient.registrationDate) : 'N/A'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: FaUser },
              { id: 'appointments', label: 'Appointments', icon: FaCalendarAlt },
              { id: 'prescriptions', label: 'Prescriptions', icon: FaPrescriptionBottle },
              { id: 'history', label: 'Medical History', icon: FaHistory }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card title="Personal Information">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaUser className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaBirthdayCake className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-semibold text-gray-900">{formatDate(patient.dob)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaPhone className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-semibold text-gray-900">{patient.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-semibold text-gray-900">{patient.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-semibold text-gray-900">{patient.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaIdCard className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Patient ID</p>
                      <p className="font-semibold text-gray-900">#{patient.id}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card title="Emergency Contact">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Contact Name</p>
                    <p className="font-semibold text-gray-900">{patient.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="font-semibold text-gray-900">{patient.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-semibold text-gray-900">{patient.emergencyContact.phone}</p>
                  </div>
                </div>
              </Card>

              {/* Insurance Information */}
              <Card title="Insurance Information">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Provider</p>
                    <p className="font-semibold text-gray-900">{patient.insurance.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Policy Number</p>
                    <p className="font-semibold text-gray-900">{patient.insurance.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Group Number</p>
                    <p className="font-semibold text-gray-900">{patient.insurance.groupNumber}</p>
                  </div>
                </div>
              </Card>

              {/* Allergies */}
              <Card title="Allergies">
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="space-y-2">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="danger" className="mr-2 mb-2">
                        <FaAllergies className="w-3 h-3 mr-1" />
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No known allergies</p>
                )}
              </Card>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <Card title="Appointment History">
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No appointments found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-primary"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FaStethoscope className="w-4 h-4 text-primary" />
                          <div>
                            <p className="font-semibold text-gray-900">{apt.type}</p>
                            <p className="text-sm text-gray-600">{apt.doctor}</p>
                          </div>
                          <Badge variant={getStatusBadge(apt.status)}>
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            {formatDate(apt.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            {apt.time}
                          </span>
                          {apt.notes && (
                            <span className="flex items-center gap-1">
                              <FaNotesMedical className="w-3 h-3" />
                              {apt.notes}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <Card title="Current Prescriptions">
              {prescriptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaPrescriptionBottle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No active prescriptions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{prescription.medication}</p>
                          <p className="text-sm text-gray-600">{prescription.dosage}</p>
                        </div>
                        <Badge variant={getStatusBadge(prescription.status)}>
                          {prescription.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">Start Date</p>
                          <p className="font-medium text-gray-900">{formatDate(prescription.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">End Date</p>
                          <p className="font-medium text-gray-900">{formatDate(prescription.endDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Prescribed By</p>
                          <p className="font-medium text-gray-900">{prescription.doctor}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Medical History Tab */}
          {activeTab === 'history' && (
            <Card title="Medical History">
              {medicalHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaHistory className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No medical history available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicalHistory.map((record) => (
                    <div
                      key={record.id}
                      className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.condition}</p>
                          <p className="text-sm text-gray-600 mt-1">{record.diagnosis}</p>
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(record.date)}</p>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-500">Treatment</p>
                        <p className="font-medium text-gray-900">{record.treatment}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Doctor</p>
                        <p className="font-medium text-gray-900">{record.doctor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Patient Information"
        size="lg"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsEditModalOpen(false);
              // Handle save logic here
            }}>
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">Patient information editing form will be implemented here.</p>
          {/* Add form fields here */}
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default PatientProfile;

