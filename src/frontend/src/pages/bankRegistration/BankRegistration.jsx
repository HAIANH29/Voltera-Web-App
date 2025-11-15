import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import "./BankRegistration.css";

const BankRegistration = () => {
  const [formData, setFormData] = useState({
    bankName: "",
    bankNumber: "",
    accountName: "",
    securityCode: "",
    expDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [hasExistingBank, setHasExistingBank] = useState(false);
  const navigate = useNavigate();

  // Check if user already has a bank account
  useEffect(() => {
    const checkExistingBankAccount = async () => {
      try {
        const response = await api.get("/api/bank/my-bank");
        if (response.data) {
          setHasExistingBank(true);
          setError(
            "You already have a registered bank account. Only one bank account per user is allowed."
          );
        }
      } catch (err) {
        // If 404 or any error, user doesn't have bank account yet
        setHasExistingBank(false);
      } finally {
        setCheckingExisting(false);
      }
    };

    checkExistingBankAccount();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Input formatting and validation
    let formattedValue = value;

    if (name === "bankNumber") {
      // Only allow digits for bank number
      formattedValue = value.replace(/\D/g, "");
    } else if (name === "securityCode") {
      // Only allow digits for security code
      formattedValue = value.replace(/\D/g, "");
    } else if (name === "accountName") {
      // Only allow letters, spaces, and Vietnamese characters
      formattedValue = value.replace(/[^a-zA-Z\s\u00C0-\u1EF9]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!formData.bankName.trim()) {
      setError("Bank name is required");
      return false;
    }

    // Improved bank number validation
    const bankNumberRegex = /^[0-9]{9,19}$/;
    if (!bankNumberRegex.test(formData.bankNumber)) {
      setError("Bank account number must be 9-19 digits");
      return false;
    }

    if (!formData.accountName.trim()) {
      setError("Account holder name is required");
      return false;
    }

    // Check account name contains valid characters
    if (!/^[a-zA-Z\s\u00C0-\u1EF9]+$/.test(formData.accountName)) {
      setError("Account holder name can only contain letters and spaces");
      return false;
    }

    if (!/^[0-9]{3}$/.test(formData.securityCode)) {
      setError("Security code must be exactly 3 digits");
      return false;
    }

    if (!formData.expDate) {
      setError("Expiration date is required");
      return false;
    }

    const expDate = new Date(formData.expDate);
    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 10); // Max 10 years in future

    if (expDate <= today) {
      setError("Expiration date must be in the future");
      return false;
    }

    if (expDate > oneYearFromNow) {
      setError("Expiration date seems too far in the future");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/bank/register-seller", formData);
      setSuccess(true);
      setError("");
    } catch (err) {
      setError(err.response?.data || "Failed to register bank account");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccess(false);
    // Redirect based on user role
    const userRole = JSON.parse(
      localStorage.getItem("currentUser") || "{}"
    ).role;
    if (userRole === "SELLER") {
      navigate("/dashboard-seller");
    } else {
      navigate("/dashboard");
    }
  };

  if (checkingExisting) {
    return (
      <div className="bank-registration-container">
        <div className="bank-registration-card">
          <div className="loading-check">
            <h2>Checking your account...</h2>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (hasExistingBank) {
    return (
      <div className="bank-registration-container">
        <div className="bank-registration-card">
          <h2>⚠️ Bank Account Already Exists</h2>
          <div className="existing-bank-message">
            <p>You already have a registered bank account.</p>
            <p>
              Only one bank account per user is allowed for security reasons.
            </p>
            <div className="action-buttons">
              <button onClick={() => navigate(-1)} className="btn-secondary">
                Go Back
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bank-registration-container">
      <div className="bank-registration-card">
        <h2>Register Bank Account</h2>
        <p className="subtitle">
          Please provide your bank account details to receive payments
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="bank-form">
          <div className="form-group">
            <label htmlFor="bankName">Bank Name *</label>
            <select
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
            >
              <option value="">Select your bank</option>
              <option value="Vietcombank">Vietcombank</option>
              <option value="VietinBank">VietinBank</option>
              <option value="BIDV">BIDV</option>
              <option value="Agribank">Agribank</option>
              <option value="Techcombank">Techcombank</option>
              <option value="MB Bank">MB Bank</option>
              <option value="ACB">ACB</option>
              <option value="VPBank">VPBank</option>
              <option value="TPBank">TPBank</option>
              <option value="Sacombank">Sacombank</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bankNumber">Bank Account Number *</label>
            <input
              type="text"
              id="bankNumber"
              name="bankNumber"
              value={formData.bankNumber}
              onChange={handleChange}
              placeholder="Enter 9-19 digit account number"
              maxLength="19"
              required
              autoComplete="off"
            />
            <small className="form-hint">Only digits are allowed</small>
          </div>

          <div className="form-group">
            <label htmlFor="accountName">Account Holder Name *</label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="Enter full name as on bank account"
              maxLength="200"
              required
              autoComplete="name"
            />
            <small className="form-hint">
              Must match your bank account exactly
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="securityCode">Security Code (CVV) *</label>
              <input
                type="password"
                id="securityCode"
                name="securityCode"
                value={formData.securityCode}
                onChange={handleChange}
                placeholder="3 digits"
                maxLength="3"
                required
                autoComplete="off"
              />
              <small className="form-hint">3-digit security code</small>
            </div>

            <div className="form-group">
              <label htmlFor="expDate">Expiration Date *</label>
              <input
                type="date"
                id="expDate"
                name="expDate"
                value={formData.expDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                max={
                  new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                }
                required
              />
              <small className="form-hint">Card expiration date</small>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Register Bank Account"}
          </button>
        </form>

        <div className="security-note">
          🔒 Your bank information is encrypted and securely stored
        </div>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">✅</div>
            <h2>Bank Account Registered Successfully!</h2>
            <p>
              Your bank account has been registered and verified. You can now
              receive payments from buyers.
            </p>
            <div className="success-details">
              <p>
                <strong>Bank:</strong> {formData.bankName}
              </p>
              <p>
                <strong>Account:</strong> {formData.bankNumber}
              </p>
              <p>
                <strong>Holder:</strong> {formData.accountName}
              </p>
            </div>
            <button onClick={handleSuccessClose} className="success-btn">
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankRegistration;
