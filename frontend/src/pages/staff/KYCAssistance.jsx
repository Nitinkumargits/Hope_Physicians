import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import toast from 'react-hot-toast';
import { FaFileMedical, FaSearch, FaFilter, FaSpinner, FaUsers, FaPhone, FaEnvelope, FaIdCard, FaCheckCircle } from 'react-icons/fa';
import * as staffService from '../../services/staffService';

const KYCAssistance = () => {
  const [kycAssistance, setKycAssistance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [assistingKYC, setAssistingKYC] = useState(false);

  useEffect(() => {
    fetchKYCAssistance();
  }, []);

  const fetchKYCAssistance = async () => {
    try {
      setLoading(true);
      const data = await staffService.getKYCAssistance();
      setKycAssistance(data.data || []);
    } catch (error) {
      console.error('Failed to fetch KYC assistance:', error);
      toast.error('Failed to load KYC assistance requests');
    } finally {
      setLoading(false);
    }
  };

  const filteredKYC = kycAssistance.filter(kyc => {
    const matchesSearch = kyc.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kyc.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || kyc.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAssistKYC = async (kyc) => {
    setSelectedKYC(kyc);
    setIsKYCModalOpen(true);
  };

  const confirmAssistKYC = async () => {
    if (!selectedKYC) return;
    
    setAssistingKYC(true);
    try {
      const result = await staffService.assistKYC(selectedKYC.id);
      setKycAssistance(prev => prev.filter(k => k.id !== selectedKYC.id));
      toast.success(result.message || 'KYC assistance provided successfully!');
      setIsKYCModalOpen(false);
      setSelectedKYC(null);
      fetchKYCAssistance(); // Refresh list
    } catch (error) {
      console.error('Failed to assist KYC:', error);
      toast.error('Failed to provide assistance. Please try again.');
    } finally {
      setAssistingKYC(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'warning',
      'in-progress': 'info',
      'completed': 'success'
    };
    return variants[status] || 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">KYC Assistance</h1>
            <p className="text-gray-600 mt-1">Help patients with their KYC document submissions</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by patient name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* KYC Requests List */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading KYC requests...</p>
            </div>
          ) : filteredKYC.length === 0 ? (
            <div className="text-center py-12">
              <FaFileMedical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No KYC assistance requests found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredKYC.map((kyc) => (
                <div
                  key={kyc.id}
                  className="p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FaUsers className="w-4 h-4 text-amber-600" />
                        <p className="font-semibold text-gray-900">{kyc.patient}</p>
                        <Badge variant={getStatusBadge(kyc.status)}>{kyc.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Submitted {kyc.submitted}</p>
                      <p className="text-xs text-gray-500">{kyc.documents} documents uploaded</p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleAssistKYC(kyc)}
                    >
                      Assist
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* KYC Assistance Modal */}
        <Modal
          isOpen={isKYCModalOpen}
          onClose={() => setIsKYCModalOpen(false)}
          title="KYC Assistance"
          size="lg"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsKYCModalOpen(false)}>Cancel</Button>
              {selectedKYC && (
                <Button 
                  onClick={confirmAssistKYC}
                  disabled={assistingKYC}
                  loading={assistingKYC}
                >
                  <FaCheckCircle className="w-4 h-4 mr-2" />
                  Provide Assistance
                </Button>
              )}
            </div>
          }
        >
          {selectedKYC && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaUsers className="w-4 h-4 text-primary" />
                  Patient Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Name:</p>
                    <p className="font-medium text-gray-900">{selectedKYC.patient}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Patient ID:</p>
                    <p className="font-medium text-gray-900">{selectedKYC.patientId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone:</p>
                    <p className="font-medium text-gray-900">{selectedKYC.patientPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email:</p>
                    <p className="font-medium text-gray-900">{selectedKYC.patientEmail}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaFileMedical className="w-4 h-4 text-amber-600" />
                  KYC Submission Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submitted:</span>
                    <span className="font-medium text-gray-900">{selectedKYC.submitted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <Badge variant={getStatusBadge(selectedKYC.status)}>{selectedKYC.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Documents:</span>
                    <span className="font-medium text-gray-900">{selectedKYC.documents} uploaded</span>
                  </div>
                  {selectedKYC.documentsList && (
                    <div className="mt-3">
                      <p className="text-gray-500 mb-2">Document Types:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedKYC.documentsList.map((doc, idx) => (
                          <Badge key={idx} variant="info">{doc}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default KYCAssistance;

