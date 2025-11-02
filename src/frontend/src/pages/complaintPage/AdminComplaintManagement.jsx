import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import './ComplaintPage.css';
import toast from 'react-hot-toast';

const Icons = {
  MessageCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  XCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Send: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
};

const AdminComplaintManagement = () => {
  const [activeTab, setActiveTab] = useState('unresolved');
  const [complaints, setComplaints] = useState([]);
  const [unresolvedComplaints, setUnresolvedComplaints] = useState([]);
  const [myReplies, setMyReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'unresolved') {
        await loadUnresolvedComplaints();
      } else if (activeTab === 'search') {
        // Search functionality
      } else if (activeTab === 'my-replies') {
        await loadMyReplies();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnresolvedComplaints = async () => {
    try {
      const response = await api.get('/api/reply-complaint/unresolve');
      setUnresolvedComplaints(response.data || []);
    } catch (error) {
      console.error('Error loading unresolved complaints:', error);
      toast.error('Failed to load unresolved complaints');
      // Mock data for testing
      setUnresolvedComplaints([
        {
          id: 1,
          problem: 'Unable to complete payment',
          description: 'Payment keeps failing with error code 500',
          status: 'PENDING',
          createAt: new Date().toISOString(),
          userId: { username: 'user123', email: 'user@example.com' }
        },
        {
          id: 2,
          problem: 'Account locked after password reset',
          description: 'My account got locked and I cannot access it anymore',
          status: 'PENDING',
          createAt: new Date(Date.now() - 86400000).toISOString(),
          userId: { username: 'jane_doe', email: 'jane@example.com' }
        }
      ]);
    }
  };

  const loadMyReplies = async () => {
    try {
      const response = await api.get('/api/reply-complaint/my-complaint');
      setMyReplies(response.data || []);
    } catch (error) {
      console.error('Error loading my replies:', error);
      toast.error('Failed to load your replies');
      setMyReplies([]);
    }
  };

  const searchComplaints = async (problem) => {
    if (!problem.trim()) {
      setComplaints([]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/api/reply-complaint/search?problem=${encodeURIComponent(problem)}`);
      setComplaints(response.data || []);
    } catch (error) {
      console.error('Error searching complaints:', error);
      toast.error('Failed to search complaints');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      setReplyLoading(true);
      const response = await api.post(`/api/reply-complaint/create-reply/${selectedComplaint.id}`, {
        content: replyText.trim(),
        adminNote: 'Admin response via complaint management system'
      });

      if (response.data) {
        toast.success('Reply sent successfully!');
        setShowReplyModal(false);
        setReplyText('');
        setSelectedComplaint(null);
        loadData(); // Refresh the data
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      if (error.response?.status === 401) {
        toast.error('Please login as admin to reply');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Admin permissions required.');
      } else {
        toast.error('Failed to send reply. Please try again.');
      }
    } finally {
      setReplyLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return <Icons.Clock />;
      case 'RESOLVED': return <Icons.CheckCircle />;
      case 'REJECTED': return <Icons.XCircle />;
      default: return <Icons.AlertTriangle />;
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return 'warning';
      case 'RESOLVED': return 'success';
      case 'REJECTED': return 'danger';
      default: return 'info';
    }
  };

  // Get current complaints based on active tab
  const getCurrentComplaints = () => {
    switch(activeTab) {
      case 'unresolved':
        return unresolvedComplaints;
      case 'search':
        return complaints;
      case 'my-replies':
        return myReplies;
      default:
        return [];
    }
  };

  // Filter complaints based on search term
  const filteredComplaints = getCurrentComplaints().filter(complaint => 
    complaint.problem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const tabs = [
    { id: 'unresolved', label: 'Unresolved Issues', count: unresolvedComplaints.length },
    { id: 'search', label: 'Search Complaints', count: null },
    { id: 'my-replies', label: 'My Replies', count: myReplies.length }
  ];

  return (
    <div className="complaint-page">
      <div className="complaint-container">
        {/* Header */}
        <div className="complaint-header">
          <div className="header-content">
            <h1>
              <Icons.MessageCircle />
              Complaint Management
            </h1>
            <p>Manage and respond to user complaints</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <Icons.MessageCircle />
            </div>
            <div className="stat-content">
              <h3>{unresolvedComplaints.length + myReplies.length}</h3>
              <p>Total Complaints</p>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">
              <Icons.Clock />
            </div>
            <div className="stat-content">
              <h3>{unresolvedComplaints.length}</h3>
              <p>Pending Review</p>
            </div>
          </div>
          <div className="stat-card resolved">
            <div className="stat-icon">
              <Icons.CheckCircle />
            </div>
            <div className="stat-content">
              <h3>{myReplies.length}</h3>
              <p>Replied</p>
            </div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-icon">
              <Icons.AlertTriangle />
            </div>
            <div className="stat-content">
              <h3>24h</h3>
              <p>Avg Response Time</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="tab-count">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Search Section for Search Tab */}
        {activeTab === 'search' && (
          <div className="search-section">
            <div className="search-box">
              <Icons.Search />
              <input
                type="text"
                placeholder="Search complaints by problem, description, or username..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim()) {
                    searchComplaints(e.target.value);
                  } else {
                    setComplaints([]);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* General Search for other tabs */}
        {activeTab !== 'search' && (
          <div className="complaint-filters">
            <div className="search-box">
              <Icons.Search />
              <input
                type="text"
                placeholder="Filter complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Complaints List */}
        <div className="complaints-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading complaints...</p>
            </div>
          ) : paginatedComplaints.length === 0 ? (
            <div className="empty-state">
              <Icons.MessageCircle />
              <h3>
                {activeTab === 'search' && !searchTerm 
                  ? 'Enter search terms to find complaints'
                  : 'No Complaints Found'
                }
              </h3>
              <p>
                {activeTab === 'search' && !searchTerm
                  ? 'Use the search box above to find specific complaints'
                  : activeTab === 'unresolved'
                  ? 'All complaints have been resolved!'
                  : 'No complaints match your criteria'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="admin-complaints-table">
                <table className="complaints-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Problem</th>
                      <th>User</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedComplaints.map((complaint) => (
                      <tr key={complaint.id} className="complaint-row">
                        <td className="complaint-id">#{complaint.id}</td>
                        <td className="complaint-problem">
                          <div className="problem-cell">
                            <h4>{complaint.problem}</h4>
                            <p>{complaint.description?.substring(0, 80)}...</p>
                          </div>
                        </td>
                        <td className="complaint-user">
                          <div className="user-cell">
                            <Icons.User />
                            <div>
                              <div className="username">{complaint.userId?.username || 'Unknown'}</div>
                              <div className="email">{complaint.userId?.email || 'No email'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="complaint-status">
                          <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                            {getStatusIcon(complaint.status)}
                            {complaint.status}
                          </span>
                        </td>
                        <td className="complaint-date">
                          <div className="date-cell">
                            <Icons.Calendar />
                            <div>
                              <div className="date">{new Date(complaint.createAt).toLocaleDateString()}</div>
                              <div className="time">{new Date(complaint.createAt).toLocaleTimeString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="complaint-actions">
                          <button 
                            className="action-btn view"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <Icons.Eye />
                          </button>
                          <button 
                            className="action-btn reply"
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setShowReplyModal(true);
                            }}
                          >
                            <Icons.Send />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  
                  <div className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <button 
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Complaint Detail Modal */}
        {selectedComplaint && !showReplyModal && (
          <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
            <div className="modal-content complaint-detail-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Complaint Details #{selectedComplaint.id}</h3>
                <button onClick={() => setSelectedComplaint(null)}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="complaint-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Problem:</label>
                      <span>{selectedComplaint.problem}</span>
                    </div>
                    <div className="info-item">
                      <label>Status:</label>
                      <span className={`status-badge ${getStatusColor(selectedComplaint.status)}`}>
                        {getStatusIcon(selectedComplaint.status)}
                        {selectedComplaint.status}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>User:</label>
                      <span>{selectedComplaint.userId?.username} ({selectedComplaint.userId?.email})</span>
                    </div>
                    <div className="info-item">
                      <label>Date:</label>
                      <span>{new Date(selectedComplaint.createAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="description-section">
                    <h4>Description</h4>
                    <p>{selectedComplaint.description}</p>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="reply-btn"
                  onClick={() => setShowReplyModal(true)}
                >
                  <Icons.Send />
                  Reply to User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reply Modal */}
        {showReplyModal && selectedComplaint && (
          <div className="modal-overlay" onClick={() => setShowReplyModal(false)}>
            <div className="modal-content reply-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Reply to Complaint #{selectedComplaint.id}</h3>
                <button onClick={() => setShowReplyModal(false)}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="complaint-summary">
                  <h4>{selectedComplaint.problem}</h4>
                  <p>{selectedComplaint.description}</p>
                </div>
                
                <div className="reply-form">
                  <label htmlFor="replyText">Your Response:</label>
                  <textarea
                    id="replyText"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Provide a helpful response to address the user's concern..."
                    rows={6}
                    maxLength={1000}
                  />
                  <div className="reply-hint">
                    {replyText.length}/1000 characters
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowReplyModal(false)}
                  disabled={replyLoading}
                >
                  Cancel
                </button>
                <button 
                  className="send-btn"
                  onClick={handleReplySubmit}
                  disabled={replyLoading || !replyText.trim()}
                >
                  {replyLoading ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icons.Send />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaintManagement;