import React, { useState } from 'react';
import api from '../../config/api';
import './ComplaintPage.css';
import toast from 'react-hot-toast';

const Icons = {
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Send: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  MessageSquare: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  FileText: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
};

const ComplaintForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    problem: '',
    description: '',
    complaintType: 'TECHNICAL_ISSUE'
  });
  const [loading, setLoading] = useState(false);

  const complaintTypes = [
    { value: 'TECHNICAL_ISSUE', label: 'Technical Issue', icon: '⚙️' },
    { value: 'PAYMENT_PROBLEM', label: 'Payment Problem', icon: '💳' },
    { value: 'ACCOUNT_ACCESS', label: 'Account Access', icon: '🔐' },
    { value: 'LISTING_ISSUE', label: 'Listing Issue', icon: '📋' },
    { value: 'USER_CONDUCT', label: 'User Conduct', icon: '👤' },
    { value: 'FRAUD_REPORT', label: 'Fraud Report', icon: '⚠️' },
    { value: 'FEATURE_REQUEST', label: 'Feature Request', icon: '💡' },
    { value: 'OTHER', label: 'Other', icon: '📝' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.problem.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.description.trim().length < 20) {
      toast.error('Please provide a more detailed description (minimum 20 characters)');
      return;
    }

    try {
      setLoading(true);
      
      const complaintPayload = {
        problem: formData.problem.trim(),
        description: formData.description.trim(),
        complaintType: formData.complaintType,
        priority: 'MEDIUM' // Default priority
      };

      const response = await api.post('/api/complaints', complaintPayload);
      
      if (response.data) {
        toast.success('Complaint submitted successfully!');
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      
      if (error.response?.status === 401) {
        toast.error('Please login to submit a complaint');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid complaint data');
      } else {
        toast.error('Failed to submit complaint. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="complaint-page">
      <div className="complaint-container">
        {/* Header */}
        <div className="complaint-header">
          <button className="back-btn" onClick={onCancel}>
            <Icons.ArrowLeft />
            Back to Complaints
          </button>
          <h1>
            <Icons.MessageSquare />
            Submit New Complaint
          </h1>
        </div>

        {/* Form */}
        <div className="complaint-form-container">
          <div className="form-card">
            <div className="form-header">
              <h2>Tell us about your issue</h2>
              <p>Please provide detailed information to help us resolve your concern quickly.</p>
            </div>

            <form onSubmit={handleSubmit} className="complaint-form">
              {/* Complaint Type */}
              <div className="form-group">
                <label htmlFor="complaintType">
                  <Icons.FileText />
                  Issue Category *
                </label>
                <div className="complaint-types-grid">
                  {complaintTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`complaint-type-card ${
                        formData.complaintType === type.value ? 'selected' : ''
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, complaintType: type.value }))}
                    >
                      <div className="type-icon">{type.icon}</div>
                      <div className="type-label">{type.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Problem Title */}
              <div className="form-group">
                <label htmlFor="problem">
                  <Icons.AlertTriangle />
                  Issue Title *
                </label>
                <input
                  type="text"
                  id="problem"
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  placeholder="Brief summary of your issue..."
                  maxLength={100}
                  required
                />
                <div className="input-hint">
                  {formData.problem.length}/100 characters
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">
                  <Icons.FileText />
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please provide a detailed description of the issue you're experiencing. Include steps to reproduce, error messages, and any other relevant information..."
                  rows={6}
                  maxLength={1000}
                  required
                />
                <div className="input-hint">
                  {formData.description.length}/1000 characters (minimum 20 required)
                </div>
              </div>

              {/* Tips Section */}
              <div className="tips-section">
                <h3>
                  <Icons.Star />
                  Tips for better support
                </h3>
                <ul>
                  <li>Be specific about when the issue occurred</li>
                  <li>Include any error messages you received</li>
                  <li>Mention what browser/device you're using</li>
                  <li>Describe what you were trying to do when the issue happened</li>
                  <li>Include screenshots if helpful (you can attach them after submission)</li>
                </ul>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || !formData.problem.trim() || !formData.description.trim() || formData.description.length < 20}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Icons.Send />
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="help-card">
            <h3>Need immediate help?</h3>
            <div className="help-options">
              <div className="help-option">
                <div className="help-icon">📞</div>
                <div className="help-content">
                  <h4>Phone Support</h4>
                  <p>Call us at: <strong>1800-VOLTERA</strong></p>
                  <small>Available 9 AM - 6 PM (Mon-Fri)</small>
                </div>
              </div>
              
              <div className="help-option">
                <div className="help-icon">💬</div>
                <div className="help-content">
                  <h4>Live Chat</h4>
                  <p>Chat with our support team</p>
                  <small>Average response: 2-5 minutes</small>
                </div>
              </div>
              
              <div className="help-option">
                <div className="help-icon">📧</div>
                <div className="help-content">
                  <h4>Email Support</h4>
                  <p>support@voltera.com</p>
                  <small>Response within 24 hours</small>
                </div>
              </div>
            </div>

            <div className="help-footer">
              <p><strong>Expected Response Time:</strong></p>
              <ul>
                <li>Technical Issues: 1-2 business days</li>
                <li>Payment Problems: Same day</li>
                <li>Account Access: 4-6 hours</li>
                <li>General Inquiries: 1-3 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;