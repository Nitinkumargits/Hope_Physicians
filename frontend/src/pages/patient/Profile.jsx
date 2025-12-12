/**
 * Patient Profile Page
 * View and edit patient profile information
 */

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import FormInput from "../../components/shared/FormInput";
import Modal from "../../components/shared/Modal";
import toast from "react-hot-toast";
import { FaEdit, FaUser } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = API_BASE_URL;

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/patients/${user?.patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatientData(res.data);
      setFormData({
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        dateOfBirth: res.data.dateOfBirth
          ? new Date(res.data.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: res.data.gender || "",
        address: res.data.address || "",
        city: res.data.city || "",
        state: res.data.state || "",
        zipCode: res.data.zipCode || "",
        emergencyContact: res.data.emergencyContact || "",
        emergencyPhone: res.data.emergencyPhone || "",
      });
    } catch (error) {
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/patients/${user?.patientId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
      loadPatientData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <FaEdit />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <FaUser className="text-3xl text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {patientData?.firstName} {patientData?.lastName}
            </h2>
            <p className="text-gray-600">{patientData?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">First Name</label>
            <p className="font-medium">{patientData?.firstName}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Last Name</label>
            <p className="font-medium">{patientData?.lastName}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="font-medium">{patientData?.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <p className="font-medium">{patientData?.phone}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Date of Birth</label>
            <p className="font-medium">
              {patientData?.dateOfBirth
                ? new Date(patientData.dateOfBirth).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <p className="font-medium">{patientData?.gender || "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Address</label>
            <p className="font-medium">{patientData?.address || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">City</label>
            <p className="font-medium">{patientData?.city || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">State</label>
            <p className="font-medium">{patientData?.state || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Zip Code</label>
            <p className="font-medium">{patientData?.zipCode || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Emergency Contact</label>
            <p className="font-medium">
              {patientData?.emergencyContact || "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Emergency Phone</label>
            <p className="font-medium">
              {patientData?.emergencyPhone || "N/A"}
            </p>
          </div>
        </div>

        {patientData?.insuranceProvider && (
          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-4">Insurance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600">
                  Insurance Provider
                </label>
                <p className="font-medium">{patientData.insuranceProvider}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Insurance Number
                </label>
                <p className="font-medium">
                  {patientData.insuranceNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        size="lg">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <FormInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <FormInput
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
            />
            <FormInput
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            />
          </div>

          <FormInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="City"
              name="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
            <FormInput
              label="State"
              name="state"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
            />
            <FormInput
              label="Zip Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={(e) =>
                setFormData({ ...formData, zipCode: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Emergency Contact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) =>
                setFormData({ ...formData, emergencyContact: e.target.value })
              }
            />
            <FormInput
              label="Emergency Phone"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={(e) =>
                setFormData({ ...formData, emergencyPhone: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Update Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
