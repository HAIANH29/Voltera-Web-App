import React, { useState } from "react";
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.bankName.trim()) {
      setError("Bank name is required");
      return false;
    }
    if (!/^\d{9,16}$/.test(formData.bankNumber)) {
      setError("Bank number must be 9-16 digits");
      return false;
    }
    if (!formData.accountName.trim()) {
      setError("Account name is required");
      return false;
    }
    if (!/^\d{3}$/.test(formData.securityCode)) {
      setError("Security code must be exactly 3 digits");
      return false;
    }
    if (!formData.expDate) {
      setError("Expiration date is required");
      return false;
    }

    const expDate = new Date(formData.expDate);
    const today = new Date();
    if (expDate <= today) {
      setError("Expiration date must be in the future");
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

      // Success - redirect to seller dashboard
      navigate("/seller-dashboard", {
        state: { message: "Bank account registered successfully!" },
      });
    } catch (err) {
      setError(err.response?.data || "Failed to register bank account");
    } finally {
      setLoading(false);
    }
  };

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
              placeholder="Enter 9-16 digit account number"
              pattern="\d{9,16}"
              maxLength="16"
              required
            />
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
            />
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
                pattern="\d{3}"
                maxLength="3"
                required
              />
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
                required
              />
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
    </div>
  );
};

export default BankRegistration;
