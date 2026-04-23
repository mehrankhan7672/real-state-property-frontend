import React, { useEffect } from "react";

const SuccessMessage = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
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
      {message}
    </div>
  );
};

export default SuccessMessage;
