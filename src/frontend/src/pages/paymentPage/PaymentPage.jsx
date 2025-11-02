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

    // Always fetch contract details if contractId exists  
    if (contractId) {
      fetchContractDetails(contractId);
    } else {
      // For non-contract payments
      if (postIdParam && postIdParam !== 'undefined') {
        setPostId(postIdParam);
        fetchPostDetails(postIdParam);
      }
      if (amountParam && amountParam !== 'undefined') {
        setAmount(amountParam);
      }
    }
    
    if (contractId) {
      setOrderInfo(`Payment for contract #${contractId}`);
    }
  }, [searchParams]);

  // Fetch contract details to get missing postId/amount
  const fetchContractDetails = async (contractId) => {
    try {
      const response = await api.get(`/api/contract/${contractId}`);
      const contractData = response.data;
      
      // Always set postId from contract
      if (contractData.postId) {
        setPostId(contractData.postId.toString());
        // Fetch post details to get price
        fetchPostDetails(contractData.postId);
      }
      
      // Set amount from URL params if available
      const amountParam = searchParams.get("amount");
      if (amountParam && amountParam !== 'undefined' && amountParam !== '0') {
        setAmount(amountParam);
      }
      
      // Set order info from contract
      setOrderInfo(`Payment for contract #${contractId} - ${contractData.postTitle || 'Vehicle Purchase'}`);
    } catch (err) {
      console.error("Error fetching contract details:", err);
      setError("Unable to load contract information. Please try again.");
    }
  };

  // Fetch thông tin bài post
  const fetchPostDetails = async (id) => {
    try {
      const response = await api.get(`/api/post/detail/${id}`);
      const postData = response.data;
      
      setPostDetails(postData);
      
      // Auto-fill amount from post price
      const amountParam = searchParams.get("amount");
      const isContractPayment = searchParams.get("contractId");
      
      if (postData.price && postData.price > 0) {
        if (isContractPayment) {
          // Contract payment - always use post price if no valid amount from URL
          if (!amountParam || amountParam === 'undefined' || amountParam === '0' || !amount) {
            setAmount(postData.price.toString());
          }
        } else {
          // Regular payment - auto-fill if empty
          if (!amount || amount === 'undefined' || amount === '0') {
            setAmount(postData.price.toString());
          }
        }
      }
      
      // Set order info if not from contract
      if (!orderInfo || !isContractPayment) {
        setOrderInfo(`Payment for ${postData.title || "vehicle purchase"}`);
      }
    } catch (err) {
      console.error("Error fetching post details:", err);
      setError("Unable to load product information. Please try again.");
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!amount || !orderInfo) {
      setError("Please fill in all required fields.");
      return;
    }
    
    // PostId only required for non-contract payments
    const isContractPayment = searchParams.get("contractId");
    if (!isContractPayment && !postId) {
      setError("Post ID is required for direct payments.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const transactionId = searchParams.get("transactionId");

      const paymentData = {
        amount: parseInt(amount),
        orderInfo,
        ...(postId && { postId: parseInt(postId) }) // Only include postId if available
      };

      let apiUrl;
      let requestBody;

      const response = await api.post(apiUrl, paymentData);

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
        <h1 className="payment-title">Payment via VNPAY</h1>

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
          {/* Only show Post ID field if not from contract */}
          {!searchParams.get("contractId") && (
            <div className="form-group">
              <label htmlFor="postId">Post ID</label>
              <input
                type="text"
                id="postId"
                value={postId}
                onChange={(e) => setPostId(e.target.value)}
                placeholder="Post ID"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="amount">Amount (VND)</label>
            
            {/* Manual amount input hint */}
            {searchParams.get("contractId") && !amount && (
              <div style={{background: '#fff3cd', padding: '8px', margin: '8px 0', fontSize: '14px', borderRadius: '4px'}}>
                💡 <strong>Note:</strong> Please enter the vehicle price manually
              </div>
            )}
            
            <div className="amount-input-wrapper">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1000"
                required
              />
              {postDetails && postDetails.price && (
                <button
                  type="button"
                  className="auto-fill-btn"
                  onClick={() => setAmount(postDetails.price.toString())}
                >
                  Use Vehicle Price: {new Intl.NumberFormat("vi-VN").format(postDetails.price)} VND
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="orderInfo">Order Description</label>
            <textarea
              id="orderInfo"
              value={orderInfo}
              onChange={(e) => setOrderInfo(e.target.value)}
              placeholder="Enter order description"
              rows="3"
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
