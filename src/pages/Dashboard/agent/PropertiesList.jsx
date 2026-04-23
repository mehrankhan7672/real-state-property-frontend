import React from "react";

const PropertiesList = ({
  properties,
  loading,
  updatingStatusId,
  deletingPropertyId,
  onViewProperty,
  onStatusUpdate,
  onDeleteProperty,
  onRefresh,
  API_BASE_URL,
  getPropertyTypeDisplay,
  getBadgeIcon,
}) => {
  return (
    <div className="properties-list">
      <div className="section-header">
        <h2>📋 My Properties ({properties.length})</h2>
        <button
          onClick={onRefresh}
          className="refresh-btn"
          style={{
            padding: "8px 16px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
          disabled={loading}
        >
          {loading ? "⏳ Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {loading && properties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <p>Loading properties...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <p>No properties added yet</p>
          <p className="empty-sub">
            Click on "Add New Property" to get started
          </p>
        </div>
      ) : (
        <div
          className="properties-table-container"
          style={{ overflowX: "auto" }}
        >
          <table className="properties-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Price</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id}>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => onViewProperty(property._id)}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={
                          property.images && property.images.length > 0
                            ? `${API_BASE_URL}/${property.images[0]}`
                            : "https://via.placeholder.com/60x60?text=No+Image"
                        }
                        alt={property.title}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/60x60?text=No+Image";
                        }}
                      />
                      <div>
                        <strong>{property.title}</strong>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                          🛏️ {property.beds || 0} • 🛁 {property.baths || 0} •
                          📏 {property.sqft || 0} sqft
                        </div>
                        {property.badge && property.badge !== "None" && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#f59e0b",
                              fontWeight: "bold",
                            }}
                          >
                            {getBadgeIcon(property.badge)}
                            {property.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>📍 {property.location}</td>
                  <td style={{ fontWeight: "bold", color: "#10b981" }}>
                    AED {parseInt(property.price).toLocaleString()}
                  </td>
                  <td>
                    <span className="property-type">
                      {getPropertyTypeDisplay(property.propertyType)}
                    </span>
                  </td>
                  <td>
                    <select
                      className={`status-badge status-${property.status}`}
                      value={property.status}
                      onChange={(e) =>
                        onStatusUpdate(property._id, e.target.value)
                      }
                      disabled={updatingStatusId === property._id}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                        cursor:
                          updatingStatusId === property._id
                            ? "not-allowed"
                            : "pointer",
                        backgroundColor:
                          updatingStatusId === property._id
                            ? "#f3f4f6"
                            : "white",
                      }}
                    >
                      <option value="available">✅ Available</option>
                      <option value="sold">💰 Sold</option>
                      <option value="pending">⏳ Pending</option>
                    </select>
                    {updatingStatusId === property._id && (
                      <span style={{ fontSize: "12px", marginLeft: "8px" }}>
                        ⏳
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="view-btn"
                        onClick={() => onViewProperty(property._id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        👁️ View
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => onDeleteProperty(property._id)}
                        disabled={deletingPropertyId === property._id}
                        style={{
                          padding: "6px 12px",
                          backgroundColor:
                            deletingPropertyId === property._id
                              ? "#ef444480"
                              : "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor:
                            deletingPropertyId === property._id
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {deletingPropertyId === property._id ? "⌛" : "🗑️"}
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
  );
};

export default PropertiesList;
