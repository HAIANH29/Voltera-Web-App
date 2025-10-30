import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Lấy token từ cookies như trong headerAfter
  const token = Cookies.get("accessToken");

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8080/api/contract/list",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContracts(res.data);
    } catch (err) {
      console.error("Error fetching contracts:", err);
      alert("Không thể tải danh sách hợp đồng.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SIGNED':
        return 'bg-green-100 text-green-800';
      case 'CANCEL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewContract = (contractId) => {
    navigate(`/contract?contractId=${contractId}`);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="contract-preview">
      <div className="contract-header">
        <h2>Danh sách hợp đồng</h2>
      </div>

      <div className="contract-content">
        {contracts.length === 0 ? (
          <div className="contract-create-new">
            <div className="contract-create-icon">📋</div>
            <p>Bạn chưa có hợp đồng nào.</p>
          </div>
        ) : (
          <div className="contract-info-cards">
            {contracts.map((contract) => (
              <div key={contract.contractId} className="contract-info-card">
                <div className="contract-info-card-header">
                  <div className="contract-info-card-icon vehicle">
                    📋
                  </div>
                  <div>
                    <h3 className="contract-info-card-title">
                      Hợp đồng #{contract.contractId}
                    </h3>
                    <span className={`contract-status-badge ${contract.contractStatus.toLowerCase()}`}>
                      {contract.contractStatus}
                    </span>
                  </div>
                </div>
                
                <div className="contract-info-card-content">
                  <div className="contract-info-item">
                    <span className="contract-info-label">Bài đăng</span>
                    <span className="contract-info-value">{contract.postTitle}</span>
                  </div>
                  
                  <div className="contract-info-item">
                    <span className="contract-info-label">Người bán</span>
                    <span className="contract-info-value">{contract.sellerName}</span>
                  </div>
                  
                  <div className="contract-info-item">
                    <span className="contract-info-label">Người mua</span>
                    <span className="contract-info-value">{contract.buyerName}</span>
                  </div>
                  
                  <div className="contract-info-item">
                    <span className="contract-info-label">Trạng thái ký</span>
                    <span className="contract-info-value">
                      <div className="contract-sign-status">
                        <span className={contract.signedByBuyer ? 'signed' : 'unsigned'}>
                          Mua: {contract.signedByBuyer ? "✅" : "❌"}
                        </span>
                        <span className={contract.signedBySeller ? 'signed' : 'unsigned'}>
                          Bán: {contract.signedBySeller ? "✅" : "❌"}
                        </span>
                      </div>
                    </span>
                  </div>
                  
                  {contract.signedDate && (
                    <div className="contract-info-item">
                      <span className="contract-info-label">Ngày ký</span>
                      <span className="contract-info-value">
                        {new Date(contract.signedDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="contract-actions">
                  <button
                    onClick={() => handleViewContract(contract.contractId)}
                    className="contract-btn secondary"
                  >
                    👁️ Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}