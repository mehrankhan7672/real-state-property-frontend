import React from "react";

const LogoutConfirmModal = ({ onConfirm, onCancel }) => {
  return (
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
          padding: "20px",
          width: "400px",
          maxWidth: "90%",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          className="modal-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: 0 }}>Confirm Logout</h3>
          <button
            className="modal-close"
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ✕
          </button>
        </div>
        <div className="modal-body" style={{ marginBottom: "20px" }}>
          <p>Are you sure you want to logout?</p>
          <p
            className="modal-warning"
            style={{
              color: "#ef4444",
              fontSize: "14px",
              marginTop: "10px",
            }}
          >
            You will need to login again to access your dashboard.
          </p>
        </div>
        <div
          className="modal-footer"
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="btn-cancel"
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            className="btn-confirm-logout"
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
