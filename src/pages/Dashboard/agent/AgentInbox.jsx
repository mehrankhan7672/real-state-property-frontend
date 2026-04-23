import React, { useState } from "react";

const AgentInbox = ({ onInquiryUpdate }) => {
  const [inquiries, setInquiries] = useState([
    {
      _id: "1",
      propertyTitle: "Burj Crown Residences",
      propertyLocation: "Downtown Dubai",
      propertyPrice: "2,450,000",
      customerName: "Ahmed Mansoor",
      customerEmail: "ahmed@email.com",
      phone: "+971 50 123 4567",
      message:
        "I'm very interested in this property. Can I schedule a viewing for this weekend? Also, I'd like to know if the price is negotiable.",
      status: "pending",
      createdAt: "2026-03-28T10:30:00Z",
      replies: [],
    },
    {
      _id: "2",
      propertyTitle: "Palm Jumeirah Shoreline",
      propertyLocation: "Palm Jumeirah",
      propertyPrice: "8,990,000",
      customerName: "Fatima Al Maktoum",
      customerEmail: "fatima@email.com",
      phone: "+971 55 987 6543",
      message:
        "Beautiful property! I would like to know more about the amenities and the community. Is there a gym and pool? Also, what's the maintenance fee?",
      status: "reviewing",
      createdAt: "2026-03-27T14:15:00Z",
      replies: [
        {
          _id: "r1",
          message:
            "Thank you for your interest! The property includes a state-of-the-art gym, infinity pool, and 24/7 concierge service. Maintenance fee is AED 25,000 annually.",
          createdAt: "2026-03-28T09:00:00Z",
        },
      ],
    },
    {
      _id: "3",
      propertyTitle: "Dubai Marina Vista",
      propertyLocation: "Dubai Marina",
      propertyPrice: "1,890,000",
      customerName: "Mohammed Rashid",
      customerEmail: "mohammed@email.com",
      phone: "+971 52 345 6789",
      message:
        "Is this property ready for immediate move-in? Also, what's the payment plan? I'm interested in a 5-year payment plan if available.",
      status: "responded",
      createdAt: "2026-03-26T11:45:00Z",
      replies: [
        {
          _id: "r2",
          message:
            "The property is ready for immediate move-in. We offer flexible payment plans including 5-year post-handover payment plans. Would you like to schedule a viewing?",
          createdAt: "2026-03-27T10:30:00Z",
        },
      ],
    },
    {
      _id: "4",
      propertyTitle: "Emirates Hills Villa",
      propertyLocation: "Emirates Hills",
      propertyPrice: "12,500,000",
      customerName: "Sarah Johnson",
      customerEmail: "sarah@email.com",
      phone: "+971 56 789 0123",
      message:
        "I'm a foreign investor. Can you provide information about the legal process for non-UAE residents? Also, what's the expected ROI?",
      status: "pending",
      createdAt: "2026-03-29T09:00:00Z",
      replies: [],
    },
    {
      _id: "5",
      propertyTitle: "Business Bay Executive",
      propertyLocation: "Business Bay",
      propertyPrice: "1,250,000",
      customerName: "Omar Al Hashmi",
      customerEmail: "omar@email.com",
      phone: "+971 50 234 5678",
      message:
        "Looking for a 2-bedroom unit in this building. Do you have any available? What's the minimum down payment?",
      status: "reviewing",
      createdAt: "2026-03-25T16:20:00Z",
      replies: [
        {
          _id: "r3",
          message:
            "Yes, we have a 2-bedroom unit available on the 15th floor with city views. Minimum down payment is 20% of the property value.",
          createdAt: "2026-03-26T14:00:00Z",
        },
      ],
    },
    {
      _id: "6",
      propertyTitle: "JVC Family Townhouse",
      propertyLocation: "Jumeirah Village",
      propertyPrice: "1,850,000",
      customerName: "Layla Hassan",
      customerEmail: "layla@email.com",
      phone: "+971 54 567 8901",
      message:
        "Is this property family-friendly? How close is it to schools and parks? We have two young children.",
      status: "pending",
      createdAt: "2026-03-24T13:15:00Z",
      replies: [],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, reviewing, responded

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "reviewing":
        return "#3b82f6";
      case "responded":
        return "#22c55e";
      case "closed":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "reviewing":
        return "👀";
      case "responded":
        return "✅";
      case "closed":
        return "🔒";
      default:
        return "📝";
    }
  };

  // Only allow status update (no adding new inquiries)
  const updateInquiryStatus = (inquiryId, newStatus) => {
    setInquiries((prevInquiries) =>
      prevInquiries.map((inquiry) =>
        inquiry._id === inquiryId ? { ...inquiry, status: newStatus } : inquiry,
      ),
    );

    if (onInquiryUpdate) onInquiryUpdate();
  };

  // Only allow replies (no adding new inquiries)
  const sendReply = (inquiryId) => {
    if (!replyMessage.trim()) return;

    const newReply = {
      _id: Date.now().toString(),
      message: replyMessage,
      createdAt: new Date().toISOString(),
    };

    setInquiries((prevInquiries) =>
      prevInquiries.map((inquiry) =>
        inquiry._id === inquiryId
          ? {
              ...inquiry,
              replies: [...inquiry.replies, newReply],
              status: "responded",
            }
          : inquiry,
      ),
    );

    setReplyMessage("");
    setSelectedInquiry(null);

    if (onInquiryUpdate) onInquiryUpdate();
  };

  const filteredInquiries =
    filterStatus === "all"
      ? inquiries
      : inquiries.filter((inquiry) => inquiry.status === filterStatus);

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((i) => i.status === "pending").length,
    reviewing: inquiries.filter((i) => i.status === "reviewing").length,
    responded: inquiries.filter((i) => i.status === "responded").length,
  };

  return (
    <div className="agent-inbox" style={{ padding: "20px" }}>
      {/* Header with Stats - View Only */}
      <div
        className="inbox-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#111827" }}>📬 Customer Inquiries</h2>
          <p
            style={{ margin: "5px 0 0 0", fontSize: "13px", color: "#6b7280" }}
          >
            View and respond to customer messages about your properties
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "flex", gap: "15px" }}>
          <div
            style={{
              padding: "8px 16px",
              background: "#eff6ff",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "12px", color: "#3b82f6" }}>Total</div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#3b82f6" }}
            >
              {stats.total}
            </div>
          </div>
          <div
            style={{
              padding: "8px 16px",
              background: "#fef3c7",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "12px", color: "#f59e0b" }}>Pending</div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}
            >
              {stats.pending}
            </div>
          </div>
          <div
            style={{
              padding: "8px 16px",
              background: "#dbeafe",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "12px", color: "#3b82f6" }}>Reviewing</div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#3b82f6" }}
            >
              {stats.reviewing}
            </div>
          </div>
          <div
            style={{
              padding: "8px 16px",
              background: "#d1fae5",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "12px", color: "#10b981" }}>Responded</div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}
            >
              {stats.responded}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs - View Only */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "10px",
        }}
      >
        <button
          onClick={() => setFilterStatus("all")}
          style={{
            padding: "8px 16px",
            background: filterStatus === "all" ? "#3b82f6" : "transparent",
            color: filterStatus === "all" ? "white" : "#6b7280",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          style={{
            padding: "8px 16px",
            background: filterStatus === "pending" ? "#f59e0b" : "transparent",
            color: filterStatus === "pending" ? "white" : "#6b7280",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          ⏳ Pending ({stats.pending})
        </button>
        <button
          onClick={() => setFilterStatus("reviewing")}
          style={{
            padding: "8px 16px",
            background:
              filterStatus === "reviewing" ? "#3b82f6" : "transparent",
            color: filterStatus === "reviewing" ? "white" : "#6b7280",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          👀 Reviewing ({stats.reviewing})
        </button>
        <button
          onClick={() => setFilterStatus("responded")}
          style={{
            padding: "8px 16px",
            background:
              filterStatus === "responded" ? "#10b981" : "transparent",
            color: filterStatus === "responded" ? "white" : "#6b7280",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          ✅ Responded ({stats.responded})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div>⏳ Loading inquiries...</div>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div
          className="empty-state"
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📬</div>
          <p style={{ fontSize: "18px", color: "#6b7280" }}>
            No inquiries found
          </p>
          <p style={{ color: "#9ca3af" }}>
            When customers contact you about properties, their messages will
            appear here
          </p>
        </div>
      ) : (
        <div
          className="inquiries-list"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className="inquiry-card"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "white",
                transition: "box-shadow 0.2s",
              }}
            >
              {/* Header with Customer and Property Info */}
              <div
                className="inquiry-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <h3
                      style={{ margin: 0, fontSize: "18px", color: "#111827" }}
                    >
                      🏠 {inquiry.propertyTitle}
                    </h3>
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "2px 8px",
                        background: "#f3f4f6",
                        borderRadius: "12px",
                        color: "#6b7280",
                      }}
                    >
                      {inquiry.propertyLocation}
                    </span>
                  </div>

                  {/* Customer Details - View Only */}
                  <div
                    className="customer-info"
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      display: "flex",
                      gap: "15px",
                      flexWrap: "wrap",
                      marginTop: "5px",
                    }}
                  >
                    <span>
                      <strong>👤 Customer:</strong> {inquiry.customerName}
                    </span>
                    <span>
                      <strong>📧 Email:</strong> {inquiry.customerEmail}
                    </span>
                    {inquiry.phone && (
                      <span>
                        <strong>📞 Phone:</strong> {inquiry.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Dropdown - Agent can update */}
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <div
                    style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                      backgroundColor: `${getStatusColor(inquiry.status)}20`,
                      color: getStatusColor(inquiry.status),
                    }}
                  >
                    {getStatusIcon(inquiry.status)}{" "}
                    {inquiry.status.toUpperCase()}
                  </div>
                  <select
                    value={inquiry.status}
                    onChange={(e) =>
                      updateInquiryStatus(inquiry._id, e.target.value)
                    }
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: `1px solid ${getStatusColor(inquiry.status)}`,
                      color: getStatusColor(inquiry.status),
                      background: `${getStatusColor(inquiry.status)}10`,
                      cursor: "pointer",
                      fontWeight: "500",
                      fontSize: "12px",
                    }}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="reviewing">👀 Reviewing</option>
                    <option value="responded">✅ Responded</option>
                    <option value="closed">🔒 Closed</option>
                  </select>
                </div>
              </div>

              {/* Property Price */}
              <div
                style={{
                  marginBottom: "16px",
                  padding: "8px 12px",
                  background: "#f0fdf4",
                  borderRadius: "8px",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#10b981",
                  }}
                >
                  💰 AED {parseInt(inquiry.propertyPrice).toLocaleString()}
                </span>
              </div>

              {/* Customer Message - View Only */}
              <div
                className="inquiry-message"
                style={{
                  marginBottom: "16px",
                  padding: "16px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  borderLeft: `3px solid ${getStatusColor(inquiry.status)}`,
                }}
              >
                <strong
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#374151",
                  }}
                >
                  Message from {inquiry.customerName}:
                </strong>
                <p style={{ margin: 0, lineHeight: "1.5", color: "#4b5563" }}>
                  {inquiry.message}
                </p>
              </div>

              {/* Footer with Date and Reply Button */}
              <div
                className="inquiry-footer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <span
                  className="inquiry-date"
                  style={{ fontSize: "12px", color: "#9ca3af" }}
                >
                  📅 Received: {new Date(inquiry.createdAt).toLocaleString()}
                </span>
                <button
                  className="btn-reply"
                  onClick={() => setSelectedInquiry(inquiry)}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  💬 Reply to Customer
                </button>
              </div>

              {/* Replies History - View Only */}
              {inquiry.replies && inquiry.replies.length > 0 && (
                <div
                  className="replies-section"
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <strong
                    style={{
                      fontSize: "14px",
                      display: "block",
                      marginBottom: "12px",
                      color: "#374151",
                    }}
                  >
                    📝 Reply History ({inquiry.replies.length})
                  </strong>
                  {inquiry.replies.map((reply, index) => (
                    <div
                      key={reply._id || index}
                      className="reply-item"
                      style={{
                        padding: "12px",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#3b82f6",
                          }}
                        >
                          Agent's Reply:
                        </span>
                        <span
                          className="reply-date"
                          style={{ fontSize: "11px", color: "#6b7280" }}
                        >
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          color: "#4b5563",
                        }}
                      >
                        {reply.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal - Agent can send replies */}
      {selectedInquiry && (
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
              width: "550px",
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
                Reply to {selectedInquiry.customerName}
              </h3>
              <button
                onClick={() => setSelectedInquiry(null)}
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
              {/* Customer Details - View Only */}
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
                  Customer Details
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "4px",
                  }}
                >
                  {selectedInquiry.customerName}
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  {selectedInquiry.customerEmail}
                  {selectedInquiry.phone && ` | ${selectedInquiry.phone}`}
                </div>
              </div>

              {/* Property Details - View Only */}
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
                  {selectedInquiry.propertyTitle}
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  📍 {selectedInquiry.propertyLocation} | 💰 AED{" "}
                  {parseInt(selectedInquiry.propertyPrice).toLocaleString()}
                </div>
              </div>

              {/* Original Customer Message - View Only */}
              <div
                className="original-message"
                style={{
                  marginBottom: "20px",
                  padding: "12px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                  }}
                >
                  Customer's Message:
                </strong>
                <p style={{ margin: 0, fontSize: "14px", color: "#4b5563" }}>
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Agent Reply Input */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Your Reply:
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={`Type your reply to ${selectedInquiry.customerName}...`}
                  rows="5"
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
                onClick={() => setSelectedInquiry(null)}
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
                onClick={() => sendReply(selectedInquiry._id)}
                disabled={!replyMessage.trim()}
                style={{
                  padding: "8px 20px",
                  backgroundColor: replyMessage.trim() ? "#3b82f6" : "#9ca3af",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: replyMessage.trim() ? "pointer" : "not-allowed",
                  fontSize: "14px",
                }}
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentInbox;
