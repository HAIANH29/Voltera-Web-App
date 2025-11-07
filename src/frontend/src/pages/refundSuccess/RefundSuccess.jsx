import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./RefundSuccess.css";

const RefundSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [refundInfo, setRefundInfo] = useState(null);

  useEffect(() => {
    const refundId = searchParams.get("refundId");
    const amount = searchParams.get("amount");

    if (refundId && amount) {
      setRefundInfo({
        refundId,
        amount: parseFloat(amount),
      });
    }
  }, [searchParams]);

  const handleBackToRefunds = () => {
    navigate("/refunds");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="refund-success-page">
      <div className="success-container">
        <div className="success-icon">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#28a745"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
        </div>

        <h1 className="success-title">Refund Successful! 🎉</h1>

        <p className="success-message">
          Your refund request has been processed successfully.
        </p>

        {refundInfo && (
          <div className="refund-details">
            <div className="detail-item">
              <span className="label">Refund ID:</span>
              <span className="value">#{refundInfo.refundId}</span>
            </div>
            <div className="detail-item">
              <span className="label">Amount:</span>
              <span className="value amount">
                {formatCurrency(refundInfo.amount)}
              </span>
            </div>
          </div>
        )}

        <div className="success-info">
          <div className="info-item">
            <div className="info-icon">💳</div>
            <div className="info-text">
              <h3>Payment Processing</h3>
              <p>
                The refund amount will be credited to your account within 3-5
                business days.
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">📧</div>
            <div className="info-text">
              <h3>Confirmation Email</h3>
              <p>
                A confirmation email has been sent to your registered email
                address.
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">📞</div>
            <div className="info-text">
              <h3>Support</h3>
              <p>
                If you have any questions, please contact our customer support.
              </p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-secondary" onClick={handleBackToRefunds}>
            Back to Refunds
          </button>
          <button className="btn-primary" onClick={handleBackToDashboard}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundSuccess;
