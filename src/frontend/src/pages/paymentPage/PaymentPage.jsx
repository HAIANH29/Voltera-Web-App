import React, { useState } from "react";
import "./PaymentPage.css";
import api from "../../config/api";

const PaymentPage = () => {
  const [amount, setAmount] = useState("");
  const [orderInfo, setOrderInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || !orderInfo) {
      setError("Please enter all information");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/payment/create-vnpay-url", {
        amount: parseInt(amount),
        orderInfo,
        returnUrl: `${window.location.origin}/payment/callback`,
      });

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        setError("Unable to create payment URL");
      }
    } catch (err) {
      setError("An error occurred while creating payment");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1 className="payment-title">Payment via VNPAY</h1>
        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-group">
            <label htmlFor="amount">Amount (VND)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1000"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="orderInfo">Order Description</label>
            <textarea
              id="orderInfo"
              value={orderInfo}
              onChange={(e) => setOrderInfo(e.target.value)}
              placeholder="Enter order description"
              rows="4"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="payment-button" disabled={loading}>
            {loading ? "Processing..." : "Pay with VNPAY"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
