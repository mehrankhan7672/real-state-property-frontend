import React from "react";

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div
      className="error-message"
      style={{
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "1px solid #fecaca",
      }}
    >
      ❌ {error}
    </div>
  );
};

export default ErrorMessage;
