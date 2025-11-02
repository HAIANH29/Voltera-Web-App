import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import api from "../../config/api";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [postId, setPostId] = useState("");
  const [amount, setAmount] = useState("");
  const [orderInfo, setOrderInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [postDetails, setPostDetails] = useState(null);

  // Lấy thông tin từ URL params
  useEffect(() => {
    const postIdParam = searchParams.get("postId");
    const amountParam = searchParams.get("amount");
    const contractId = searchParams.get("contractId");
    const transactionId = searchParams.get("transactionId");
    const paymentType = searchParams.get("paymentType"); // fee or contract
    const orderInfoParam = searchParams.get("orderInfo");

    console.log("PaymentPage URL params:", {
      postIdParam,
      amountParam,
      contractId,
      transactionId,
      paymentType,
      orderInfoParam,
    });

    if (postIdParam) {
      setPostId(postIdParam);
      fetchPostDetails(postIdParam);
    }
    if (amountParam) {
      setAmount(amountParam);
    }
    if (contractId) {
      setOrderInfo(`Payment for contract #${contractId}`);
    }
    if (orderInfoParam) {
      setOrderInfo(decodeURIComponent(orderInfoParam));
    }
  }, [searchParams]);

  // Fetch thông tin bài post
  const fetchPostDetails = async (id) => {
    try {
      const response = await api.get(`/api/post/detail/${id}`);
      setPostDetails(response.data);
      if (!orderInfo) {
        setOrderInfo(
          `Payment for ${response.data.title || "vehicle purchase"}`
        );
      }
    } catch (err) {
      console.error("Error fetching post details:", err);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || !orderInfo || !postId) {
      setError("Missing required information. Please go back and try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const transactionId = searchParams.get("transactionId");
      const paymentType = searchParams.get("paymentType"); // fee or contract

      console.log("Creating payment with:", {
        amount: parseInt(amount),
        orderInfo,
        postId: parseInt(postId),
        transactionId: transactionId,
        paymentType: paymentType,
      });

      let apiUrl;
      let requestBody;

      if (paymentType === "fee") {
        // Fee payment: Seller → Admin
        if (
          !transactionId ||
          transactionId === "undefined" ||
          transactionId === "null"
        ) {
          setError("Transaction ID is required for fee payment.");
          return;
        }
        apiUrl = `/api/fee/create-payment/${transactionId}`;
        requestBody = {}; // Fee API might not need body
        console.log("Processing FEE payment for seller");
      } else {
        // Contract payment: Buyer → Seller
        apiUrl = "/api/vnpay/create-payment";
        requestBody = {
          amount: parseInt(amount),
          orderInfo,
          postId: parseInt(postId),
        };
        console.log("Processing CONTRACT payment for buyer");
      }

      console.log("API URL:", apiUrl);
      console.log("Request body:", requestBody);

      const response = await api.post(apiUrl, requestBody);

      console.log(
        "🔍 Full VNPay response:",
        JSON.stringify(response.data, null, 2)
      );

      if (response.data.code === "00") {
        // Check response structure
        if (response.data.paymentUrl) {
          console.log(
            "✅ Payment URL found - redirecting to VNPay (supports MoMo):",
            response.data.paymentUrl
          );
          // Redirect tới VNPay web page (có QR cho MoMo)
          window.location.href = response.data.paymentUrl;
        } else if (
          response.data.qrCode ||
          response.data.data?.includes("00020101")
        ) {
          // Still got QR - force redirect to VNPay web anyway
          console.log("📱 QR Code detected, redirecting to VNPay web page");
          window.location.href =
            "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        } else {
          console.log("❌ No payment URL found in response");
          setError(
            `No payment URL received. Response: ${JSON.stringify(
              response.data
            )}`
          );
        }
      } else {
        setError(
          `Payment creation failed: ${
            response.data.message || `Code: ${response.data.code}`
          }`
        );
      }
    } catch (err) {
      setError("An error occurred while creating payment");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        {/* Payment Type Header */}
        {searchParams.get("paymentType") === "fee" ? (
          <div className="payment-type-header fee-payment">
            <h1 className="payment-title">🏛️ Fee Payment - Seller to Admin</h1>
            <p className="payment-subtitle">
              Pay posting fee to publish your listing
            </p>
          </div>
        ) : (
          <div className="payment-type-header contract-payment">
            <h1 className="payment-title">
              💳 Contract Payment - Buyer to Seller
            </h1>
            <p className="payment-subtitle">Complete your vehicle purchase</p>
          </div>
        )}

        {/* Test Environment Notice */}
        <div className="test-notice">
          <h3>🧪 SANDBOX MODE - For Testing Only</h3>
          <div className="test-credentials">
            <h4>📱 MoMo Test Account:</h4>
            <ul>
              <li>
                <strong>Phone:</strong> <code>0999999999</code>
              </li>
              <li>
                <strong>Password:</strong> <code>123456</code>
              </li>
              <li>
                <strong>OTP:</strong> <code>888888</code>
              </li>
            </ul>
            <p>
              <em>⚠️ Do not use real phone numbers in sandbox!</em>
            </p>
          </div>
        </div>

        {/* Display payment information */}
        {searchParams.get("contractId") && (
          <div className="payment-contract-info">
            <h3>💼 Contract Payment</h3>
            <div className="contract-payment-summary">
              <div className="contract-details">
                <div className="contract-field">
                  <strong>Contract ID:</strong> #
                  {searchParams.get("contractId")}
                </div>
                <div className="contract-field">
                  <strong>Transaction ID:</strong> #
                  {searchParams.get("transactionId")}
                </div>
                <div className="contract-field">
                  <strong>Status:</strong>{" "}
                  <span className="status-badge">Both parties signed ✅</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hiển thị thông tin sản phẩm nếu có */}
        {postDetails && (
          <div className="payment-product-info">
            <h3>
              {searchParams.get("contractId")
                ? "Vehicle Details:"
                : "Payment for:"}
            </h3>
            <div className="product-summary">
              <img
                src={
                  postDetails.thumbnail ||
                  postDetails.imageUrls?.[0] ||
                  "/placeholder.jpg"
                }
                alt={postDetails.title}
                className="product-image"
              />
              <div className="product-details">
                <h4>{postDetails.title}</h4>
                <p>{postDetails.location}</p>
                {searchParams.get("contractId") && (
                  <p className="contract-note">
                    🤝 This payment is secured by a signed contract between
                    buyer and seller.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-group">
            <label htmlFor="postId">Post ID</label>
            <input
              type="text"
              id="postId"
              value={postId}
              onChange={(e) => setPostId(e.target.value)}
              placeholder="Post ID"
              required
              disabled={searchParams.get("postId")}
            />
          </div>

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

          <div className="payment-actions">
            <button
              type="button"
              className="payment-button secondary"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Back
            </button>
            <button type="submit" className="payment-button" disabled={loading}>
              {loading ? "Processing..." : "Pay with VNPAY"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
