import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/portal/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Card from '../../components/shared/Card';
import DataTable from '../../components/shared/DataTable';
import Button from '../../components/shared/Button';
import Badge from '../../components/shared/Badge';
import Modal from '../../components/shared/Modal';
import { adminApi } from '../../api/admin/adminApi';
import toast from 'react-hot-toast';
import { FaFilePdf, FaCheckCircle, FaTimesCircle, FaEye, FaDownload } from 'react-icons/fa';

const KYCReview = () => {
  const navigate = useNavigate();
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [remark, setRemark] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchKYC();
  }, [filterStatus]);

  const fetchKYC = async () => {
    try {
      setLoading(true);
      const params = { 
        page: 1,
        limit: 100
      };
      
      // Only add status filter if not 'all'
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      
      const res = await adminApi.getKYCDocuments(params);
      
      const kycDocs = res.data?.data || [];
      
      // Format KYC documents for display
      const formattedKYC = kycDocs.map(kyc => {
        // Count uploaded documents
        const docCount = [
          kyc.salarySlip1, kyc.salarySlip2, kyc.salarySlip3,
          kyc.cancelledCheque, kyc.passbook,
          kyc.aadhaarFront, kyc.aadhaarBack,
          kyc.educationalDoc1, kyc.educationalDoc2, kyc.educationalDoc3
        ].filter(Boolean).length;

        return {
          id: kyc.id,
          patient_name: `${kyc.patient?.firstName || ''} ${kyc.patient?.lastName || ''}`.trim(),
          patientId: kyc.patientId,
          patientEmail: kyc.patient?.email,
          patientPhone: kyc.patient?.phone,
          submitted_date: new Date(kyc.createdAt).toLocaleDateString(),
          submittedDate: kyc.createdAt,
          status: kyc.status,
          documents: docCount,
          reviewedBy: kyc.reviewedBy,
          reviewedAt: kyc.reviewedAt,
          rejectionRemarks: kyc.rejectionRemarks,
          // Document URLs
          salarySlip1: kyc.salarySlip1,
          salarySlip2: kyc.salarySlip2,
          salarySlip3: kyc.salarySlip3,
          cancelledCheque: kyc.cancelledCheque,
          passbook: kyc.passbook,
          aadhaarFront: kyc.aadhaarFront,
          aadhaarBack: kyc.aadhaarBack,
          educationalDoc1: kyc.educationalDoc1,
          educationalDoc2: kyc.educationalDoc2,
          educationalDoc3: kyc.educationalDoc3,
          // Full KYC object for modal
          fullKYC: kyc
        };
      });
      
      setKycList(formattedKYC);
    } catch (error) {
      console.error('Failed to fetch KYC:', error);
      toast.error('Failed to load KYC documents');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action) => {
    if (!selectedKYC) return;
    
    // Validate rejection remarks
    if (action === 'reject' && !remark.trim()) {
      toast.error('Please provide remarks for rejection');
      return;
    }
    
    try {
      setProcessing(true);
      await adminApi.reviewKYC(selectedKYC.id, {
        action,
        remarks: remark.trim()
      });
      
      toast.success(`KYC ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      setReviewModal(false);
      setSelectedKYC(null);
      setRemark('');
      fetchKYC();
    } catch (error) {
      console.error('Failed to review KYC:', error);
      toast.error(error.response?.data?.message || `Failed to ${action} KYC`);
    } finally {
      setProcessing(false);
    }
  };

  const getDocumentList = (kyc) => {
    const docs = [];
    if (kyc.salarySlip1) docs.push({ name: 'Salary Slip 1', url: kyc.salarySlip1 });
    if (kyc.salarySlip2) docs.push({ name: 'Salary Slip 2', url: kyc.salarySlip2 });
    if (kyc.salarySlip3) docs.push({ name: 'Salary Slip 3', url: kyc.salarySlip3 });
    if (kyc.cancelledCheque) docs.push({ name: 'Cancelled Cheque', url: kyc.cancelledCheque });
    if (kyc.passbook) docs.push({ name: 'Passbook', url: kyc.passbook });
    if (kyc.aadhaarFront) docs.push({ name: 'Aadhaar Front', url: kyc.aadhaarFront });
    if (kyc.aadhaarBack) docs.push({ name: 'Aadhaar Back', url: kyc.aadhaarBack });
    if (kyc.educationalDoc1) docs.push({ name: 'Educational Document 1', url: kyc.educationalDoc1 });
    if (kyc.educationalDoc2) docs.push({ name: 'Educational Document 2', url: kyc.educationalDoc2 });
    if (kyc.educationalDoc3) docs.push({ name: 'Educational Document 3', url: kyc.educationalDoc3 });
    return docs;
  };

  const columns = [
    { 
      key: 'patient_name',
      label: 'Patient Name',
      accessor: (row) => row.patient_name,
      render: (value, row) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-xs text-gray-500">{row.patientEmail}</div>
        </div>
      )
    },
    { 
      key: 'submitted_date',
      label: 'Submitted Date',
      accessor: (row) => row.submitted_date
    },
    { 
      key: 'documents',
      label: 'Documents',
      accessor: (row) => row.documents,
      render: (value) => (
        <span className="font-medium">{value} files</span>
      )
    },
    { 
      key: 'status',
      label: 'Status',
      accessor: (row) => row.status,
      badge: true,
      render: (value) => {
        const variant = value === 'approved' ? 'success' : value === 'rejected' ? 'danger' : 'warning';
        return (
          <Badge variant={variant}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="primary" 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedKYC(row);
              setReviewModal(true);
            }}
          >
            <FaEye className="mr-1" />
            Review
          </Button>
        </div>
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">KYC Review</h1>
              <p className="text-gray-600 mt-1">Review and approve patient KYC documents</p>
            </div>
            <Button onClick={() => navigate('/admin')}>
              Back to Dashboard
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 font-medium transition-colors ${
                filterStatus === 'approved'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 font-medium transition-colors ${
                filterStatus === 'rejected'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
          </div>

          <Card>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading KYC documents...</div>
              </div>
            ) : kycList.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No KYC documents found</div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={kycList}
                loading={loading}
                onRowClick={(row) => {
                  setSelectedKYC(row);
                  setReviewModal(true);
                }}
              />
            )}
          </Card>

          <Modal
            isOpen={reviewModal}
            onClose={() => {
              setReviewModal(false);
              setSelectedKYC(null);
              setRemark('');
            }}
            title={`Review KYC - ${selectedKYC?.patient_name}`}
            size="xl"
            footer={
              selectedKYC?.status === 'pending' || selectedKYC?.status === 'submitted' || selectedKYC?.status === 'under_review' ? (
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setReviewModal(false);
                      setSelectedKYC(null);
                      setRemark('');
                    }}
                    disabled={processing}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleReview('reject')}
                    disabled={processing}
                  >
                    <FaTimesCircle className="mr-2" />
                    Reject
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => handleReview('approve')}
                    disabled={processing}
                  >
                    <FaCheckCircle className="mr-2" />
                    Approve
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setReviewModal(false);
                      setSelectedKYC(null);
                      setRemark('');
                    }}
                  >
                    Close
                  </Button>
                </div>
              )
            }
          >
            {selectedKYC && (
              <div className="space-y-6">
                {/* Patient Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{selectedKYC.patient_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedKYC.patientEmail || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedKYC.patientPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Submitted Date</p>
                      <p className="font-medium">{selectedKYC.submitted_date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge variant={selectedKYC.status === 'approved' ? 'success' : selectedKYC.status === 'rejected' ? 'danger' : 'warning'}>
                        {selectedKYC.status.charAt(0).toUpperCase() + selectedKYC.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Documents</p>
                      <p className="font-medium">{selectedKYC.documents} files</p>
                    </div>
                  </div>
                </div>

                {/* Review Information */}
                {selectedKYC.reviewedAt && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Review Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Reviewed At</p>
                        <p className="font-medium">{new Date(selectedKYC.reviewedAt).toLocaleString()}</p>
                      </div>
                      {selectedKYC.rejectionRemarks && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">Rejection Remarks</p>
                          <p className="font-medium">{selectedKYC.rejectionRemarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Submitted Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getDocumentList(selectedKYC).map((doc, index) => (
                      <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FaFilePdf className="text-red-600" />
                            <span className="font-medium text-sm">{doc.name}</span>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                          >
                            <FaDownload />
                            <span>View</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  {getDocumentList(selectedKYC).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No documents uploaded</p>
                  )}
                </div>

                {/* Remarks Section */}
                {(selectedKYC.status === 'pending' || selectedKYC.status === 'submitted' || selectedKYC.status === 'under_review') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks {selectedKYC.status === 'rejected' && '(Required for rejection)'}
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="Add your remarks here (required for rejection)..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Add remarks explaining your decision. Remarks are required when rejecting.
                    </p>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default KYCReview;

