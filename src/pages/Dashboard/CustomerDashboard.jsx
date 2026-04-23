import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/customerCss.css";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("properties");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [error, setError] = useState("");

  // Add user state
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    memberSince: "",
  });

  // Properties from API
  const [properties, setProperties] = useState([]);

  // Inquiries from API with replies
  const [customerInquiries, setCustomerInquiries] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState({});

  // Inquiry modal states
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryLocation, setInquiryLocation] = useState("");
  const [inquiryContactNumber, setInquiryContactNumber] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");
  const [inquiryError, setInquiryError] = useState("");
  const [sendingInquiry, setSendingInquiry] = useState(false);

  // API URL
  const API_BASE_URL = "http://localhost:5000";

  // ============ DEFINE FUNCTIONS FIRST ============

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

  // Fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      // Try to get from localStorage first
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUser({
          name: storedName,
          email: localStorage.getItem("userEmail") || "customer@email.com",
          phone: localStorage.getItem("userPhone") || "+971 50 123 4567",
          address: localStorage.getItem("userAddress") || "Dubai Marina, Dubai",
          memberSince: "January 2024",
        });
        return;
      }

      // Fallback: use email from localStorage
      const userEmail =
        localStorage.getItem("userEmail") || "customer@email.com";
      setUser({
        name: userEmail.split("@")[0],
        email: userEmail,
        phone: "+971 50 123 4567",
        address: "Dubai Marina, Dubai",
        memberSince: "January 2024",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser({
        name: "Customer",
        email: "customer@email.com",
        phone: "+971 50 123 4567",
        address: "Dubai Marina, Dubai",
        memberSince: "January 2024",
      });
    }
  };

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);
      setError("");

      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/get-all-properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        const transformedProperties = response.data.properties.map(
          (property) => ({
            id: property._id,
            title: property.title,
            location: property.location,
            price: property.price.toString(),
            beds: property.beds || 0,
            baths: property.baths || 0,
            sqft: property.sqft || "0",
            images: property.images || [],
            image:
              property.images && property.images.length > 0
                ? `${API_BASE_URL}/${property.images[0].replace(/\\/g, "/")}`
                : "https://via.placeholder.com/800x500?text=No+Image",
            badge: property.badge || "New",
            description: property.description,
            propertyType: property.propertyType,
            status: property.status,
            approve: property.approve,
            agent: property.user?.name || "Real Estate Agent",
            agentEmail: property.user?.email || "agent@dubairealestate.com",
            createdAt: property.createdAt,
          }),
        );

        console.log("Transformed properties:", transformedProperties);

        const availableProperties = transformedProperties.filter((property) => {
          return true;
        });

        console.log("Filtered properties:", availableProperties);
        setProperties(availableProperties);

        if (availableProperties.length === 0) {
          setError("No properties available at the moment. Check back later!");
        }
      } else {
        setError(response.data.message || "Failed to load properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to load properties. Please try again later.");
      }
    } finally {
      setLoadingProperties(false);
    }
  };

  // Fetch replies for a specific inquiry - UPDATED ROUTE
  const fetchRepliesForInquiry = async (inquiryId) => {
    try {
      setLoadingReplies((prev) => ({ ...prev, [inquiryId]: true }));
      const token = localStorage.getItem("token");

      // Changed to use /replies/:inquiryId (without /api/)
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
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [inquiryId]: false }));
    }
  };

  // Fetch inquiries from API with replies
  const fetchInquiries = async () => {
    try {
      setLoadingInquiries(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/inquiries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const inquiries = response.data.data;

        // Fetch replies for each inquiry
        const inquiriesWithReplies = await Promise.all(
          inquiries.map(async (inquiry) => {
            const replies = await fetchRepliesForInquiry(inquiry._id);
            return { ...inquiry, replies };
          }),
        );

        setCustomerInquiries(inquiriesWithReplies);
      } else {
        console.error("Failed to fetch inquiries:", response.data.message);
        setCustomerInquiries([]);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setCustomerInquiries([]);
    } finally {
      setLoadingInquiries(false);
    }
  };

  // Send inquiry to API
  const handleSendInquiry = async () => {
    if (!inquiryMessage.trim()) {
      setInquiryError("Please enter your message");
      return;
    }

    if (!inquiryLocation.trim()) {
      setInquiryError("Please enter your location");
      return;
    }

    if (!inquiryContactNumber.trim()) {
      setInquiryError("Please enter your contact number");
      return;
    }

    setSendingInquiry(true);
    setInquiryError("");

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setInquiryError("User not authenticated. Please login again.");
        setSendingInquiry(false);
        return;
      }

      const inquiryData = {
        userId: userId,
        propertyId: selectedProperty ? selectedProperty.id : null,
        message: inquiryMessage,
        location: inquiryLocation,
        contactNumber: inquiryContactNumber,
      };

      if (!inquiryData.propertyId) {
        setInquiryError("Please select a property first");
        setSendingInquiry(false);
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/inquiries`,
        inquiryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        await fetchInquiries();

        setShowInquiryModal(false);
        setSuccessMessageText(
          "✅ Inquiry sent successfully! The agent will contact you soon.",
        );
        setShowSuccessMessage(true);

        setInquiryMessage("");
        setInquiryLocation("");
        setInquiryContactNumber("");
        setSelectedProperty(null);

        setTimeout(() => setShowSuccessMessage(false), 3000);
        setActiveTab("inquiries");
      } else {
        setInquiryError(response.data.message || "Failed to send inquiry");
      }
    } catch (error) {
      console.error("Error sending inquiry:", error);
      setInquiryError(
        error.response?.data?.message ||
          "Failed to send inquiry. Please try again.",
      );
    } finally {
      setSendingInquiry(false);
    }
  };

  // Handle contact agent click
  const handleContactAgent = (property) => {
    setSelectedProperty(property);
    setInquiryMessage("");
    setInquiryLocation("");
    setInquiryContactNumber("");
    setInquiryError("");
    setShowInquiryModal(true);
  };

  // Handle new inquiry button click
  const handleNewInquiry = () => {
    setSelectedProperty(null);
    setInquiryMessage("");
    setInquiryLocation("");
    setInquiryContactNumber("");
    setInquiryError("");
    setShowInquiryModal(true);
  };

  // Handle logout
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userAddress");
    navigate("/login");
  };

  // ============ USE EFFECT ============

  // Authentication check and fetch data
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role")?.toLowerCase();

      if (!token || role !== "customer") {
        navigate("/login");
      } else {
        await fetchUserProfile();
        await fetchProperties();
        await fetchInquiries();
        setIsLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Statistics data
  const stats = [
    {
      title: "Properties Available",
      value: properties.length.toString(),
      icon: "🏠",
      color: "#3b82f6",
    },
    {
      title: "Inquiries",
      value: customerInquiries.length.toString(),
      icon: "💬",
      color: "#22c55e",
    },
    { title: "Viewings", value: "03", icon: "📅", color: "#a855f7" },
  ];

  return (
    <div className="app">
      <div className="dashboard">
        {/* Header with Logout Button */}
        <div className="header">
          <div className="header-left">
            <div className="avatar">
              {user.name ? user.name.charAt(0) : "?"}
            </div>
            <div>
              <h1>Welcome back, {user.name || "Customer"}!</h1>
              <p>Member since {user.memberSince}</p>
            </div>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="error-message"
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #fecaca",
              textAlign: "center",
            }}
          >
            ❌ {error}
            <button
              onClick={fetchProperties}
              style={{
                marginLeft: "10px",
                padding: "4px 12px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <div
            className="success-message"
            style={{
              backgroundColor: "#d1fae5",
              color: "#065f46",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #a7f3d0",
              textAlign: "center",
            }}
          >
            {successMessageText}
          </div>
        )}

        {/* Stats */}
        <div className="stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <div className="stat-title">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "properties" ? "tab active" : "tab"}
            onClick={() => setActiveTab("properties")}
          >
            🏠 Properties
          </button>
          <button
            className={activeTab === "inquiries" ? "tab active" : "tab"}
            onClick={() => {
              setActiveTab("inquiries");
              fetchInquiries();
            }}
          >
            📝 Inquiries ({customerInquiries.length})
          </button>
        </div>

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <>
            <div className="section-header">
              <h2>🏠 Available Properties</h2>
              <button className="link-btn" onClick={fetchProperties}>
                🔄 Refresh
              </button>
            </div>

            {loadingProperties ? (
              <div
                className="loading-container"
                style={{ padding: "40px", textAlign: "center" }}
              >
                <div className="spinner"></div>
                <p>Loading properties...</p>
              </div>
            ) : properties.length === 0 && !error ? (
              <div className="empty-state">
                <div className="empty-icon">🏠</div>
                <p>No properties available</p>
                <p className="empty-sub">Check back later for new listings</p>
              </div>
            ) : properties.length > 0 ? (
              <div className="properties-grid">
                {properties.map((property) => (
                  <div key={property.id} className="property-card">
                    <div className="property-image">
                      <img src={property.image} alt={property.title} />
                      <span className="property-badge">{property.badge}</span>
                    </div>
                    <div className="property-info">
                      <h3>{property.title}</h3>
                      <div className="property-location">
                        📍 {property.location}
                      </div>
                      <div className="property-price">
                        AED {parseInt(property.price).toLocaleString()}
                      </div>
                      <div className="property-features">
                        <span>🛏️ {property.beds}</span>
                        <span>🛁 {property.baths}</span>
                        <span>📏 {property.sqft} sqft</span>
                      </div>
                      <button
                        className="contact-agent-btn"
                        onClick={() => handleContactAgent(property)}
                        style={{
                          marginTop: "15px",
                          width: "100%",
                          padding: "8px",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        📞 Contact Agent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}

        {/* Inquiries Tab */}
        {activeTab === "inquiries" && (
          <div className="inquiries-container">
            <div className="section-header">
              <h2>📝 Your Inquiries</h2>
              <button
                className="link-btn"
                onClick={handleNewInquiry}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                + New Inquiry
              </button>
            </div>

            {loadingInquiries ? (
              <div
                className="loading-container"
                style={{ padding: "40px", textAlign: "center" }}
              >
                <div className="spinner"></div>
                <p>Loading inquiries...</p>
              </div>
            ) : customerInquiries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <p>No inquiries yet</p>
                <p className="empty-sub">
                  Click "New Inquiry" to ask about properties you're interested
                  in
                </p>
                <button
                  className="btn-primary"
                  onClick={() => setActiveTab("properties")}
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="inquiries-list">
                {customerInquiries.map((inquiry) => (
                  <div
                    key={inquiry._id}
                    className="inquiry-card"
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "16px",
                      backgroundColor: "white",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: "0 0 5px 0",
                            fontSize: "18px",
                            color: "#111827",
                          }}
                        >
                          🏠 {inquiry.propertyId?.title || "General Inquiry"}
                        </h4>
                        <div
                          className="inquiry-date"
                          style={{ fontSize: "12px", color: "#9ca3af" }}
                        >
                          📅 Sent: {formatDate(inquiry.createdAt)}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor:
                            inquiry.status === "responded"
                              ? "#dbeafe"
                              : "#fef3c7",
                          color:
                            inquiry.status === "responded"
                              ? "#2563eb"
                              : "#d97706",
                        }}
                      >
                        {inquiry.status === "responded"
                          ? "✅ Responded"
                          : "⏳ Pending"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        marginBottom: "12px",
                        padding: "12px",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "8px",
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: "12px", color: "#6b7280" }}>
                          📍 Location:
                        </strong>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            fontSize: "14px",
                            color: "#111827",
                          }}
                        >
                          {inquiry.location || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <strong style={{ fontSize: "12px", color: "#6b7280" }}>
                          📞 Contact Number:
                        </strong>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            fontSize: "14px",
                            color: "#111827",
                          }}
                        >
                          {inquiry.contactNumber || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {inquiry.propertyId && (
                      <div
                        style={{
                          marginBottom: "12px",
                          padding: "12px",
                          backgroundColor: "#fef3c7",
                          borderRadius: "8px",
                        }}
                      >
                        <strong
                          style={{
                            fontSize: "12px",
                            color: "#d97706",
                            display: "block",
                            marginBottom: "6px",
                          }}
                        >
                          Property Details:
                        </strong>
                        <div style={{ fontSize: "14px", color: "#111827" }}>
                          <div>📍 {inquiry.propertyId.location || "N/A"}</div>
                          <div>
                            💰 AED{" "}
                            {inquiry.propertyId.price?.toLocaleString() ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "13px",
                          display: "block",
                          marginBottom: "6px",
                        }}
                      >
                        Your Message:
                      </strong>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          color: "#4b5563",
                        }}
                      >
                        {inquiry.message}
                      </p>
                    </div>

                    {/* Agent Replies Section */}
                    {inquiry.replies && inquiry.replies.length > 0 && (
                      <div
                        style={{
                          marginTop: "15px",
                          padding: "15px",
                          backgroundColor: "#f0f9ff",
                          borderRadius: "8px",
                          borderLeft: "3px solid #3b82f6",
                        }}
                      >
                        <strong
                          style={{
                            display: "block",
                            marginBottom: "10px",
                            color: "#1e40af",
                          }}
                        >
                          💬 Agent Responses:
                        </strong>
                        {inquiry.replies.map((reply, idx) => (
                          <div
                            key={reply._id}
                            style={{
                              marginBottom:
                                idx === inquiry.replies.length - 1 ? 0 : "12px",
                              padding: "10px",
                              backgroundColor: "white",
                              borderRadius: "6px",
                              border: "1px solid #e0f2fe",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "6px",
                              }}
                            >
                              <strong
                                style={{ fontSize: "13px", color: "#0284c7" }}
                              >
                                Agent{" "}
                                {reply.agentId?.name
                                  ? `(${reply.agentId.name})`
                                  : ""}
                              </strong>
                              <small
                                style={{ fontSize: "11px", color: "#6b7280" }}
                              >
                                {formatDate(reply.createdAt)}
                              </small>
                            </div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#1e3a8a",
                                lineHeight: "1.5",
                              }}
                            >
                              {reply.message}
                            </p>
                            {reply.readByCustomer && (
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#9ca3af",
                                  marginTop: "5px",
                                  textAlign: "right",
                                }}
                              >
                                ✓ Read
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {loadingReplies[inquiry._id] && (
                      <div style={{ textAlign: "center", padding: "10px" }}>
                        <small>Loading replies...</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <p>
            © 2026 Dubai Real Estate | Your trusted partner for luxury
            properties in Dubai
          </p>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "600px",
              maxWidth: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <div
              className="modal-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
              }}
            >
              <h3 style={{ margin: 0 }}>
                {selectedProperty
                  ? `Inquiry about ${selectedProperty.title}`
                  : "New Inquiry"}
              </h3>
              <button
                onClick={() => setShowInquiryModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ padding: "20px" }}>
              {selectedProperty && (
                <>
                  <div
                    style={{
                      marginBottom: "20px",
                      padding: "12px",
                      backgroundColor: "#fef3c7",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#d97706",
                        marginBottom: "8px",
                      }}
                    >
                      Property Details
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "4px",
                      }}
                    >
                      {selectedProperty.title}
                    </div>
                    <div style={{ fontSize: "13px", color: "#6b7280" }}>
                      📍 {selectedProperty.location} | 💰 AED{" "}
                      {parseInt(selectedProperty.price).toLocaleString()}
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: "20px",
                      padding: "12px",
                      backgroundColor: "#f0f9ff",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#0284c7",
                        marginBottom: "8px",
                      }}
                    >
                      Agent Information
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "4px",
                      }}
                    >
                      {selectedProperty.agent}
                    </div>
                    <div style={{ fontSize: "13px", color: "#6b7280" }}>
                      📧 {selectedProperty.agentEmail}
                    </div>
                  </div>
                </>
              )}
              <div
                style={{
                  marginBottom: "20px",
                  padding: "12px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  Your Contact Information
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    📍 Your Location *
                  </label>
                  <input
                    type="text"
                    value={inquiryLocation}
                    onChange={(e) => setInquiryLocation(e.target.value)}
                    placeholder="e.g., Dubai Marina, Downtown Dubai, etc."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "5px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    📞 Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={inquiryContactNumber}
                    onChange={(e) => setInquiryContactNumber(e.target.value)}
                    placeholder="e.g., +971 50 123 4567"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb",
                      fontSize: "14px",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      marginTop: "4px",
                    }}
                  >
                    Include country code for international numbers
                  </div>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Your Message *
                </label>
                <textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Write your inquiry here... (e.g., I'm interested in scheduling a viewing, questions about payment plans, etc.)"
                  rows="6"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                  autoFocus
                />
                {inquiryError && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    ❌ {inquiryError}
                  </div>
                )}
              </div>
            </div>

            <div
              className="modal-footer"
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                padding: "20px",
                borderTop: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
              }}
            >
              <button
                onClick={() => setShowInquiryModal(false)}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendInquiry}
                disabled={sendingInquiry}
                style={{
                  padding: "8px 20px",
                  backgroundColor: sendingInquiry ? "#9ca3af" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: sendingInquiry ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {sendingInquiry ? "⏳ Sending..." : "📤 Send Inquiry"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
              <button
                className="modal-close"
                onClick={() => setShowLogoutConfirm(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout?</p>
              <p className="modal-warning">
                You will need to login again to access your dashboard.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button className="btn-confirm-logout" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
