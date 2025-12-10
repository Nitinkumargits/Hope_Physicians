import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { submitAppointment } from '../../api/appointmentApi';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department: '',
    preferredDate: '',
    preferredTime: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const departments = [
    'Family Medicine',
    'Pediatric Care',
    "Men's Health",
    "Women's Health",
    'Occupational Health',
    'Geriatric Care'
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitAppointment({
        ...formData,
        name: 'Current User',
        email: 'user@example.com',
        phone: '252-522-3663'
      });
      setSuccess(true);
      setTimeout(() => navigate('/patient/appointments'), 2000);
    } catch (error) {
      console.error('Failed to book appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Appointment Booked!</h2>
        <p className="text-gray-600">Your appointment request has been submitted successfully.</p>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
            <p className="text-gray-600 mt-1">Schedule your visit with our healthcare professionals</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Describe your symptoms or reason for visit..."
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" loading={loading}>
                Book Appointment
              </Button>
            </form>
          </Card>
        </div>
  );
};

export default BookAppointment;

