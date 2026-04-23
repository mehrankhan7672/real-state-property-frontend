import React from "react";

const AddPropertyForm = ({
  formData,
  images,
  imagePreviews,
  loading,
  onInputChange,
  onImageChange,
  onSubmit,
  onClear,
  getPropertyTypeDisplay,
}) => {
  return (
    <div className="add-property-form">
      <div className="section-header">
        <h2>➕ Add New Property</h2>
        <p>Fill in the details to list a new property</p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-grid">
          {/* Basic Information */}
          <div className="form-section">
            <h3>📝 Basic Information</h3>

            <div className="form-group">
              <label>Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onInputChange}
                placeholder="e.g., Luxury Apartment in Downtown"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onInputChange}
                placeholder="e.g., Downtown Dubai"
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (AED) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={onInputChange}
                  placeholder="2450000"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Property Type *</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={onInputChange}
                  required
                  disabled={loading}
                >
                  <option value="apartment">🏢 Apartment</option>
                  <option value="villa">🏡 Villa</option>
                  <option value="townhouse">🏘️ Townhouse</option>
                  <option value="penthouse">✨ Penthouse</option>
                  <option value="house">🏠 House</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="form-section">
            <h3>🏠 Property Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={onInputChange}
                  placeholder="3"
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="baths"
                  value={formData.baths}
                  onChange={onInputChange}
                  placeholder="4"
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Area (sqft)</label>
                <input
                  type="text"
                  name="sqft"
                  value={formData.sqft}
                  onChange={onInputChange}
                  placeholder="2,150"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows="4"
                placeholder="Describe the property features, location benefits, etc."
                disabled={loading}
              />
            </div>
          </div>

          {/* Media & Status */}
          <div className="form-section">
            <h3>🖼️ Media & Status</h3>

            <div className="form-group">
              <label>Property Images * (Max 5 images)</label>
              <input
                type="file"
                name="images"
                onChange={onImageChange}
                accept="image/*"
                multiple
                required={images.length === 0}
                disabled={loading}
              />
              <small style={{ color: "#6b7280", fontSize: "12px" }}>
                You can select up to 5 images. Supported formats: JPG, PNG, GIF
              </small>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                <label>Image Previews:</label>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      style={{
                        width: "80px",
                        height: "80px",
                        position: "relative",
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #e5e7eb",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Badge</label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={onInputChange}
                  disabled={loading}
                >
                  <option value="New">✨ New</option>
                  <option value="Hot Deal">🔥 Hot Deal</option>
                  <option value="Premium">💎 Premium</option>
                  <option value="Luxury">👑 Luxury</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={onInputChange}
                  disabled={loading}
                >
                  <option value="available">✅ Available</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="sold">💰 Sold</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {imagePreviews.length > 0 && (
          <div className="preview-section" style={{ marginTop: "20px" }}>
            <h3>📸 Preview</h3>
            <div
              style={{
                display: "flex",
                gap: "20px",
                padding: "20px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: "#f9fafb",
              }}
            >
              <img
                src={imagePreviews[0]}
                alt="Preview"
                style={{
                  width: "200px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <div className="preview-info">
                <h4 style={{ margin: "0 0 10px 0" }}>
                  {formData.title || "Property Title"}
                </h4>
                <p style={{ margin: "5px 0", color: "#6b7280" }}>
                  📍 {formData.location || "Location"}
                </p>
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#10b981",
                    margin: "10px 0",
                  }}
                >
                  AED {parseInt(formData.price).toLocaleString() || "0"}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    color: "#6b7280",
                  }}
                >
                  <span>🛏️ {formData.beds || "0"}</span>
                  <span>🛁 {formData.baths || "0"}</span>
                  <span>📏 {formData.sqft || "0"} sqft</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className="form-actions"
          style={{ display: "flex", gap: "10px", marginTop: "20px" }}
        >
          <button
            type="button"
            className="btn-clear"
            onClick={onClear}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: loading ? "#3b82f680" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "⏳ Adding..." : "➕ Add Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;
