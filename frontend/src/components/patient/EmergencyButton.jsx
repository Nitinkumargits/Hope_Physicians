/**
 * Emergency Button Component
 * SOS trigger for emergencies
 */

import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import Modal from "../shared/Modal";
import FormInput from "../shared/FormInput";
import FormSelect from "../shared/FormSelect";
import { emergencyApi } from "../../api/staff/nurseApi";
import toast from "react-hot-toast";

const EmergencyButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [formData, setFormData] = useState({
    alertType: "medical",
    severity: "critical",
    location: "",
    description: "",
  });

  const handleTrigger = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setTriggering(true);
      await emergencyApi.trigger({
        ...formData,
        patientId: null, // Will be set from auth context
      });
      toast.success("Emergency alert triggered! Help is on the way.");
      setIsModalOpen(false);
      setFormData({
        alertType: "medical",
        severity: "critical",
        location: "",
        description: "",
      });
    } catch {
      toast.error("Error triggering emergency alert");
    } finally {
      setTriggering(false);
    }
  };

  const alertTypeOptions = [
    { value: "medical", label: "Medical Emergency" },
    { value: "cardiac", label: "Cardiac" },
    { value: "respiratory", label: "Respiratory" },
    { value: "fall", label: "Fall" },
    { value: "other", label: "Other" },
  ];

  const severityOptions = [
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
  ];

  return (
    <>
      <button
        onClick={handleTrigger}
        className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50 flex items-center space-x-2"
        title="Emergency SOS">
        <FaExclamationTriangle className="w-6 h-6" />
        <span className="hidden md:inline">SOS</span>
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Emergency Alert">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-semibold">
              ⚠️ This will trigger an emergency alert. Use only in case of
              actual emergency.
            </p>
          </div>

          <FormSelect
            label="Emergency Type"
            name="alertType"
            value={formData.alertType}
            onChange={(e) =>
              setFormData({ ...formData, alertType: e.target.value })
            }
            options={alertTypeOptions}
            required
          />

          <FormSelect
            label="Severity"
            name="severity"
            value={formData.severity}
            onChange={(e) =>
              setFormData({ ...formData, severity: e.target.value })
            }
            options={severityOptions}
            required
          />

          <FormInput
            label="Location (Room/Bed)"
            name="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="e.g., Room 101, Bed A"
          />

          <FormInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe the emergency..."
            required
          />

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              disabled={triggering}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={triggering}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
              {triggering ? "Triggering..." : "Trigger Emergency Alert"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EmergencyButton;
