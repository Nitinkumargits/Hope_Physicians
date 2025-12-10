import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import { useAuth } from '../../contexts/AuthContext';
import * as prescriptionService from '../../services/prescriptionService';
import toast from 'react-hot-toast';
import { 
  FaPills, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit,
  FaTrash,
  FaFilePdf,
  FaPlus,
  FaSpinner,
  FaUser,
  FaCalendarAlt,
  FaNotesMedical,
  FaStethoscope,
  FaTimes
} from 'react-icons/fa';

const DoctorPrescriptions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    if (user && user.doctorId) {
      fetchPrescriptions();
    } else {
      setLoading(false);
      toast.error('Doctor ID not found. Please log in again.');
    }
  }, [user, filter]);

  const fetchPrescriptions = async () => {
    if (!user?.doctorId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const filters = {};
      if (filter !== 'all') {
        filters.status = filter;
      }
      if (searchTerm) {
        filters.search = searchTerm;
      }

      const response = await prescriptionService.getDoctorPrescriptions(user.doctorId, filters);
      setPrescriptions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
      toast.error('Failed to load prescriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (user?.doctorId) {
        fetchPrescriptions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredPrescriptions = prescriptions.filter(prescription => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const patientName = prescription.patient 
        ? `${prescription.patient.firstName} ${prescription.patient.lastName}`.toLowerCase()
        : '';
      const matchesSearch = 
        patientName.includes(searchLower) ||
        prescription.diagnosis?.toLowerCase().includes(searchLower) ||
        prescription.instructions?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    return true;
  });

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleEditPrescription = (prescriptionId) => {
    navigate(`/doctor/prescriptions/edit/${prescriptionId}`);
  };

  const handleDeletePrescription = async (prescriptionId) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) {
      return;
    }

    try {
      setIsDeleting(prescriptionId);
      await prescriptionService.deletePrescription(prescriptionId);
      toast.success('Prescription deleted successfully');
      fetchPrescriptions();
    } catch (error) {
      console.error('Failed to delete prescription:', error);
      toast.error('Failed to delete prescription. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleGeneratePDF = async (prescriptionId) => {
    try {
      await prescriptionService.generatePDF(prescriptionId);
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatMedications = (medications) => {
    if (!medications) return [];
    try {
      if (typeof medications === 'string') {
        return JSON.parse(medications);
      }
      return medications;
    } catch (e) {
      return [];
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'danger';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
            <p className="text-gray-600 mt-1">Manage and view all prescriptions</p>
          </div>
          <Button
            onClick={() => navigate('/doctor/prescriptions/new')}
            className="bg-primary text-white hover:bg-primary-600"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Create Prescription
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Prescriptions</p>
                <p className="text-3xl font-bold text-gray-900">{prescriptions.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <FaPills className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-gray-900">
                  {prescriptions.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100">
                <FaStethoscope className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Expired</p>
                <p className="text-3xl font-bold text-gray-900">
                  {prescriptions.filter(p => p.status === 'expired').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-100">
                <FaTimes className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Showing</p>
                <p className="text-3xl font-bold text-gray-900">{filteredPrescriptions.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-violet-100">
                <FaFilter className="w-8 h-8 text-violet-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by patient name, diagnosis, or instructions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Prescriptions List */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading prescriptions...</p>
            </div>
          ) : filteredPrescriptions.length === 0 ? (
            <div className="text-center py-12">
              <FaPills className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">No prescriptions found</p>
              <p className="text-gray-500 text-sm mb-4">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'You haven\'t created any prescriptions yet'}
              </p>
              {!searchTerm && filter === 'all' && (
                <Button
                  onClick={() => navigate('/doctor/prescriptions/new')}
                  className="bg-primary text-white hover:bg-primary-600"
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  Create Your First Prescription
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPrescriptions.map((prescription) => {
                const patientName = prescription.patient 
                  ? `${prescription.patient.firstName} ${prescription.patient.lastName}`
                  : 'Unknown Patient';
                const medications = formatMedications(prescription.medications);
                
                return (
                  <div
                    key={prescription.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-primary"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <FaPills className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{patientName}</p>
                          <p className="text-sm text-gray-600">Diagnosis: {prescription.diagnosis || 'N/A'}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(prescription.status)}>
                          {prescription.status || 'active'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaCalendarAlt className="w-4 h-4" />
                          <span>Issued: {formatDate(prescription.issuedDate)}</span>
                        </div>
                        {prescription.expiryDate && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt className="w-4 h-4" />
                            <span>Expires: {formatDate(prescription.expiryDate)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaPills className="w-4 h-4" />
                          <span>{medications.length} medication{medications.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {medications.length > 0 && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Medications:</p>
                          <div className="space-y-1">
                            {medications.slice(0, 2).map((med, idx) => (
                              <p key={idx} className="text-xs text-gray-600">
                                • {med.name} {med.dosage && `(${med.dosage})`} {med.frequency && `- ${med.frequency}`}
                              </p>
                            ))}
                            {medications.length > 2 && (
                              <p className="text-xs text-gray-500 italic">+{medications.length - 2} more...</p>
                            )}
                          </div>
                        </div>
                      )}

                      {prescription.instructions && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          <FaNotesMedical className="w-3 h-3 inline mr-1" />
                          {prescription.instructions.substring(0, 100)}
                          {prescription.instructions.length > 100 ? '...' : ''}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPrescription(prescription)}
                        className="text-primary hover:bg-primary-50"
                      >
                        <FaEye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPrescription(prescription.id)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <FaEdit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGeneratePDF(prescription.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <FaFilePdf className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePrescription(prescription.id)}
                        disabled={isDeleting === prescription.id}
                        className="text-red-600 hover:bg-red-50"
                      >
                        {isDeleting === prescription.id ? (
                          <FaSpinner className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <FaTrash className="w-4 h-4 mr-1" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Prescription Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Prescription Details"
        size="lg"
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
            {selectedPrescription && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    handleEditPrescription(selectedPrescription.id);
                  }}
                >
                  <FaEdit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    handleGeneratePDF(selectedPrescription.id);
                  }}
                >
                  <FaFilePdf className="w-4 h-4 mr-1" />
                  Generate PDF
                </Button>
              </>
            )}
          </div>
        }
      >
        {selectedPrescription && (
          <div className="space-y-6">
            {/* Patient Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaUser className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-semibold text-gray-900">
                    {selectedPrescription.patient 
                      ? `${selectedPrescription.patient.firstName} ${selectedPrescription.patient.lastName}`
                      : 'Unknown Patient'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Issued Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(selectedPrescription.issuedDate)}
                  </p>
                </div>
              </div>

              {selectedPrescription.expiryDate && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedPrescription.expiryDate)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaStethoscope className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={getStatusBadgeVariant(selectedPrescription.status)}>
                    {selectedPrescription.status || 'active'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            {selectedPrescription.diagnosis && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaStethoscope className="w-4 h-4 text-primary" />
                  Diagnosis
                </h4>
                <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                  {selectedPrescription.diagnosis}
                </p>
              </div>
            )}

            {/* Medications */}
            {selectedPrescription.medications && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaPills className="w-4 h-4 text-primary" />
                  Medications
                </h4>
                <div className="space-y-2">
                  {formatMedications(selectedPrescription.medications).map((med, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-semibold text-gray-900">{med.name}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm text-gray-600">
                        {med.dosage && <span>Dosage: {med.dosage}</span>}
                        {med.frequency && <span>Frequency: {med.frequency}</span>}
                        {med.duration && <span>Duration: {med.duration}</span>}
                        {med.instructions && <span className="md:col-span-2">Instructions: {med.instructions}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {selectedPrescription.instructions && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaNotesMedical className="w-4 h-4 text-primary" />
                  Instructions
                </h4>
                <p className="text-gray-700 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {selectedPrescription.instructions}
                </p>
              </div>
            )}

            {/* Notes */}
            {selectedPrescription.notes && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-700 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {selectedPrescription.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default DoctorPrescriptions;
