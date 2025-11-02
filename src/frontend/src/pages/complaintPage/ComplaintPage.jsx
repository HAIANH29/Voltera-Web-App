import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import ComplaintForm from './ComplaintForm';
import './ComplaintPage.css';
import toast from 'react-hot-toast';

// Modern Icons
const Icons = {
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  MessageCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
  Eye: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Send: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
};

const ComplaintPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-complaints');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    loadMyComplaints();
  }, []);

  const loadMyComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/complaints/my-complaints');
      
      if (response.data) {
        setComplaints(Array.isArray(response.data) ? response.data : []);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
      toast.error('Unable to load complaints');
      setComplaints([]);
    } finally {
      setLoading(false);
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

  const getPriorityColor = (priority) => {
    switch(priority?.toUpperCase()) {
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'info';
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.problem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || complaint.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const handleComplaintCreated = () => {
    setShowForm(false);
    loadMyComplaints();
    toast.success('Complaint submitted successfully!');
  };

  const handleViewDetail = (complaint) => {
    setSelectedComplaint(complaint);
  };

  if (showForm) {
    return (
      <ComplaintForm 
        onSuccess={handleComplaintCreated}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (selectedComplaint) {
    return (
      <div className="complaint-page">
        <div className="complaint-container">
          {/* Header */}
          <div className="complaint-header">
            <button 
              className="back-btn"
              onClick={() => setSelectedComplaint(null)}
            >
              <Icons.ArrowLeft />
              Back to Complaints
            </button>
            <h1>Complaint Details</h1>
          </div>

          {/* Complaint Detail */}
          <div className="complaint-detail-card">
            <div className="complaint-detail-header">
              <div className="complaint-meta">
                <h2>#{selectedComplaint.id} - {selectedComplaint.problem}</h2>
                <div className="meta-badges">
                  <span className={`status-badge ${getStatusColor(selectedComplaint.status)}`}>
                    {getStatusIcon(selectedComplaint.status)}
                    {selectedComplaint.status}
                  </span>
                  <span className={`priority-badge ${getPriorityColor(selectedComplaint.priority)}`}>
                    {selectedComplaint.priority} Priority
                  </span>
                </div>
              </div>
              <div className="complaint-date">
                <Icons.Clock />
                {new Date(selectedComplaint.createAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            <div className="complaint-content">
              <h3>Description</h3>
              <p>{selectedComplaint.description}</p>
            </div>

            {/* Responses Section */}
            <div className="complaint-responses">
              <h3>
                <Icons.MessageCircle />
                Admin Responses
              </h3>
              <div className="responses-list">
                {selectedComplaint.responses?.length ? (
                  selectedComplaint.responses.map((response, index) => (
                    <div key={index} className="response-item">
                      <div className="response-header">
                        <span className="response-author">Admin</span>
                        <span className="response-date">
                          {new Date(response.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="response-content">
                        {response.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-responses">
                    <Icons.MessageCircle />
                    <p>No admin responses yet. Your complaint is being reviewed.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="complaint-page">
      <div className="complaint-container">
        {/* Header */}
        <div className="complaint-header">
          <div className="header-content">
            <h1>
              <Icons.MessageCircle />
              My Complaints
            </h1>
            <p>Manage and track your submitted complaints</p>
          </div>
          <button 
            className="create-complaint-btn"
            onClick={() => setShowForm(true)}
          >
            <Icons.Plus />
            New Complaint
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <Icons.MessageCircle />
            </div>
            <div className="stat-content">
              <h3>{complaints.length}</h3>
              <p>Total Complaints</p>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">
              <Icons.Clock />
            </div>
            <div className="stat-content">
              <h3>{complaints.filter(c => c.status === 'PENDING').length}</h3>
              <p>Pending Review</p>
            </div>
          </div>
          <div className="stat-card resolved">
            <div className="stat-icon">
              <Icons.CheckCircle />
            </div>
            <div className="stat-content">
              <h3>{complaints.filter(c => c.status === 'RESOLVED').length}</h3>
              <p>Resolved</p>
            </div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-icon">
              <Icons.XCircle />
            </div>
            <div className="stat-content">
              <h3>{complaints.filter(c => c.status === 'REJECTED').length}</h3>
              <p>Rejected</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="complaint-filters">
          <div className="search-box">
            <Icons.Search />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <Icons.Filter />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Complaints List */}
        <div className="complaints-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading complaints...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="empty-state">
              <Icons.MessageCircle />
              <h3>No Complaints Found</h3>
              <p>
                {searchTerm || filterStatus !== 'ALL' 
                  ? 'No complaints match your search criteria'
                  : 'You haven\'t submitted any complaints yet'
                }
              </p>
              {!searchTerm && filterStatus === 'ALL' && (
                <button 
                  className="create-complaint-btn"
                  onClick={() => setShowForm(true)}
                >
                  <Icons.Plus />
                  Create Your First Complaint
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="complaints-grid">
                {paginatedComplaints.map((complaint) => (
                  <div key={complaint.id} className="complaint-card">
                    <div className="complaint-card-header">
                      <div className="complaint-id">#{complaint.id}</div>
                      <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        {complaint.status}
                      </span>
                    </div>
                    
                    <div className="complaint-card-content">
                      <h3>{complaint.problem}</h3>
                      <p className="complaint-description">
                        {complaint.description?.length > 120 
                          ? `${complaint.description.substring(0, 120)}...`
                          : complaint.description
                        }
                      </p>
                      
                      <div className="complaint-meta-info">
                        <div className="meta-item">
                          <Icons.Clock />
                          {new Date(complaint.createAt).toLocaleDateString()}
                        </div>
                        {complaint.priority && (
                          <span className={`priority-badge ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="complaint-card-actions">
                      <button 
                        className="view-btn"
                        onClick={() => handleViewDetail(complaint)}
                      >
                        <Icons.Eye />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
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
      </div>
    </div>
  );
};

export default ComplaintPage;