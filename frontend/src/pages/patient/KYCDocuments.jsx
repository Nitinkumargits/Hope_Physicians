import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Badge from '../../components/shared/Badge';
import { FaUpload, FaFile, FaCheckCircle } from 'react-icons/fa';

const KYCDocuments = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [kycStatus, setKycStatus] = useState('pending');

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      status: 'uploading'
    }))]);

    // Simulate upload
    selectedFiles.forEach((file, idx) => {
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === prev[prev.length - selectedFiles.length + idx].id 
            ? { ...f, status: 'uploaded' }
            : f
        ));
      }, 1000);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload({ target: { files: droppedFiles } });
  };

  const documentTypes = [
    { id: 'id', label: 'Government ID', required: true },
    { id: 'insurance', label: 'Insurance Card', required: true },
    { id: 'address', label: 'Proof of Address', required: false }
  ];

  return (
    <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">KYC Documents</h1>
            <p className="text-gray-600 mt-1">Upload and manage your identity verification documents</p>
          </div>

          {/* Status Card */}
          <Card className="bg-gradient-to-r from-primary to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">KYC Status</p>
                <p className="text-2xl font-bold capitalize">{kycStatus}</p>
              </div>
              <Badge variant="secondary" className="bg-white text-primary">
                {kycStatus === 'approved' ? 'Verified' : kycStatus === 'rejected' ? 'Rejected' : 'Under Review'}
              </Badge>
            </div>
          </Card>

          {/* Upload Area */}
          <Card title="Upload Documents">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
            >
              <FaUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag & drop files here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: PDF, JPG, PNG (Max 10MB per file)
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" as="span">Choose Files</Button>
              </label>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-gray-900">Uploaded Files</h3>
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FaFile className="text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    {file.status === 'uploaded' ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Required Documents */}
          <Card title="Required Documents">
            <div className="space-y-3">
              {documentTypes.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{doc.label}</p>
                    {doc.required && (
                      <Badge variant="danger" className="mt-1">Required</Badge>
                    )}
                  </div>
                  <Badge variant="success">Uploaded</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
  );
};

export default KYCDocuments;

