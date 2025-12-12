/**
 * Feedback Modal Component
 * Submit feedback for doctor/hospital services
 */

import { useState } from "react";
import Modal from "../shared/Modal";
import FormInput from "../shared/FormInput";
import FormSelect from "../shared/FormSelect";
import { feedbackApi } from "../../api/patient/feedbackApi";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

const FeedbackModal = ({ isOpen, onClose, appointmentId, doctorId }) => {
  const [formData, setFormData] = useState({
    feedbackType: "doctor",
    rating: 5,
    comment: "",
    cleanliness: 5,
    staffBehavior: 5,
    waitTime: 5,
    overallExperience: 5,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await feedbackApi.submit({
        ...formData,
        appointmentId,
        doctorId,
      });
      toast.success("Feedback submitted successfully!");
      onClose();
      setFormData({
        feedbackType: "doctor",
        rating: 5,
        comment: "",
        cleanliness: 5,
        staffBehavior: 5,
        waitTime: 5,
        overallExperience: 5,
      });
    } catch {
      toast.error("Error submitting feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, label }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-2xl ${
              star <= value ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-400 transition-colors`}>
            <FaStar />
          </button>
        ))}
      </div>
    </div>
  );

  const feedbackTypeOptions = [
    { value: "doctor", label: "Doctor" },
    { value: "hospital", label: "Hospital" },
    { value: "service", label: "Service" },
    { value: "other", label: "Other" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Feedback" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSelect
          label="Feedback Type"
          name="feedbackType"
          value={formData.feedbackType}
          onChange={(e) =>
            setFormData({ ...formData, feedbackType: e.target.value })
          }
          options={feedbackTypeOptions}
          required
        />

        <StarRating
          label="Overall Rating"
          value={formData.rating}
          onChange={(value) => setFormData({ ...formData, rating: value })}
        />

        {formData.feedbackType === "hospital" && (
          <>
            <StarRating
              label="Cleanliness"
              value={formData.cleanliness}
              onChange={(value) =>
                setFormData({ ...formData, cleanliness: value })
              }
            />
            <StarRating
              label="Staff Behavior"
              value={formData.staffBehavior}
              onChange={(value) =>
                setFormData({ ...formData, staffBehavior: value })
              }
            />
            <StarRating
              label="Wait Time"
              value={formData.waitTime}
              onChange={(value) =>
                setFormData({ ...formData, waitTime: value })
              }
            />
            <StarRating
              label="Overall Experience"
              value={formData.overallExperience}
              onChange={(value) =>
                setFormData({ ...formData, overallExperience: value })
              }
            />
          </>
        )}

        <FormInput
          label="Comments (Optional)"
          name="comment"
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
        />

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            disabled={submitting}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackModal;
