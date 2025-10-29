import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import ContractPreview from "../../components/contract/contractPreview";
import api from "../../config/api";
import Cookies from "js-cookie";
import "./contractPage.css";

export default function ContractPage() {
  const { postId } = useParams();
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('contractId');
  const navigate = useNavigate();
  const [existingContractId, setExistingContractId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lấy token từ cookies như trong headerAfter
  const token = Cookies.get("accessToken");

  // Check if there's already a contract between current user and post owner
  useEffect(() => {
    if (postId && !contractId) {
      checkExistingContract();
    }
  }, [postId, contractId]);

  const checkExistingContract = async () => {
    try {
      setLoading(true);
      // Get all contracts for current user
      const res = await api.get(
        "/api/contract/list"
      );
      
      // Find contract for this specific post (you might need to add postId to ContractResponse)
      // For now, we'll let the user create a new contract or handle this in backend
      console.log("Existing contracts:", res.data);
    } catch (err) {
      console.error("Error checking existing contracts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication
  useEffect(() => {
    if (!token) {
      alert("Vui lòng đăng nhập để truy cập trang này.");
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <div className="contract-page">
      <div className="contract-page-container">
        {/* Breadcrumb */}
        <div className="contract-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="contract-breadcrumb-separator">›</span>
          {postId ? (
            <>
              <Link to="/vehicles">Xe điện</Link>
              <span className="contract-breadcrumb-separator">›</span>
              <Link to={`/vehicles/${postId}`}>Bài đăng #{postId}</Link>
              <span className="contract-breadcrumb-separator">›</span>
              <span>Hợp đồng</span>
            </>
          ) : (
            <>
              <Link to="/contracts">Hợp đồng</Link>
              <span className="contract-breadcrumb-separator">›</span>
              <span>Chi tiết #{contractId}</span>
            </>
          )}
        </div>

        {/* Page Header */}
        <div className="contract-page-header">
          <h1 className="contract-page-title">
            {contractId 
              ? `Hợp đồng #${contractId}` 
              : `Hợp đồng mua xe - Bài đăng #${postId}`
            }
          </h1>
          <p className="contract-page-description">
            {contractId 
              ? "Xem chi tiết và thực hiện các thao tác với hợp đồng mua bán xe điện" 
              : "Tạo và ký hợp đồng mua bán xe điện thông qua hệ thống Voltera"
            }
          </p>
        </div>

        {/* Progress Steps */}
        {!contractId && (
          <div className="contract-progress">
            <h3 className="contract-progress-title">Quy trình tạo hợp đồng</h3>
            <div className="contract-progress-steps">
              <div className="contract-progress-step completed">
                <div className="contract-progress-step-icon">1</div>
                <span className="contract-progress-step-label">Chọn xe</span>
                <div className="contract-progress-line"></div>
              </div>
              <div className="contract-progress-step active">
                <div className="contract-progress-step-icon">2</div>
                <span className="contract-progress-step-label">Tạo hợp đồng</span>
                <div className="contract-progress-line"></div>
              </div>
              <div className="contract-progress-step pending">
                <div className="contract-progress-step-icon">3</div>
                <span className="contract-progress-step-label">Ký hợp đồng</span>
                <div className="contract-progress-line"></div>
              </div>
              <div className="contract-progress-step pending">
                <div className="contract-progress-step-icon">4</div>
                <span className="contract-progress-step-label">Hoàn tất</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="contract-page-content">
          {loading ? (
            <div className="contract-page-loading">
              <div>
                <div className="contract-loading-spinner"></div>
                <div className="contract-loading-text">Đang tải thông tin hợp đồng...</div>
              </div>
            </div>
          ) : (
            <ContractPreview 
              postId={postId ? parseInt(postId) : null} 
              contractId={contractId ? parseInt(contractId) : existingContractId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
