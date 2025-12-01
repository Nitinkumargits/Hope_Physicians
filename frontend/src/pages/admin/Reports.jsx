import React, { useState } from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { FaChartLine, FaDownload, FaFilePdf, FaFileExcel } from 'react-icons/fa';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = [
    { id: 1, name: 'Monthly Patient Report', description: 'Patient statistics and demographics', type: 'monthly' },
    { id: 2, name: 'Appointment Summary', description: 'All appointments for selected period', type: 'appointments' },
    { id: 3, name: 'Revenue Report', description: 'Financial overview and billing', type: 'revenue' },
    { id: 4, name: 'Staff Performance', description: 'Employee attendance and productivity', type: 'staff' },
    { id: 5, name: 'KYC Status Report', description: 'KYC document review status', type: 'kyc' }
  ];

  const handleGenerateReport = (report) => {
    setSelectedReport(report);
    // In production, this would call an API to generate the report
    setTimeout(() => {
      setSelectedReport(null);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Generate and download system reports</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <FaChartLine className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{report.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateReport(report)}
                  disabled={selectedReport?.id === report.id}
                  className="flex-1"
                >
                  {selectedReport?.id === report.id ? (
                    'Generating...'
                  ) : (
                    <>
                      <FaFilePdf className="w-4 h-4 mr-1" />
                      PDF
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateReport(report)}
                  disabled={selectedReport?.id === report.id}
                  className="flex-1"
                >
                  {selectedReport?.id === report.id ? (
                    'Generating...'
                  ) : (
                    <>
                      <FaFileExcel className="w-4 h-4 mr-1" />
                      Excel
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;

