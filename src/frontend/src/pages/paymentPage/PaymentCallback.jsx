import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./PaymentPage.css"; // Reuse styles

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing payment result...");

  useEffect(() => {
    const verifyPayment = async () => {
      const params = Object.fromEntries(searchParams.entries());

      try {
        // Send params to backend for verification
        const response = await fetch("/api/payment/vnpay-callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        const result = await response.json();

        if (result.success) {
          setStatus("success");
          setMessage("Payment successful! Thank you for using our service.");
        } else {
          setStatus("failed");
          setMessage("Payment failed. Please try again.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred while verifying payment.");
        console.error(error);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1 className="payment-title">
          {status === "success"
            ? "✅ Payment Successful"
            : status === "failed"
            ? "❌ Payment Failed"
            : status === "error"
            ? "⚠️ Processing Error"
            : "⏳ Processing"}
        </h1>
        <div className="callback-message">
          <p>{message}</p>
        </div>
        <div className="callback-actions">
          <button
            onClick={() => (window.location.href = "/")}
            className="payment-button"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
