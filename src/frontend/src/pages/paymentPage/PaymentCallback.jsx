import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./PaymentPage.css"; // Reuse styles

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing payment result...");
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    const checkPaymentResult = () => {
      const params = Object.fromEntries(searchParams.entries());
      console.log("Payment callback params:", params);

      // VNPay đã tự động callback về backend rồi
      // Frontend chỉ cần hiển thị kết quả dựa trên response code
      const responseCode = params.vnp_ResponseCode;
      const amount = params.vnp_Amount ? parseInt(params.vnp_Amount) / 100 : 0;
      const txnRef = params.vnp_TxnRef;
      const orderInfo = params.vnp_OrderInfo;
      const transactionNo = params.vnp_TransactionNo;
      const bankCode = params.vnp_BankCode;
      const payDate = params.vnp_PayDate;

      setTransactionDetails({
        amount,
        txnRef,
        orderInfo,
        transactionNo,
        bankCode,
        payDate: payDate ? formatPayDate(payDate) : null,
      });

      if (responseCode === "00") {
        setStatus("success");
        setMessage("Payment successful! Your transaction has been completed.");
      } else {
        setStatus("failed");
        setMessage(getErrorMessage(responseCode));
      }
    };

    // Delay 1 giây để hiệu ứng loading
    const timer = setTimeout(checkPaymentResult, 1000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const formatPayDate = (payDate) => {
    if (!payDate || payDate.length !== 14) return payDate;
    const year = payDate.substring(0, 4);
    const month = payDate.substring(4, 6);
    const day = payDate.substring(6, 8);
    const hour = payDate.substring(8, 10);
    const minute = payDate.substring(10, 12);
    const second = payDate.substring(12, 14);

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const getErrorMessage = (code) => {
    const errorMessages = {
      "07": "Transaction is being processed. Please wait.",
      "09": "Your card/account is not registered for Internet Banking service.",
      10: "Card/account authentication failed 3 times.",
      11: "Transaction timeout. Please try again.",
      12: "Card/account is locked.",
      13: "Invalid OTP.",
      24: "User cancelled the transaction.",
      51: "Insufficient account balance.",
      65: "Account has exceeded daily transaction limit.",
      75: "Payment bank is under maintenance.",
      79: "Transaction amount exceeds limit for the transaction.",
      99: "Unknown error. Please try again.",
    };

    return errorMessages[code] || `Transaction failed with code: ${code}`;
  };

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
            : "⏳ Processing Payment"}
        </h1>

        <div className="callback-message">
          <p>{message}</p>
        </div>

        {/* Hiển thị chi tiết giao dịch */}
        {transactionDetails && (
          <div className="transaction-details">
            <h3>Transaction Details:</h3>
            <div className="detail-row">
              <span>Amount:</span>
              <span className="amount">
                {transactionDetails.amount.toLocaleString()} VND
              </span>
            </div>
            <div className="detail-row">
              <span>Reference:</span>
              <span>{transactionDetails.txnRef}</span>
            </div>
            {transactionDetails.transactionNo && (
              <div className="detail-row">
                <span>Transaction No:</span>
                <span>{transactionDetails.transactionNo}</span>
              </div>
            )}
            {transactionDetails.bankCode && (
              <div className="detail-row">
                <span>Bank:</span>
                <span>{transactionDetails.bankCode}</span>
              </div>
            )}
            {transactionDetails.payDate && (
              <div className="detail-row">
                <span>Time:</span>
                <span>{transactionDetails.payDate}</span>
              </div>
            )}
            <div className="detail-row">
              <span>Description:</span>
              <span>{transactionDetails.orderInfo}</span>
            </div>
          </div>
        )}

        <div className="callback-actions">
          {status === "success" && (
            <>
              <button
                onClick={() => navigate("/contract")}
                className="payment-button"
              >
                View Contracts
              </button>
              <button
                onClick={() => navigate("/transactions")}
                className="payment-button secondary"
              >
                View Transactions
              </button>
            </>
          )}
          {status === "failed" && (
            <button
              onClick={() => navigate(-1)}
              className="payment-button secondary"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => navigate("/")}
            className="payment-button secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
