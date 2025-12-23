import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/portal/DashboardLayout";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import Button from "../../components/shared/Button";
import Modal from "../../components/shared/Modal";
import {
  FaEnvelope,
  FaSearch,
  FaFilter,
  FaEye,
  FaSpinner,
  FaCheckCircle,
  FaReply,
  FaArchive,
  FaPhone,
} from "react-icons/fa";
import {
  getContactMessages,
  getContactMessage,
  updateMessageStatus,
} from "../../services/contactService";
import toast from "react-hot-toast";

const ContactMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100,
      };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await getContactMessages(params);
      setMessages(response.data || []);
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      toast.error("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMessages();
  };

  const viewMessage = async (messageId) => {
    try {
      const response = await getContactMessage(messageId);
      setSelectedMessage(response.data);
      setIsModalOpen(true);
      // Refresh messages to update status
      fetchMessages();
    } catch (error) {
      console.error("Error fetching message:", error);
      toast.error("Failed to load message details");
    }
  };

  const handleStatusUpdate = async (messageId, newStatus) => {
    try {
      setProcessing(true);
      await updateMessageStatus(messageId, newStatus);
      toast.success(`Message marked as ${newStatus}`);
      fetchMessages();
      if (selectedMessage && selectedMessage.id === messageId) {
        const updated = await getContactMessage(messageId);
        setSelectedMessage(updated.data);
      }
    } catch (error) {
      console.error("Error updating message status:", error);
      toast.error("Failed to update message status");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      new: "primary",
      read: "info",
      replied: "success",
      archived: "secondary",
    };
    return variants[status] || "default";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredMessages = messages.filter((message) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      message.firstName?.toLowerCase().includes(search) ||
      message.lastName?.toLowerCase().includes(search) ||
      message.email?.toLowerCase().includes(search) ||
      message.subject?.toLowerCase().includes(search) ||
      message.message?.toLowerCase().includes(search)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-600 mt-1">
              View and manage contact form submissions
            </p>
          </div>
          <Button onClick={() => navigate("/doctor")}>
            Back to Dashboard
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-1">Total Messages</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-1">New</div>
              <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-1">Read</div>
              <div className="text-2xl font-bold text-indigo-600">{stats.read}</div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-1">Replied</div>
              <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-1">Archived</div>
              <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
                <Button onClick={handleSearch}>
                  <FaSearch className="mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Messages Table */}
        <Card>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FaEnvelope className="mx-auto text-4xl mb-4 text-gray-400" />
                <p>No contact messages found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {message.firstName} {message.lastName}
                        </div>
                        {message.phone && (
                          <div className="text-sm text-gray-500">
                            <FaPhone className="inline mr-1" />
                            {message.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{message.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {message.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadge(message.status)}>
                          {message.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(message.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewMessage(message.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details">
                            <FaEye />
                          </button>
                          {message.status !== "replied" && (
                            <button
                              onClick={() => handleStatusUpdate(message.id, "replied")}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Replied"
                              disabled={processing}>
                              <FaReply />
                            </button>
                          )}
                          {message.status !== "archived" && (
                            <button
                              onClick={() => handleStatusUpdate(message.id, "archived")}
                              className="text-gray-600 hover:text-gray-900"
                              title="Archive"
                              disabled={processing}>
                              <FaArchive />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Message Detail Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMessage(null);
          }}
          title="Message Details"
          size="lg">
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Name</label>
                  <p className="text-gray-900">
                    {selectedMessage.firstName} {selectedMessage.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone</label>
                    <p className="text-gray-900">{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <div>
                    <Badge variant={getStatusBadge(selectedMessage.status)}>
                      {selectedMessage.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Date</label>
                  <p className="text-gray-900">{formatDate(selectedMessage.createdAt)}</p>
                </div>
                {selectedMessage.readAt && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Read At</label>
                    <p className="text-gray-900">{formatDate(selectedMessage.readAt)}</p>
                  </div>
                )}
                {selectedMessage.repliedAt && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Replied At</label>
                    <p className="text-gray-900">{formatDate(selectedMessage.repliedAt)}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Subject</label>
                <p className="text-gray-900">{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Message</label>
                <div className="mt-1 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                {selectedMessage.status !== "read" && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedMessage.id, "read")}
                    disabled={processing}
                    variant="secondary">
                    <FaCheckCircle className="mr-2" />
                    Mark as Read
                  </Button>
                )}
                {selectedMessage.status !== "replied" && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedMessage.id, "replied")}
                    disabled={processing}
                    variant="success">
                    <FaReply className="mr-2" />
                    Mark as Replied
                  </Button>
                )}
                {selectedMessage.status !== "archived" && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedMessage.id, "archived")}
                    disabled={processing}
                    variant="secondary">
                    <FaArchive className="mr-2" />
                    Archive
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ContactMessages;

