import React from "react";

const AgentHeader = ({ onLogout }) => {
  return (
    <div className="agent-header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">🏢</span>
          <span className="logo-text">Dubai Real Estate</span>
        </div>
        <div className="agent-info">
          <div className="agent-avatar">A</div>
          <div>
            <h2>Agent Dashboard</h2>
            <p>Sarah Ahmed • Real Estate Agent</p>
          </div>
        </div>
      </div>
      <div className="header-right">
        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default AgentHeader;
