import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/adminCss.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");

  // API URL
  const API_BASE_URL = "http://localhost:5000";

  // State for dashboard data
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    totalCustomers: 0,
    totalProperties: 0,
    pendingApprovals: 0,
    totalRevenue: "0",
    activeListings: 0,
    soldProperties: 0,
  });

  // Users data
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Properties pending approval
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  // All properties
  const [allProperties, setAllProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [propertyFilter, setPropertyFilter] = useState("all");

  // Recent activities
  const [recentActivities, setRecentActivities] = useState([]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role?.toLowerCase() !== "admin") {
      navigate("/login");
    } else {
      fetchDashboardStats();
      fetchUsers();
      fetchPendingProperties();
      fetchAllProperties();
    }
  }, [navigate]);

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/dashboard/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setStats(response.data.data.stats);
        setRecentActivities(response.data.data.recentActivities || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError(
        error.response?.data?.message || "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch pending properties
  const fetchPendingProperties = async () => {
    try {
      setLoadingPending(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/properties/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setPendingProperties(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching pending properties:", error);
    } finally {
      setLoadingPending(false);
    }
  };

  // Fetch all properties
  const fetchAllProperties = async () => {
    try {
      setLoadingProperties(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/properties/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setAllProperties(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching all properties:", error);
    } finally {
      setLoadingProperties(false);
    }
  };

  // Handle approve/reject property
  const handlePropertyAction = async (propertyId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/property/${propertyId}/approve`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setSuccessMessageText(`✅ Property ${action}d successfully!`);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);

        fetchPendingProperties();
        fetchDashboardStats();
        fetchAllProperties();

        if (showPropertyModal) {
          setShowPropertyModal(false);
        }
      }
    } catch (error) {
      console.error("Error updating property:", error);
      setError(error.response?.data?.message || "Failed to update property");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Handle user status toggle
  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/user/${userId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setSuccessMessageText(`✅ User status updated to ${newStatus}!`);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        fetchUsers();

        if (showUserModal && selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      setError(error.response?.data?.message || "Failed to update user status");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Handle delete user
  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `${API_BASE_URL}/api/admin/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.success) {
          setSuccessMessageText("✅ User deleted successfully!");
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
          fetchUsers();
          fetchDashboardStats();

          if (showUserModal) {
            setShowUserModal(false);
          }
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        setError(error.response?.data?.message || "Failed to delete user");
        setTimeout(() => setError(""), 3000);
      }
    }
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
    navigate("/login");
  };

  // View user details
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // View property details
  const viewPropertyDetails = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format price
  const formatPrice = (price) => {
    return parseInt(price).toLocaleString();
  };

  // Filter properties
  const getFilteredProperties = () => {
    if (propertyFilter === "all") return allProperties;
    if (propertyFilter === "approved")
      return allProperties.filter((p) => p.approve === "approved");
    if (propertyFilter === "pending")
      return allProperties.filter((p) => p.approve === "pending");
    if (propertyFilter === "rejected")
      return allProperties.filter((p) => p.approve === "rejected");
    if (propertyFilter === "available")
      return allProperties.filter(
        (p) => p.status === "available" && p.approve === "approved",
      );
    if (propertyFilter === "sold")
      return allProperties.filter(
        (p) => p.status === "sold" && p.approve === "approved",
      );
    return allProperties;
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="admin-header">
          <div className="header-left">
            <div className="logo">
              <span className="logo-icon">🏢</span>
              <span className="logo-text">Dubai Real Estate</span>
            </div>
            <div className="admin-info">
              <div className="admin-avatar">A</div>
              <div>
                <h2>Admin Dashboard</h2>
                <p>System Administrator • Super Admin</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="notification-badge">
              <span className="notification-icon">🔔</span>
              <span className="notification-count">
                {pendingProperties.length}
              </span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="success-message">{successMessageText}</div>
        )}

        {/* Error Message */}
        {error && <div className="error-message">❌ {error}</div>}

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">👥</div>
            <div>
              <div className="stat-title">Total Users</div>
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-sub">
                {stats.totalAgents} agents, {stats.totalCustomers} customers
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">🏠</div>
            <div>
              <div className="stat-title">Total Properties</div>
              <div className="stat-value">{stats.totalProperties}</div>
              <div className="stat-sub">{stats.activeListings} active</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">⏳</div>
            <div>
              <div className="stat-title">Pending Approvals</div>
              <div className="stat-value">{stats.pendingApprovals}</div>
              <div className="stat-sub">
                {pendingProperties.length} properties
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">💰</div>
            <div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value">AED {stats.totalRevenue}</div>
              <div className="stat-sub">{stats.soldProperties} sold</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "overview" ? "tab active" : "tab"}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={activeTab === "users" ? "tab active" : "tab"}
            onClick={() => setActiveTab("users")}
          >
            👥 Users Management
          </button>
          <button
            className={activeTab === "approvals" ? "tab active" : "tab"}
            onClick={() => setActiveTab("approvals")}
          >
            ✓ Pending Approvals ({pendingProperties.length})
          </button>
          <button
            className={activeTab === "properties" ? "tab active" : "tab"}
            onClick={() => setActiveTab("properties")}
          >
            🏠 All Properties
          </button>
        </div>

        {/* Overview Tab - Keep your existing code */}
        {activeTab === "overview" && (
          // ... your existing overview tab code ...
          <div className="overview-tab">
            <div className="quick-stats">
              <div className="quick-stat">
                <div className="quick-icon">👨‍💼</div>
                <div>
                  <div className="quick-value">{stats.totalAgents}</div>
                  <div className="quick-label">Active Agents</div>
                </div>
              </div>
              <div className="quick-stat">
                <div className="quick-icon">👤</div>
                <div>
                  <div className="quick-value">{stats.totalCustomers}</div>
                  <div className="quick-label">Customers</div>
                </div>
              </div>
              <div className="quick-stat">
                <div className="quick-icon">🏷️</div>
                <div>
                  <div className="quick-value">{stats.activeListings}</div>
                  <div className="quick-label">Active Listings</div>
                </div>
              </div>
              <div className="quick-stat">
                <div className="quick-icon">✅</div>
                <div>
                  <div className="quick-value">{stats.soldProperties}</div>
                  <div className="quick-label">Sold Properties</div>
                </div>
              </div>
            </div>

            <div className="overview-grid">
              <div className="pending-section">
                <h3>⏳ Pending Approvals</h3>
                {loadingPending ? (
                  <div className="loading-small">Loading...</div>
                ) : pendingProperties.length === 0 ? (
                  <div className="empty-small">No pending approvals</div>
                ) : (
                  pendingProperties.slice(0, 3).map((property) => (
                    <div key={property.id} className="pending-item">
                      <img src={property.imageUrl} alt={property.title} />
                      <div className="pending-info">
                        <h4>{property.title}</h4>
                        <p>📍 {property.location}</p>
                        <p>👤 {property.agent}</p>
                        <p className="price">
                          AED {formatPrice(property.price)}
                        </p>
                      </div>
                      <div className="pending-actions">
                        <button
                          onClick={() =>
                            handlePropertyAction(property.id, "approve")
                          }
                          className="approve-btn"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() =>
                            handlePropertyAction(property.id, "reject")
                          }
                          className="reject-btn"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
                {pendingProperties.length > 0 && (
                  <button
                    className="view-all-btn"
                    onClick={() => setActiveTab("approvals")}
                  >
                    View All Approvals →
                  </button>
                )}
              </div>

              <div className="activity-section">
                <h3>📋 Recent Activity</h3>
                {recentActivities.length === 0 ? (
                  <div className="empty-small">No recent activities</div>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        {activity.type === "property" && "🏠"}
                        {activity.type === "user" && "👤"}
                        {activity.type === "sale" && "💰"}
                        {activity.type === "pending" && "⏳"}
                        {activity.type === "inquiry" && "💬"}
                      </div>
                      <div className="activity-info">
                        <p className="activity-action">{activity.action}</p>
                        <p className="activity-user">{activity.user}</p>
                        {activity.details && (
                          <p className="activity-details">{activity.details}</p>
                        )}
                      </div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === "users" && (
          <div className="users-tab">
            <div className="users-header">
              <h2>👥 User Management</h2>
              <button className="refresh-btn" onClick={fetchUsers}>
                🔄 Refresh
              </button>
            </div>

            {loadingUsers ? (
              <div className="loading-container">Loading users...</div>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Join Date</th>
                      <th>Properties</th>
                      <th>Sales</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">{user.avatar}</div>
                            <div>
                              <div className="user-name">{user.name}</div>
                              <div className="user-email">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role === "agent" ? "👨‍💼 Agent" : "👤 Customer"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`status-toggle status-${user.status}`}
                            onClick={() =>
                              toggleUserStatus(user.id, user.status)
                            }
                          >
                            {user.status === "active"
                              ? "✅ Active"
                              : "⭕ Inactive"}
                          </button>
                        </td>
                        <td>{formatDate(user.joinDate)}</td>
                        <td>{user.properties}</td>
                        <td>{user.sales}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="view-btn"
                              onClick={() => viewUserDetails(user)}
                            >
                              👁️ View
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => deleteUser(user.id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Pending Approvals Tab */}
        {activeTab === "approvals" && (
          <div className="approvals-tab">
            <div className="approvals-header">
              <h2>✓ Property Approvals</h2>
              <button className="refresh-btn" onClick={fetchPendingProperties}>
                🔄 Refresh
              </button>
            </div>
            <p className="approvals-sub">
              Review and approve properties submitted by agents
            </p>

            {loadingPending ? (
              <div className="loading-container">
                Loading pending properties...
              </div>
            ) : pendingProperties.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✅</div>
                <p>No pending approvals</p>
                <p className="empty-sub">All properties have been reviewed</p>
              </div>
            ) : (
              <div className="approvals-grid">
                {pendingProperties.map((property) => (
                  <div key={property.id} className="approval-card">
                    <img src={property.imageUrl} alt={property.title} />
                    <div className="approval-details">
                      <h3>{property.title}</h3>
                      <p className="location">📍 {property.location}</p>
                      <p className="price">AED {formatPrice(property.price)}</p>
                      <p className="agent">👤 Agent: {property.agent}</p>
                      <p className="date">
                        📅 Submitted: {formatDate(property.submittedDate)}
                      </p>
                    </div>
                    <div className="approval-actions">
                      <button
                        className="approve-btn-large"
                        onClick={() =>
                          handlePropertyAction(property.id, "approve")
                        }
                      >
                        ✓ Approve Property
                      </button>
                      <button
                        className="reject-btn-large"
                        onClick={() =>
                          handlePropertyAction(property.id, "reject")
                        }
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Properties Tab */}
        {activeTab === "properties" && (
          <div className="properties-tab">
            <div className="properties-header">
              <div>
                <h2>Property Portfolio</h2>
                <p className="header-subtitle">
                  Manage and monitor all property listings
                </p>
              </div>
              <button className="refresh-btn" onClick={fetchAllProperties}>
                <span className="refresh-icon">↻</span> Refresh
              </button>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="filter-group">
                <span className="filter-label">Status:</span>
                <div className="filter-chips">
                  <button
                    className={`chip ${propertyFilter === "all" ? "active" : ""}`}
                    onClick={() => setPropertyFilter("all")}
                  >
                    All{" "}
                    <span className="chip-count">{allProperties.length}</span>
                  </button>
                  <button
                    className={`chip ${propertyFilter === "approved" ? "active" : ""}`}
                    onClick={() => setPropertyFilter("approved")}
                  >
                    Approved{" "}
                    <span className="chip-count">
                      {
                        allProperties.filter((p) => p.approve === "approved")
                          .length
                      }
                    </span>
                  </button>
                  <button
                    className={`chip ${propertyFilter === "pending" ? "active" : ""}`}
                    onClick={() => setPropertyFilter("pending")}
                  >
                    Pending{" "}
                    <span className="chip-count">
                      {
                        allProperties.filter((p) => p.approve === "pending")
                          .length
                      }
                    </span>
                  </button>
                  <button
                    className={`chip ${propertyFilter === "rejected" ? "active" : ""}`}
                    onClick={() => setPropertyFilter("rejected")}
                  >
                    Rejected{" "}
                    <span className="chip-count">
                      {
                        allProperties.filter((p) => p.approve === "rejected")
                          .length
                      }
                    </span>
                  </button>
                </div>
              </div>
              <div className="filter-group">
                <span className="filter-label">Availability:</span>
                <div className="filter-chips">
                  <button
                    className={`chip ${propertyFilter === "available" ? "active" : ""}`}
                    onClick={() => setPropertyFilter("available")}
                  >
                    For Sale{" "}
                    <span className="chip-count">
                      {
                        allProperties.filter(
                          (p) =>
                            p.status === "available" &&
                            p.approve === "approved",
                        ).length
                      }
                    </span>
                  </button>
                  <button
                    className={`chip ${propertyFilter === "sold" ? "active" : ""}`}
                    onClick={() => setPropertyFilter("sold")}
                  >
                    Sold{" "}
                    <span className="chip-count">
                      {
                        allProperties.filter(
                          (p) =>
                            p.status === "sold" && p.approve === "approved",
                        ).length
                      }
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {loadingProperties ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading properties...</p>
              </div>
            ) : getFilteredProperties().length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏠</div>
                <h3>No properties found</h3>
                <p>Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <>
                <div className="summary-grid">
                  <div className="summary-card">
                    <div className="summary-icon blue">🏠</div>
                    <div>
                      <div className="summary-label">Total Properties</div>
                      <div className="summary-value">
                        {allProperties.length}
                      </div>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon green">✓</div>
                    <div>
                      <div className="summary-label">Approved</div>
                      <div className="summary-value">
                        {
                          allProperties.filter((p) => p.approve === "approved")
                            .length
                        }
                      </div>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon orange">⏳</div>
                    <div>
                      <div className="summary-label">Pending</div>
                      <div className="summary-value">
                        {
                          allProperties.filter((p) => p.approve === "pending")
                            .length
                        }
                      </div>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon red">✗</div>
                    <div>
                      <div className="summary-label">Rejected</div>
                      <div className="summary-value">
                        {
                          allProperties.filter((p) => p.approve === "rejected")
                            .length
                        }
                      </div>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon purple">💰</div>
                    <div>
                      <div className="summary-label">Total Value</div>
                      <div className="summary-value">
                        AED{" "}
                        {allProperties
                          .reduce((sum, p) => sum + parseInt(p.price || 0), 0)
                          .toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="properties-table-container">
                  <table className="properties-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Agent</th>
                        <th>Approval Status</th>
                        <th>Listing Status</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredProperties().map((property) => (
                        <tr key={property.id}>
                          <td>
                            <div className="property-cell">
                              <div className="property-thumbnail">
                                <img
                                  src={property.imageUrl}
                                  alt={property.title}
                                />
                              </div>
                              <div className="property-info">
                                <div className="property-title">
                                  {property.title}
                                </div>
                                {property.badge && property.badge !== "New" && (
                                  <span className="property-tag">
                                    {property.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="location-cell">
                              <span className="location-icon">📍</span>
                              {property.location}
                            </div>
                          </td>
                          <td>
                            <div className="price-cell">
                              AED {formatPrice(property.price)}
                            </div>
                          </td>
                          <td>
                            <div className="agent-cell">
                              <div className="agent-avatar-sm">
                                {property.agent?.charAt(0) || "A"}
                              </div>
                              <span>{property.agent}</span>
                            </div>
                          </td>
                          <td>
                            <div
                              className={`status-badge approval-${property.approve}`}
                            >
                              {property.approve === "approved"
                                ? "✓ Approved"
                                : property.approve === "rejected"
                                  ? "✗ Rejected"
                                  : "⏳ Pending"}
                            </div>
                          </td>
                          <td>
                            {property.approve === "approved" && (
                              <div
                                className={`status-badge listing-${property.status}`}
                              >
                                {property.status === "available"
                                  ? "For Sale"
                                  : "Sold"}
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="date-cell">
                              {formatDate(property.submittedDate)}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn view"
                                onClick={() => viewPropertyDetails(property)}
                                title="View Details"
                              >
                                👁️
                              </button>
                              {property.approve === "pending" && (
                                <>
                                  <button
                                    className="action-btn approve"
                                    onClick={() =>
                                      handlePropertyAction(
                                        property.id,
                                        "approve",
                                      )
                                    }
                                    title="Approve"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    className="action-btn reject"
                                    onClick={() =>
                                      handlePropertyAction(
                                        property.id,
                                        "reject",
                                      )
                                    }
                                    title="Reject"
                                  >
                                    ✗
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <p>
            © 2026 Dubai Real Estate | Admin Dashboard v1.0 | System
            Administrator
          </p>
        </div>
      </div>

      {/* Property Details Modal */}
      {showPropertyModal && selectedProperty && (
        <div
          className="modal-overlay"
          onClick={() => setShowPropertyModal(false)}
        >
          <div className="property-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🏠 Property Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowPropertyModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="property-modal-body">
              <div className="property-modal-image">
                <img
                  src={selectedProperty.imageUrl}
                  alt={selectedProperty.title}
                />
                <div
                  className={`property-modal-status ${selectedProperty.approve}`}
                >
                  {selectedProperty.approve === "approved"
                    ? "✓ Approved"
                    : selectedProperty.approve === "rejected"
                      ? "✗ Rejected"
                      : "⏳ Pending Review"}
                </div>
              </div>

              <div className="property-modal-content">
                <h2 className="property-modal-title">
                  {selectedProperty.title}
                </h2>

                <div className="property-modal-grid">
                  <div className="info-section">
                    <h4>📍 Location & Price</h4>
                    <div className="info-row">
                      <span className="info-label">Location:</span>
                      <span className="info-value">
                        {selectedProperty.location}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Price:</span>
                      <span className="info-value price">
                        AED {formatPrice(selectedProperty.price)}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Property Type:</span>
                      <span className="info-value">
                        {selectedProperty.propertyType || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="info-section">
                    <h4>📐 Property Details</h4>
                    <div className="info-row">
                      <span className="info-label">Beds:</span>
                      <span className="info-value">
                        {selectedProperty.beds || "N/A"}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Baths:</span>
                      <span className="info-value">
                        {selectedProperty.baths || "N/A"}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Area:</span>
                      <span className="info-value">
                        {selectedProperty.sqft || "N/A"} sqft
                      </span>
                    </div>
                  </div>

                  <div className="info-section">
                    <h4>👤 Agent Information</h4>
                    <div className="info-row">
                      <span className="info-label">Agent Name:</span>
                      <span className="info-value">
                        {selectedProperty.agent}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Submitted:</span>
                      <span className="info-value">
                        {formatDate(selectedProperty.submittedDate)}
                      </span>
                    </div>
                  </div>

                  {selectedProperty.description && (
                    <div className="info-section full-width">
                      <h4>📝 Description</h4>
                      <p className="property-description">
                        {selectedProperty.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowPropertyModal(false)}
              >
                Close
              </button>
              {selectedProperty.approve === "pending" && (
                <>
                  <button
                    className="btn-approve"
                    onClick={() =>
                      handlePropertyAction(selectedProperty.id, "approve")
                    }
                  >
                    ✓ Approve Property
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() =>
                      handlePropertyAction(selectedProperty.id, "reject")
                    }
                  >
                    ✗ Reject Property
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal - Enhanced */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div
            className="user-modal-enhanced"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>👤 User Profile</h3>
              <button
                className="modal-close"
                onClick={() => setShowUserModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="user-modal-body">
              <div className="user-profile-header">
                <div className="user-profile-avatar">{selectedUser.avatar}</div>
                <div className="user-profile-info">
                  <h2>{selectedUser.name}</h2>
                  <p className="user-email">{selectedUser.email}</p>
                  <div className={`user-status-badge ${selectedUser.status}`}>
                    {selectedUser.status === "active"
                      ? "● Active"
                      : "○ Inactive"}
                  </div>
                </div>
              </div>

              <div className="user-stats-grid">
                <div className="user-stat-card">
                  <div className="user-stat-icon">👔</div>
                  <div>
                    <div className="user-stat-label">Role</div>
                    <div className="user-stat-value">
                      {selectedUser.role === "agent"
                        ? "Real Estate Agent"
                        : "Customer"}
                    </div>
                  </div>
                </div>
                <div className="user-stat-card">
                  <div className="user-stat-icon">📅</div>
                  <div>
                    <div className="user-stat-label">Member Since</div>
                    <div className="user-stat-value">
                      {formatDate(selectedUser.joinDate)}
                    </div>
                  </div>
                </div>
                <div className="user-stat-card">
                  <div className="user-stat-icon">🏠</div>
                  <div>
                    <div className="user-stat-label">Properties</div>
                    <div className="user-stat-value">
                      {selectedUser.properties}
                    </div>
                  </div>
                </div>
                <div className="user-stat-card">
                  <div className="user-stat-icon">💰</div>
                  <div>
                    <div className="user-stat-label">Total Sales</div>
                    <div className="user-stat-value">{selectedUser.sales}</div>
                  </div>
                </div>
              </div>

              <div className="user-details-section">
                <h4>Contact Information</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">📧 Email Address</span>
                    <span className="detail-value">{selectedUser.email}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="detail-item">
                      <span className="detail-label">📞 Phone Number</span>
                      <span className="detail-value">{selectedUser.phone}</span>
                    </div>
                  )}
                  {selectedUser.address && (
                    <div className="detail-item full-width">
                      <span className="detail-label">📍 Address</span>
                      <span className="detail-value">
                        {selectedUser.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowUserModal(false)}
              >
                Close
              </button>
              <button
                className="btn-edit"
                onClick={() =>
                  toggleUserStatus(selectedUser.id, selectedUser.status)
                }
              >
                {selectedUser.status === "active"
                  ? "🔒 Deactivate User"
                  : "🔓 Activate User"}
              </button>
              <button
                className="btn-delete"
                onClick={() => deleteUser(selectedUser.id)}
              >
                🗑️ Delete User
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
                You will need to login again to access the admin panel.
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

      <style>{`
        .success-message, .error-message {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }
        .success-message { background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .error-message { background-color: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
        .refresh-btn { padding: 8px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
        .loading-container, .loading-state { text-align: center; padding: 40px; color: #6b7280; }
        .loading-small { text-align: center; padding: 20px; color: #6b7280; }
        .activity-details { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .approvals-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }

        /* Property Modal Styles */
        .property-modal {
          background: white;
          border-radius: 20px;
          width: 800px;
          max-width: 90%;
          max-height: 90vh;
          overflow: auto;
          animation: slideIn 0.3s ease;
        }
        .property-modal-body {
          display: flex;
          flex-direction: column;
        }
        .property-modal-image {
          position: relative;
          height: 300px;
          overflow: hidden;
        }
        .property-modal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .property-modal-status {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          background: rgba(0,0,0,0.8);
          color: white;
        }
        .property-modal-status.approved { background: #10b981; }
        .property-modal-status.rejected { background: #ef4444; }
        .property-modal-status.pending { background: #f59e0b; }
        .property-modal-content {
          padding: 24px;
        }
        .property-modal-title {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
        }
        .property-modal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .info-section {
          background: #f8fafc;
          padding: 16px;
          border-radius: 12px;
        }
        .info-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-section .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .info-section .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-size: 13px;
          color: #64748b;
        }
        .info-value {
          font-size: 13px;
          font-weight: 500;
          color: #0f172a;
        }
        .info-value.price {
          font-size: 16px;
          font-weight: 700;
          color: #3b82f6;
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .property-description {
          font-size: 14px;
          line-height: 1.6;
          color: #475569;
          margin: 0;
        }
        .btn-approve {
          background-color: #10b981;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-reject {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
        }

        /* User Modal Enhanced */
        .user-modal-enhanced {
          background: white;
          border-radius: 20px;
          width: 600px;
          max-width: 90%;
          max-height: 90vh;
          overflow: auto;
          animation: slideIn 0.3s ease;
        }
        .user-modal-body {
          padding: 24px;
        }
        .user-profile-header {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 24px;
        }
        .user-profile-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
          color: white;
        }
        .user-profile-info h2 {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }
        .user-email {
          color: #64748b;
          font-size: 14px;
          margin: 0 0 8px 0;
        }
        .user-status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .user-status-badge.active {
          background: #f0fdf4;
          color: #10b981;
        }
        .user-status-badge.inactive {
          background: #fef2f2;
          color: #ef4444;
        }
        .user-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .user-stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
        }
        .user-stat-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .user-stat-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .user-stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }
        .user-details-section h4 {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 16px;
        }
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }
        .detail-item {
          background: #f8fafc;
          padding: 12px;
          border-radius: 8px;
        }
        .detail-item.full-width {
          grid-column: 1 / -1;
        }
        .detail-label {
          display: block;
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .detail-value {
          font-size: 14px;
          font-weight: 500;
          color: #0f172a;
        }
        .btn-delete {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
