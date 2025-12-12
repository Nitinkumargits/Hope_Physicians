import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/portal/DashboardLayout";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import Button from "../../components/shared/Button";
import Modal from "../../components/shared/Modal";
import {
  FaFileAlt,
  FaSearch,
  FaFilter,
  FaEye,
  FaSpinner,
  FaDownload,
  FaCalendar,
  FaUser,
  FaPlus,
  FaExternalLinkAlt,
} from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import toast from "react-hot-toast";

const PatientForms = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const modalContentRef = useRef(null);
  const listRef = useRef(null);

  const typeOptions = [
    { type: "all", label: "All Forms" },
    { type: "patient_info", label: "Patient Information" },
    { type: "privacy_ack", label: "Privacy Acknowledgement" },
    { type: "parental_consent", label: "Parental Consent" },
    { type: "release_info", label: "Release of Information" },
    { type: "other", label: "Other Forms" },
  ];

  useEffect(() => {
    fetchSubmissions();
  }, [filterType]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = {};
      if (filterType !== "all") {
        params.formType = filterType;
      }

      const response = await axios.get(`${API_BASE_URL}/patient-forms/all`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubmissions(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching form submissions:", error);
      toast.error("Failed to load form submissions");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesText = search
      ? [
          submission.patientName,
          submission.email,
          submission.phoneMobile,
          submission.phoneHome,
        ]
          .filter(Boolean)
          .some((val) => val.toLowerCase().includes(search))
      : true;

    const matchesFormType =
      filterType === "all"
        ? true
        : filterType === "other"
        ? submission.formType !== "patient_info" &&
          submission.formType !== "privacy_ack" &&
          submission.formType !== "parental_consent" &&
          submission.formType !== "release_info"
        : submission.formType === filterType;

    return matchesText && matchesFormType;
  });

  const getFormTypeLabel = (formType) => {
    const labels = {
      patient_info: "Patient Information",
      privacy_ack: "Privacy Acknowledgement",
      parental_consent: "Parental Consent",
      release_info: "Release of Information",
    };
    return labels[formType] || formType;
  };

  const getFormTypeBadge = (formType) => {
    const variants = {
      patient_info: "primary",
      privacy_ack: "info",
      parental_consent: "warning",
      release_info: "success",
    };
    return variants[formType] || "default";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const viewFormDetails = (submission) => {
    setSelectedForm(submission);
    setIsModalOpen(true);
  };

  const scrollToList = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleCardFilter = (type) => {
    setFilterType(type);
    scrollToList();
  };

  const getCount = (type) => {
    if (type === "all") return submissions.length;
    if (type === "other") {
      return submissions.filter(
        (s) =>
          s.formType !== "patient_info" &&
          s.formType !== "privacy_ack" &&
          s.formType !== "parental_consent" &&
          s.formType !== "release_info"
      ).length;
    }
    return submissions.filter((s) => s.formType === type).length;
  };

  // Scroll the modal content into view when opened so users don't miss it
  useEffect(() => {
    if (isModalOpen) {
      requestAnimationFrame(() => {
        modalContentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [isModalOpen, selectedForm]);

  const renderFormDetails = () => {
    if (!selectedForm) return null;

    const formData =
      typeof selectedForm.formData === "string"
        ? JSON.parse(selectedForm.formData)
        : selectedForm.formData || selectedForm;

    return (
      <div
        className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100"
        ref={modalContentRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Form Type
            </label>
            <p className="text-gray-900 font-semibold text-lg">
              {getFormTypeLabel(selectedForm.formType)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Submitted Date
            </label>
            <p className="text-gray-900 font-medium">
              {formatDate(selectedForm.createdAt)}
            </p>
          </div>
        </div>

        {selectedForm.patientName && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Patient Name
            </label>
            <p className="text-gray-900 font-medium text-lg">
              {selectedForm.patientName}
            </p>
          </div>
        )}

        {selectedForm.email && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Email
            </label>
            <p className="text-gray-900 font-medium">{selectedForm.email}</p>
          </div>
        )}

        {selectedForm.formType === "patient_info" && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="font-semibold text-xl mb-6 text-gray-900 flex items-center gap-2">
              <FaUser className="w-5 h-5 text-primary" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.patientName && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Patient Name
                  </label>
                  <p className="text-gray-900 font-medium text-lg">
                    {formData.patientName}
                  </p>
                </div>
              )}
              {formData.dob && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Date of Birth
                  </label>
                  <p className="text-gray-900 font-medium">
                    {new Date(formData.dob).toLocaleDateString()}
                  </p>
                </div>
              )}
              {formData.streetAddress && (
                <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Address
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formData.streetAddress}, {formData.city}, {formData.state}{" "}
                    {formData.zipCode}
                  </p>
                </div>
              )}
              {formData.phoneMobile && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Mobile Phone
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formData.phoneMobile}
                  </p>
                </div>
              )}
              {formData.phoneHome && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Home Phone
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formData.phoneHome}
                  </p>
                </div>
              )}
              {formData.gender && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Gender
                  </label>
                  <p className="text-gray-900 font-medium capitalize">
                    {formData.gender}
                  </p>
                </div>
              )}
              {formData.maritalStatus && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Marital Status
                  </label>
                  <p className="text-gray-900 font-medium capitalize">
                    {formData.maritalStatus}
                  </p>
                </div>
              )}
              {formData.race && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Race
                  </label>
                  <p className="text-gray-900 font-medium capitalize">
                    {formData.race}
                  </p>
                </div>
              )}
              {formData.emergencyContact && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Emergency Contact
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formData.emergencyContact} - {formData.emergencyPhone}
                  </p>
                </div>
              )}
              {formData.pharmacyName && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Pharmacy Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formData.pharmacyName}
                  </p>
                </div>
              )}
              {formData.policyNumber && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Insurance Policy #
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formData.policyNumber}
                  </p>
                </div>
              )}
              {formData.groupNumber && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Group #
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formData.groupNumber}
                  </p>
                </div>
              )}
              {formData.patientSignature && (
                <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Signature
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formData.patientSignature}
                  </p>
                </div>
              )}
              {formData.signatureDate && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Signature Date
                  </label>
                  <p className="text-gray-900 font-medium">
                    {new Date(formData.signatureDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Show all form data for non-patient info in a clean grid */}
        {selectedForm.formType !== "patient_info" && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="font-semibold text-xl mb-4 text-gray-900">
              Form Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData || {})
                .filter(
                  ([, value]) =>
                    value !== null &&
                    value !== undefined &&
                    value !== "" &&
                    typeof value !== "object"
                )
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                      {key
                        .replace(/_/g, " ")
                        .replace(/([a-z])([A-Z])/g, "$1 $2")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </label>
                    <p className="text-gray-900 font-medium break-words">
                      {typeof value === "string" && !isNaN(Date.parse(value))
                        ? new Date(value).toLocaleDateString()
                        : value}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Patient Form Submissions
            </h1>
            <p className="text-gray-600 mt-1">
              View all submitted patient forms
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => navigate("/patient-form")}
              className="flex items-center gap-2">
              <FaPlus className="w-4 h-4" />
              Submit New Form
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open("/patient-form", "_blank")}
              className="flex items-center gap-2">
              <FaExternalLinkAlt className="w-4 h-4" />
              Open in New Tab
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 shadow-md">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by patient name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <FaFilter className="text-gray-500 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-5 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium min-w-[200px]">
                <option value="all">All Forms</option>
                <option value="patient_info">Patient Information</option>
                <option value="privacy_ack">Privacy Acknowledgement</option>
                <option value="parental_consent">Parental Consent</option>
                <option value="release_info">Release of Information</option>
                <option value="other">Other Forms</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary/20">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Total Submissions
                </p>
                <FaFileAlt className="w-8 h-8 text-primary opacity-80" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-4">{total}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCardFilter("all")}
                className="mt-auto w-full justify-center hover:bg-primary/10">
                View all
              </Button>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500/20">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Patient Info
                </p>
                <FaUser className="w-8 h-8 text-blue-500 opacity-80" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                {getCount("patient_info")}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCardFilter("patient_info")}
                className="mt-auto w-full justify-center hover:bg-blue-50">
                View patient info
              </Button>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500/20">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Privacy Forms
                </p>
                <FaFileAlt className="w-8 h-8 text-green-500 opacity-80" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                {getCount("privacy_ack")}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCardFilter("privacy_ack")}
                className="mt-auto w-full justify-center hover:bg-green-50">
                View privacy
              </Button>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500/20">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Parental Consent
                </p>
                <FaFileAlt className="w-8 h-8 text-purple-500 opacity-80" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                {getCount("parental_consent")}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCardFilter("parental_consent")}
                className="mt-auto w-full justify-center hover:bg-purple-50">
                View consent
              </Button>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary/20">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Release Info
                </p>
                <FaFileAlt className="w-8 h-8 text-primary opacity-80" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                {getCount("release_info")}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCardFilter("release_info")}
                className="mt-auto w-full justify-center hover:bg-primary/10">
                View release
              </Button>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500/20">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Other Forms
                </p>
                <FaFileAlt className="w-8 h-8 text-purple-500 opacity-80" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                {getCount("other")}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCardFilter("other")}
                className="mt-auto w-full justify-center hover:bg-purple-50">
                View other
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick filter buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-6 px-4">
          {typeOptions.map((opt) => (
            <Button
              key={opt.type}
              variant={filterType === opt.type ? "primary" : "outline"}
              onClick={() => handleCardFilter(opt.type)}
              className={`px-6 py-2.5 font-semibold rounded-lg transition-all ${
                filterType === opt.type
                  ? "shadow-md scale-105"
                  : "hover:scale-105"
              }`}>
              {opt.label}
            </Button>
          ))}
        </div>

        {/* Submissions List */}
        <Card ref={listRef} className="shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Form Submissions
              {filterType !== "all" && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredSubmissions.length}{" "}
                  {filterType === "other"
                    ? "other"
                    : getFormTypeLabel(filterType)}
                  )
                </span>
              )}
            </h2>
          </div>
          {loading ? (
            <div className="text-center py-16">
              <FaSpinner className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600 text-lg">
                Loading form submissions...
              </p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-16">
              <FaFileAlt className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">
                No form submissions found
              </p>
              <p className="text-gray-500 text-sm mb-6">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Submit a new form to get started"}
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/patient-form")}
                className="flex items-center gap-2 mx-auto shadow-md">
                <FaPlus className="w-4 h-4" />
                Submit New Form
              </Button>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <Badge variant={getFormTypeBadge(submission.formType)}>
                          {getFormTypeLabel(submission.formType)}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FaCalendar className="w-3.5 h-3.5" />
                          {formatDate(submission.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gray-400 w-4 h-4" />
                          <p className="font-semibold text-gray-900">
                            {submission.patientName || "Patient"}
                          </p>
                        </div>
                        {submission.email && (
                          <p className="text-sm text-gray-600 truncate max-w-[220px]">
                            {submission.email}
                          </p>
                        )}
                        {submission.phoneMobile && (
                          <p className="text-sm text-gray-600">
                            {submission.phoneMobile}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewFormDetails(submission)}
                        className="hover:bg-primary/10 hover:text-primary transition-colors">
                        <FaEye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Form Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Form Details - ${
            selectedForm ? getFormTypeLabel(selectedForm.formType) : ""
          }`}
          size="lg">
          {renderFormDetails()}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default PatientForms;
