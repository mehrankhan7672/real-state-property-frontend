import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AgentHeader from "./agent/AgentHeader";
import StatsCards from "./agent/StatsCards";
import PropertiesList from "./agent/PropertiesList";
import AddPropertyForm from "./agent/AddPropertyForm";
import PropertyModal from "./agent/PropertyModal";
import LogoutConfirmModal from "./agent/LogoutConfirmModal";
import SuccessMessage from "./agent/SuccessMessage";
import ErrorMessage from "./agent/ErrorMessage";
import "./css/agentCss.css";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("properties");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Property detail modal states
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    beds: "",
    baths: "",
    sqft: "",
    propertyType: "apartment",
    description: "",
    badge: "New",
    status: "available",
  });

  // Separate state for images
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Properties list from API
  const [properties, setProperties] = useState([]);
  const [statsData, setStatsData] = useState({
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    totalAED: 0,
  });

  // Loading states for individual actions
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState(null);

  // Inbox state
  const [inquiries, setInquiries] = useState([]);
  const [pendingInquiries, setPendingInquiries] = useState(0);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Reply modal state
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // API URL
  const API_BASE_URL = "https://real-state-property-backend.vercel.app/";

  // ============ FUNCTIONS ============

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch replies for a specific inquiry
  const fetchRepliesForInquiry = async (inquiryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/replies/${inquiryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching replies:", error);
      return [];
    }
  };

  // Fetch inquiries from API with replies
  const fetchInquiries = async () => {
    try {
      setLoadingInquiries(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_BASE_URL}/get-agent-inquiries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const inquiriesData = response.data.inquiries || [];

        // Fetch replies for each inquiry
        const inquiriesWithReplies = await Promise.all(
          inquiriesData.map(async (inquiry) => {
            const replies = await fetchRepliesForInquiry(inquiry._id);
            return { ...inquiry, replies };
          }),
        );

        setInquiries(inquiriesWithReplies);
        const pendingCount = inquiriesWithReplies.filter(
          (inq) => inq.status === "pending" || !inq.status,
        ).length;
        setPendingInquiries(pendingCount);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setInquiries([]);
      setPendingInquiries(0);
    } finally {
      setLoadingInquiries(false);
    }
  };

  // Send reply to inquiry using Reply model
  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      setError("Please enter a reply message");
      return;
    }

    try {
      setSendingReply(true);
      const token = localStorage.getItem("token");

      // Use the Reply model endpoint with /replies route
      const response = await axios.post(
        `${API_BASE_URL}/replies/${selectedInquiry._id}`,
        {
          message: replyMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setSuccessMessageText("✅ Reply sent successfully!");
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);

        // Close modal and refresh inquiries
        setShowReplyModal(false);
        setSelectedInquiry(null);
        setReplyMessage("");
        fetchInquiries();
      } else {
        setError(response.data.message || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      setError(error.response?.data?.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  // Open reply modal
  const openReplyModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setReplyMessage("");
    setShowReplyModal(true);
  };

  // Cleanup image previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [imagePreviews]);

  // Check authentication and fetch properties
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role?.toLowerCase() !== "agent") {
      navigate("/login");
    } else {
      fetchProperties();
      fetchInquiries();
    }
  }, [navigate]);

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_BASE_URL}/property/property`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProperties(response.data.properties || []);
        setStatsData({
          totalProperties: response.data.totalProperties || 0,
          availableProperties: response.data.availableProperties || 0,
          soldProperties: response.data.soldProperties || 0,
          totalAED: response.data.totalAED || 0,
        });
      } else {
        setError(response.data.message || "Failed to load properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      } else {
        setError(error.response?.data?.message || "Failed to load properties");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch single property details
  const fetchPropertyDetails = async (propertyId) => {
    try {
      setModalLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/property/property/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setSelectedProperty(response.data.property);
        setShowPropertyModal(true);
      } else {
        setError(response.data.message || "Failed to load property details");
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
      setError(
        error.response?.data?.message || "Failed to load property details",
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setError("");
  };

  // Handle form submit - Add property to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.location || !formData.price) {
      setError("Title, location and price are required");
      return;
    }

    if (images.length === 0) {
      setError("Please select at least one image");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("beds", formData.beds || "0");
      formDataToSend.append("baths", formData.baths || "0");
      formDataToSend.append("sqft", formData.sqft || "");
      formDataToSend.append("propertyType", formData.propertyType);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("badge", formData.badge || "New");
      formDataToSend.append("status", formData.status || "available");

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await axios.post(
        `${API_BASE_URL}/property/add-property`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        await fetchProperties();

        setFormData({
          title: "",
          location: "",
          price: "",
          beds: "",
          baths: "",
          sqft: "",
          propertyType: "apartment",
          description: "",
          badge: "New",
          status: "available",
        });

        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        setImages([]);
        setImagePreviews([]);

        setSuccessMessageText(
          "✅ Property added successfully! Waiting for admin approval.",
        );
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);

        setActiveTab("properties");
      } else {
        setError(response.data.message || "Failed to add property");
      }
    } catch (error) {
      console.error("Error adding property:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError(
          "Failed to add property. Please check your connection and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle property deletion
  const handleDeleteProperty = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this property? This action cannot be undone.",
      )
    ) {
      try {
        setDeletingPropertyId(id);
        const token = localStorage.getItem("token");

        const response = await axios.delete(
          `${API_BASE_URL}/property/property/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          if (selectedProperty?._id === id) {
            setShowPropertyModal(false);
            setSelectedProperty(null);
          }

          setSuccessMessageText("🗑️ Property deleted successfully!");
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);

          await fetchProperties();
        } else {
          setError(response.data.message || "Failed to delete property");
        }
      } catch (error) {
        console.error("Error deleting property:", error);
        setError(error.response?.data?.message || "Failed to delete property");
      } finally {
        setDeletingPropertyId(null);
      }
    }
  };

  // Handle property status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingStatusId(id);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_BASE_URL}/property/property/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        if (selectedProperty?._id === id) {
          setSelectedProperty({ ...selectedProperty, status: newStatus });
        }

        setSuccessMessageText("✅ Status updated successfully!");
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 2000);

        await fetchProperties();
      } else {
        setError(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Clear form
  const handleClearForm = () => {
    setFormData({
      title: "",
      location: "",
      price: "",
      beds: "",
      baths: "",
      sqft: "",
      propertyType: "apartment",
      description: "",
      badge: "New",
      status: "available",
    });

    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setImages([]);
    setImagePreviews([]);
    setError("");
  };

  // Get property type icon and text
  const getPropertyTypeDisplay = (type) => {
    const types = {
      apartment: "🏢 Apartment",
      villa: "🏡 Villa",
      townhouse: "🏘️ Townhouse",
      penthouse: "✨ Penthouse",
      house: "🏠 House",
    };
    return types[type] || "🏢 " + type;
  };

  // Get badge icon
  const getBadgeIcon = (badge) => {
    const icons = {
      New: "✨ ",
      "Hot Deal": "🔥 ",
      Premium: "💎 ",
      Luxury: "👑 ",
    };
    return icons[badge] || "";
  };

  // Get status display
  const getStatusDisplay = (status) => {
    const statuses = {
      available: { text: "✅ Available", color: "#22c55e" },
      sold: { text: "💰 Sold", color: "#ef4444" },
      pending: { text: "⏳ Pending", color: "#f59e0b" },
    };
    return statuses[status] || { text: status, color: "#6b7280" };
  };

  // Stats from API data with safe fallbacks
  const stats = [
    {
      title: "Total Properties",
      value: statsData?.totalProperties ?? 0,
      icon: "🏠",
      color: "#3b82f6",
    },
    {
      title: "Available",
      value: statsData?.availableProperties ?? 0,
      icon: "✅",
      color: "#22c55e",
    },
    {
      title: "Sold",
      value: statsData?.soldProperties ?? 0,
      icon: "💰",
      color: "#ef4444",
    },
    {
      title: "Total Value",
      value: `AED ${(statsData?.totalAED ?? 0).toLocaleString()}`,
      icon: "💎",
      color: "#a855f7",
    },
  ];

  return (
    <div className="agent-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <AgentHeader onLogout={handleLogout} />

        {/* Stats Cards - Only show on properties tab */}
        {activeTab === "properties" && <StatsCards stats={stats} />}

        {/* Success Message */}
        <SuccessMessage
          message={successMessageText}
          show={showSuccessMessage}
          onClose={() => setShowSuccessMessage(false)}
        />

        {/* Error Message */}
        <ErrorMessage error={error} />

        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "properties" ? "tab active" : "tab"}
            onClick={() => setActiveTab("properties")}
          >
            📋 My Properties
          </button>
          <button
            className={activeTab === "add" ? "tab active" : "tab"}
            onClick={() => setActiveTab("add")}
          >
            ➕ Add New Property
          </button>
          <button
            className={activeTab === "inbox" ? "tab active" : "tab"}
            onClick={() => {
              setActiveTab("inbox");
              fetchInquiries();
            }}
            style={{ position: "relative" }}
          >
            📬 Inbox
            {pendingInquiries > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {pendingInquiries}
              </span>
            )}
          </button>
        </div>

        {/* Properties List Tab */}
        {activeTab === "properties" && (
          <PropertiesList
            properties={properties}
            loading={loading}
            updatingStatusId={updatingStatusId}
            deletingPropertyId={deletingPropertyId}
            onViewProperty={fetchPropertyDetails}
            onStatusUpdate={handleStatusUpdate}
            onDeleteProperty={handleDeleteProperty}
            onRefresh={fetchProperties}
            API_BASE_URL={API_BASE_URL}
            getPropertyTypeDisplay={getPropertyTypeDisplay}
            getBadgeIcon={getBadgeIcon}
          />
        )}

        {/* Add Property Form Tab */}
        {activeTab === "add" && (
          <AddPropertyForm
            formData={formData}
            images={images}
            imagePreviews={imagePreviews}
            loading={loading}
            onInputChange={handleInputChange}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            onClear={handleClearForm}
            getPropertyTypeDisplay={getPropertyTypeDisplay}
          />
        )}

        {/* Agent Inbox Tab - Integrated directly */}
        {activeTab === "inbox" && (
          <div className="inbox-container">
            <div className="inbox-header">
              <h2>📬 Customer Inquiries</h2>
              <button className="refresh-btn" onClick={fetchInquiries}>
                🔄 Refresh
              </button>
            </div>

            {loadingInquiries ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading inquiries...</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📬</div>
                <p>No inquiries yet</p>
                <p className="empty-sub">
                  When customers inquire about your properties, they will appear
                  here
                </p>
              </div>
            ) : (
              <div className="inquiries-list">
                {inquiries.map((inquiry) => (
                  <div key={inquiry._id} className="inquiry-item">
                    <div className="inquiry-property">
                      <h4>{inquiry.propertyId?.title || "Unknown Property"}</h4>
                      <div className="property-location">
                        📍{" "}
                        {inquiry.propertyId?.location ||
                          "Location not specified"}
                      </div>
                      <div className="property-price">
                        💰 AED{" "}
                        {inquiry.propertyId?.price?.toLocaleString() || "N/A"}
                      </div>
                    </div>

                    <div className="inquiry-customer">
                      <div className="customer-name">
                        👤 <strong>{inquiry.userId?.name || "Unknown"}</strong>
                      </div>
                      <div className="customer-email">
                        📧 {inquiry.userId?.email || "Not provided"}
                      </div>
                      <div className="customer-contact">
                        📞 {inquiry.contactNumber || "Not provided"}
                      </div>
                      <div className="customer-location">
                        📍 Customer Location:{" "}
                        {inquiry.location || "Not specified"}
                      </div>
                      <div className="inquiry-date">
                        📅 Received: {formatDate(inquiry.createdAt)}
                      </div>
                      <div className="inquiry-status">
                        Status:{" "}
                        <span
                          className={`status-badge status-${inquiry.status || "pending"}`}
                        >
                          {inquiry.status === "responded"
                            ? "✅ Responded"
                            : inquiry.status === "resolved"
                              ? "✓ Resolved"
                              : "⏳ Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="inquiry-message">
                      <strong>💬 Customer Message:</strong>
                      <p>{inquiry.message}</p>
                    </div>

                    {/* Show existing replies */}
                    {inquiry.replies && inquiry.replies.length > 0 && (
                      <div className="replies-section">
                        <strong>📝 Your Previous Replies:</strong>
                        {inquiry.replies.map((reply) => (
                          <div key={reply._id} className="agent-reply">
                            <div className="reply-meta">
                              <span>
                                You replied on: {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p>{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Button */}
                    <div className="inquiry-actions">
                      <button
                        className="reply-btn"
                        onClick={() => openReplyModal(inquiry)}
                      >
                        💬{" "}
                        {inquiry.replies && inquiry.replies.length > 0
                          ? "Reply Again"
                          : "Reply to Customer"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Property Details Modal */}
        {showPropertyModal && selectedProperty && (
          <PropertyModal
            property={selectedProperty}
            loading={modalLoading}
            updatingStatusId={updatingStatusId}
            deletingPropertyId={deletingPropertyId}
            API_BASE_URL={API_BASE_URL}
            onClose={() => {
              setShowPropertyModal(false);
              setSelectedProperty(null);
            }}
            onStatusUpdate={handleStatusUpdate}
            onDeleteProperty={handleDeleteProperty}
            getPropertyTypeDisplay={getPropertyTypeDisplay}
            getBadgeIcon={getBadgeIcon}
            getStatusDisplay={getStatusDisplay}
          />
        )}

        {/* Reply Modal */}
        {showReplyModal && selectedInquiry && (
          <div
            className="modal-overlay"
            onClick={() => setShowReplyModal(false)}
          >
            <div className="reply-modal" onClick={(e) => e.stopPropagation()}>
              <div className="reply-modal-header">
                <h3>💬 Reply to Customer</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowReplyModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="reply-modal-body">
                <div className="customer-info-summary">
                  <p>
                    <strong>Customer:</strong> {selectedInquiry.userId?.name}
                  </p>
                  <p>
                    <strong>Property:</strong>{" "}
                    {selectedInquiry.propertyId?.title}
                  </p>
                  <p>
                    <strong>Original Message:</strong>
                  </p>
                  <div className="original-message">
                    "{selectedInquiry.message}"
                  </div>
                </div>
                <div className="reply-input">
                  <label>Your Reply *</label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply to the customer here..."
                    rows="5"
                    autoFocus
                  />
                </div>
              </div>
              <div className="reply-modal-footer">
                <button
                  className="btn-cancel"
                  onClick={() => setShowReplyModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-send"
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim() || sendingReply}
                >
                  {sendingReply ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <LogoutConfirmModal
            onConfirm={confirmLogout}
            onCancel={() => setShowLogoutConfirm(false)}
          />
        )}

        {/* Footer */}
        <div className="footer">
          <p>© 2026 Dubai Real Estate | Agent Dashboard v1.0</p>
        </div>
      </div>

      <style>{`
        .inbox-container {
          padding: 20px;
        }

        .inbox-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .refresh-btn {
          padding: 8px 16px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .inquiry-item {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .inquiry-property {
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .inquiry-property h4 {
          margin: 0 0 8px 0;
          color: #111827;
          font-size: 18px;
        }

        .property-location, .property-price {
          font-size: 14px;
          color: #6b7280;
          margin: 4px 0;
        }

        .inquiry-customer {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f9fafb;
          border-radius: 8px;
          font-size: 14px;
        }

        .inquiry-status {
          margin-top: 5px;
        }

        .status-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-pending {
          background-color: #fef3c7;
          color: #d97706;
        }

        .status-responded {
          background-color: #dbeafe;
          color: #2563eb;
        }

        .status-resolved {
          background-color: #d1fae5;
          color: #065f46;
        }

        .inquiry-message {
          margin-top: 10px;
          margin-bottom: 15px;
          padding: 12px;
          background-color: #f3f4f6;
          border-radius: 8px;
        }

        .inquiry-message p {
          margin: 8px 0 0 0;
          line-height: 1.5;
          color: #374151;
        }

        /* Replies Section */
        .replies-section {
          margin-top: 15px;
          margin-bottom: 15px;
          padding: 12px;
          background-color: #f0fdf4;
          border-radius: 8px;
          border-left: 3px solid #22c55e;
        }

        .replies-section strong {
          display: block;
          margin-bottom: 10px;
          color: #166534;
        }

        .agent-reply {
          margin-bottom: 10px;
          padding: 10px;
          background-color: white;
          border-radius: 6px;
          border: 1px solid #dcfce7;
        }

        .agent-reply:last-child {
          margin-bottom: 0;
        }

        .reply-meta {
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 5px;
        }

        .agent-reply p {
          margin: 0;
          font-size: 14px;
          color: #374151;
        }

        .inquiry-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .reply-btn {
          padding: 8px 20px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .reply-btn:hover {
          background-color: #2563eb;
        }

        /* Reply Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .reply-modal {
          background: white;
          border-radius: 12px;
          width: 500px;
          max-width: 90%;
          max-height: 90vh;
          overflow: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .reply-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }

        .reply-modal-header h3 {
          margin: 0;
          color: #111827;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: #111827;
        }

        .reply-modal-body {
          padding: 20px;
        }

        .customer-info-summary {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f3f4f6;
          border-radius: 8px;
        }

        .customer-info-summary p {
          margin: 5px 0;
          font-size: 14px;
        }

        .original-message {
          margin-top: 10px;
          padding: 10px;
          background-color: white;
          border-radius: 6px;
          font-style: italic;
          color: #4b5563;
          border-left: 3px solid #3b82f6;
        }

        .reply-input label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
        }

        .reply-input textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-family: inherit;
          font-size: 14px;
          resize: vertical;
        }

        .reply-input textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .reply-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }

        .btn-cancel {
          padding: 8px 20px;
          background-color: #6b7280;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .btn-cancel:hover {
          background-color: #4b5563;
        }

        .btn-send {
          padding: 8px 20px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .btn-send:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .btn-send:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-sub {
          color: #6b7280;
          font-size: 14px;
          margin-top: 8px;
        }

        .loading-container {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AgentDashboard;
