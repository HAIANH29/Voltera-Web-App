import React, { useState, useEffect } from "react";
import api from "../../config/api";
import Cookies from "js-cookie";
import "./ContractInfoPreview.css";

export default function ContractInfoPreview({ 
  postId, 
  vehicleData,  // Nhận vehicleData từ vehicleDetail
  onCreateContract,
  onCancel,
  show 
}) {
  const [buyerData, setBuyerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const token = Cookies.get("accessToken");

  useEffect(() => {
    if (show) {
      fetchBuyerData();
    }
  }, [show]);

  const fetchBuyerData = async () => {
    try {
      setLoading(true);
      setError("");

      // Lấy thông tin người mua từ localStorage trước, sau đó từ token
      let currentUser = null;
      
      // 1. Thử lấy từ localStorage (như trong headerAfter)
      try {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
          currentUser = JSON.parse(stored);
        }
      } catch (err) {
        console.error("Error parsing localStorage currentUser:", err);
      }

      // 2. Nếu không có trong localStorage, decode từ token
      if (!currentUser && token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("Token payload:", payload);
          currentUser = {
            name: payload.fullName || payload.name || payload.sub || "Người mua",
            username: payload.sub || payload.username || "Người dùng hiện tại",
            email: payload.email || "Không rõ",
            phone: payload.phone || "Không rõ"
          };
        } catch (tokenError) {
          console.error("Error decoding token:", tokenError);
        }
      }

      // 3. Set buyer data với thông tin đã lấy được
      setBuyerData({
        fullName: currentUser?.name || currentUser?.username || "Người mua",
        username: currentUser?.username || currentUser?.email || "Người dùng hiện tại",
        email: currentUser?.email || "Không rõ",
        phone: currentUser?.phone || "Không rõ"
      });

    } catch (err) {
      console.error("Error fetching buyer data:", err);
      setError(err.message || "Có lỗi xảy ra khi tải thông tin người mua");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAndSign = async () => {
    try {
      setCreating(true);
      setError("");

      console.log("🔄 Creating contract for post:", postId);

      // 1. Create contract
      const contractResponse = await api.post(
        "/api/contract/create",
        { postId: parseInt(postId) }
      );

      console.log("✅ Contract created:", contractResponse.data);

      if (contractResponse.data?.contractId) {
        // 2. Auto-sign contract as buyer
        console.log("🔄 Auto-signing contract as buyer...");
        
        const signResponse = await api.put(
          `/api/contract/${contractResponse.data.contractId}/sign`
        );

        console.log("✅ Contract signed:", signResponse.data);

        alert("🎉 Hợp đồng đã được tạo và ký thành công! Người bán sẽ nhận được thông báo.");
        
        // Call parent callback if provided
        if (onCreateContract) {
          onCreateContract(contractResponse.data);
        }
      }

    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.response?.data?.message || err.message || "Có lỗi xảy ra khi tạo hợp đồng");
    } finally {
      setCreating(false);
    }
  };

  if (!show) return null;

  // Kiểm tra nếu vehicleData chưa có hoặc đang loading
  if (loading || !vehicleData) {
    return (
      <div className="contract-preview-overlay">
        <div className="contract-preview-modal">
          <div className="contract-preview-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải thông tin hợp đồng...</p>
          </div>
        </div>
      </div>
    );
  }

  // Debug: Log received data
  console.log("🔍 ContractInfoPreview received vehicleData:", vehicleData);
  console.log("🔍 ContractInfoPreview received postId:", postId);

  // Sử dụng vehicleData được truyền từ vehicleDetail
  const vehicle = vehicleData || {};
  
  // Tạo seller data từ vehicleData
  const sellerData = {
    fullName: vehicle.seller?.address ? `Người bán tại ${vehicle.seller.address}` : "Người bán",
    username: `Seller - Post #${vehicle.postID || postId}`,
    email: "Liên hệ qua hệ thống", 
    phone: "Liên hệ qua hệ thống"
  };

  // Debug: Log processed data
  console.log("🔍 Processed vehicle data:", vehicle);
  console.log("🔍 Processed seller data:", sellerData);

  return (
    <div className="contract-preview-overlay" onClick={onCancel}>
      <div className="contract-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="contract-preview-header">
          <h2>📋 Thông tin hợp đồng mua bán xe</h2>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        <div className="contract-preview-content">
          {error && (
            <div className="error-banner">
              <strong>⚠️ Lỗi:</strong> {error}
            </div>
          )}

          <div className="contract-sections">
            {/* Debug Info - Temporary */}
            <div className="contract-section">
              <div className="section-header">
                <h3>🔍 Debug Info (Temporary)</h3>
              </div>
              <div className="section-content">
                <div className="info-row">
                  <span className="label">Raw Vehicle Data:</span>
                  <span className="value" style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                    {JSON.stringify(vehicle)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Vehicle Keys:</span>
                  <span className="value">
                    {Object.keys(vehicle).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="contract-section">
              <div className="section-header">
                <h3>🚗 Thông tin xe</h3>
              </div>
              <div className="section-content">
                <div className="info-row">
                  <span className="label">Tiêu đề:</span>
                  <span className="value">
                    {vehicle.title || 
                     (vehicle.brand && vehicle.model ? 
                      `${vehicle.brand} ${vehicle.model} ${vehicle.version || ''}`.trim() : 
                      "Thông tin xe")}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Hãng xe:</span>
                  <span className="value">{vehicle.brand || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Mẫu xe:</span>
                  <span className="value">{vehicle.model || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phiên bản:</span>
                  <span className="value">{vehicle.version || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Năm sản xuất:</span>
                  <span className="value">{vehicle.year || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Màu sắc:</span>
                  <span className="value">{vehicle.color || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Số km đã đi:</span>
                  <span className="value">{vehicle.odo ? `${vehicle.odo.toLocaleString()} km` : "Xe mới"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Dung lượng pin:</span>
                  <span className="value">{vehicle.batteryCapacity || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phạm vi hoạt động:</span>
                  <span className="value">{vehicle.range || "N/A"}</span>
                </div>
                <div className="info-row price-row">
                  <span className="label">Giá bán:</span>
                  <span className="value price">{vehicle.price ? `${vehicle.price.toLocaleString()} ₫` : "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="contract-section">
              <div className="section-header">
                <h3>👤 Thông tin người bán</h3>
              </div>
              <div className="section-content">
                <div className="info-row">
                  <span className="label">Họ tên:</span>
                  <span className="value">{sellerData?.fullName || sellerData?.username || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{sellerData?.email || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Số điện thoại:</span>
                  <span className="value">{sellerData?.phone || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Địa chỉ:</span>
                  <span className="value">{vehicle.seller?.address || "Không rõ"}</span>
                </div>
              </div>
            </div>

            {/* Buyer Information */}
            <div className="contract-section">
              <div className="section-header">
                <h3>🛒 Thông tin người mua</h3>
              </div>
              <div className="section-content">
                <div className="info-row">
                  <span className="label">Họ tên:</span>
                  <span className="value">{buyerData?.fullName || buyerData?.username || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{buyerData?.email || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Số điện thoại:</span>
                  <span className="value">{buyerData?.phone || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Contract Terms */}
            <div className="contract-section">
              <div className="section-header">
                <h3>📝 Điều khoản hợp đồng</h3>
              </div>
              <div className="section-content">
                <div className="contract-terms">
                  <ul>
                    <li>Hợp đồng có hiệu lực trong vòng 7 ngày kể từ ngày tạo</li>
                    <li>Người mua cam kết thanh toán đúng số tiền đã thỏa thuận</li>
                    <li>Người bán cam kết giao xe đúng tình trạng như mô tả</li>
                    <li>Các bên có thể hủy hợp đồng nếu chưa có chữ ký của cả hai bên</li>
                    <li>Hợp đồng chỉ có hiệu lực khi cả hai bên đã ký</li>
                    <li>Khi tạo hợp đồng, người mua sẽ tự động ký hợp đồng</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contract-preview-footer">
          <button 
            className="btn-cancel" 
            onClick={onCancel}
            disabled={creating}
          >
            Hủy bỏ
          </button>
          <button 
            className="btn-create" 
            onClick={handleCreateAndSign}
            disabled={creating}
          >
            {creating ? (
              <>
                <div className="btn-loading-spinner"></div>
                Đang tạo hợp đồng...
              </>
            ) : (
              <>
                ✍️ Tạo hợp đồng & Ký
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}