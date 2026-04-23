import React from "react";

const PropertyModal = ({
  property,
  loading,
  updatingStatusId,
  deletingPropertyId,
  API_BASE_URL,
  onClose,
  onStatusUpdate,
  onDeleteProperty,
  getPropertyTypeDisplay,
  getBadgeIcon,
  getStatusDisplay,
}) => {
  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        overflowY: "auto",
        padding: "20px",
      }}
    >
      <div
        className="modal"
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "0",
          width: "900px",
          maxWidth: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div>⏳ Loading property details...</div>
          </div>
        ) : (
          <>
            <div
              className="modal-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px",
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "24px" }}>{property.title}</h2>
              <button
                className="modal-close"
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "28px",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "0 8px",
                }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ padding: "24px" }}>
              {/* Images Gallery */}
              {property.images && property.images.length > 0 && (
                <div
                  className="property-images-gallery"
                  style={{ marginBottom: "24px" }}
                >
                  <h3 style={{ marginBottom: "12px", fontSize: "18px" }}>
                    📸 Property Images
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      overflowX: "auto",
                      paddingBottom: "12px",
                    }}
                  >
                    {property.images.map((image, index) => (
                      <img
                        key={index}
                        src={`${API_BASE_URL}/${image}`}
                        alt={`${property.title} - ${index + 1}`}
                        style={{
                          width: "200px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          cursor: "pointer",
                          border: "2px solid #e5e7eb",
                        }}
                        onClick={() =>
                          window.open(`${API_BASE_URL}/${image}`, "_blank")
                        }
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/200x150?text=Image+Not+Found";
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px",
                }}
              >
                {/* Basic Information */}
                <div
                  className="info-section"
                  style={{
                    padding: "16px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: "12px",
                      fontSize: "18px",
                      color: "#374151",
                    }}
                  >
                    📋 Basic Information
                  </h3>
                  <p>
                    <strong>📍 Location:</strong> {property.location}
                  </p>
                  <p>
                    <strong>💰 Price:</strong>{" "}
                    <span style={{ color: "#10b981", fontWeight: "bold" }}>
                      AED {parseInt(property.price).toLocaleString()}
                    </span>
                  </p>
                  <p>
                    <strong>🏠 Property Type:</strong>{" "}
                    {getPropertyTypeDisplay(property.propertyType)}
                  </p>
                  {property.badge && property.badge !== "None" && (
                    <p>
                      <strong>✨ Badge:</strong>{" "}
                      <span style={{ color: "#f59e0b" }}>
                        {getBadgeIcon(property.badge)}
                        {property.badge}
                      </span>
                    </p>
                  )}
                </div>

                {/* Property Details */}
                <div
                  className="info-section"
                  style={{
                    padding: "16px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: "12px",
                      fontSize: "18px",
                      color: "#374151",
                    }}
                  >
                    🏠 Property Details
                  </h3>
                  <p>
                    <strong>🛏️ Bedrooms:</strong> {property.beds || 0}
                  </p>
                  <p>
                    <strong>🛁 Bathrooms:</strong> {property.baths || 0}
                  </p>
                  <p>
                    <strong>📏 Area:</strong> {property.sqft || 0} sqft
                  </p>
                  <p>
                    <strong>📊 Status:</strong>
                    <span
                      style={{
                        color: getStatusDisplay(property.status).color,
                        fontWeight: "bold",
                        marginLeft: "8px",
                      }}
                    >
                      {getStatusDisplay(property.status).text}
                    </span>
                  </p>
                </div>

                {/* Description */}
                {property.description && (
                  <div
                    className="info-section"
                    style={{
                      gridColumn: "span 2",
                      padding: "16px",
                      backgroundColor: "#f9fafb",
                      borderRadius: "8px",
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: "12px",
                        fontSize: "18px",
                        color: "#374151",
                      }}
                    >
                      📝 Description
                    </h3>
                    <p style={{ lineHeight: "1.6", color: "#4b5563" }}>
                      {property.description}
                    </p>
                  </div>
                )}

                {/* Additional Information */}
                <div
                  className="info-section"
                  style={{
                    gridColumn: "span 2",
                    padding: "16px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: "12px",
                      fontSize: "18px",
                      color: "#374151",
                    }}
                  >
                    ℹ️ Additional Information
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "10px",
                    }}
                  >
                    <p>
                      <strong>🆔 Property ID:</strong> {property._id}
                    </p>
                    <p>
                      <strong>📅 Created:</strong>{" "}
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>🕒 Last Updated:</strong>{" "}
                      {new Date(property.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="modal-footer"
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                padding: "20px 24px",
                borderTop: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                borderRadius: "0 0 16px 16px",
              }}
            >
              <select
                value={property.status}
                onChange={(e) => onStatusUpdate(property._id, e.target.value)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  cursor: "pointer",
                }}
              >
                <option value="available">✅ Available</option>
                <option value="sold">💰 Sold</option>
                <option value="pending">⏳ Pending</option>
              </select>
              <button
                className="btn-delete"
                onClick={() => onDeleteProperty(property._id)}
                disabled={deletingPropertyId === property._id}
                style={{
                  padding: "8px 16px",
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
                {deletingPropertyId === property._id
                  ? "⌛ Deleting..."
                  : "🗑️ Delete Property"}
              </button>
              <button
                className="btn-close"
                onClick={onClose}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyModal;
