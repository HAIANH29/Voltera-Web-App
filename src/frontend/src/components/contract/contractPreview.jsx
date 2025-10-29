import React, { useState, useEffect } from "react";
import api from "../../config/api";
import Cookies from "js-cookie";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import ContractInfoPreview from "../contractInfoPreview/ContractInfoPreview";
import "./contractPreview.css";

export default function ContractPreview({ postId, contractId }) {
  const [loading, setLoading] = useState(false);
  const [contractData, setContractData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Lấy token từ cookies như trong headerAfter
  const token = Cookies.get("accessToken");

  // Fetch contract data để preview
  useEffect(() => {
    if (contractId) {
      fetchContractData();
    }
    if (postId) {
      fetchPostData();
    }
  }, [contractId, postId]);

  const fetchContractData = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/contract/${contractId}`
      );
      setContractData(res.data);
    } catch (err) {
      console.error("Error fetching contract:", err);
      alert("Không thể tải thông tin hợp đồng.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPostData = async () => {
    try {
      const res = await api.get(`/api/post/detail/${postId}`);
      setPostData(res.data);
    } catch (err) {
      console.error("Error fetching post data:", err);
    }
  };

  // Show contract preview modal
  const showContractPreview = () => {
    setShowPreview(true);
  };

  // Handle contract creation from modal (called after user confirms)
  const handleContractCreated = (newContractData) => {
    setContractData(newContractData);
    setShowPreview(false);
    // Refresh contract data to get latest info
    if (newContractData.contractId) {
      fetchContractData(newContractData.contractId);
    }
  };

  // Ký hợp đồng
  const signContract = async () => {
    try {
      setIsSigning(true);
      await api.put(
        `/api/contract/${contractData.contractId}/sign`
      );
      
      // Refresh contract data after signing
      await fetchContractData();
      alert("Đã ký hợp đồng thành công!");
    } catch (err) {
      console.error("Error signing contract:", err);
      alert("Không thể ký hợp đồng, vui lòng thử lại.");
    } finally {
      setIsSigning(false);
    }
  };

  // Cancel contract
  const cancelContract = async () => {
    try {
      console.log("🔥 [Cancel] Starting cancel contract...");
      console.log("🔥 [Cancel] Contract ID:", contractData.contractId);
      console.log("🔥 [Cancel] Token:", token ? "Present" : "Missing");
      
      setIsCanceling(true);
      
      const response = await api.put(
        `/api/contract/${contractData.contractId}/cancel`
      );
      
      console.log("✅ [Cancel] Success response:", response.data);
      
      // Refresh contract data after canceling
      await fetchContractData();
      alert("Đã hủy hợp đồng thành công!");
    } catch (err) {
      console.error("❌ [Cancel] Error canceling contract:", err);
      console.error("❌ [Cancel] Error response:", err.response?.data);
      console.error("❌ [Cancel] Error status:", err.response?.status);
      
      // Show specific error message
      const errorMessage = err.response?.data?.message || err.message || "Lỗi không xác định";
      alert(`Không thể hủy hợp đồng: ${errorMessage}`);
    } finally {
      setIsCanceling(false);
    }
  };

  // Download contract as DOCX
  const downloadContract = async () => {
    try {
      if (!contractData) {
        alert("Không có dữ liệu hợp đồng để tải.");
        return;
      }

      // Kiểm tra xem cả hai bên đã ký chưa
      if (!contractData.signedByBuyer || !contractData.signedBySeller) {
        alert("Không thể tải hợp đồng! Cả người mua và người bán phải ký trước khi tải xuống.");
        return;
      }

      setLoading(true);

      // 2️⃣ Lấy template từ public/templates
      const fileRes = await fetch("/templates/contract/VehicleContract.docx");
      
      console.log("📄 Template response status:", fileRes.status);
      console.log("📄 Template response ok:", fileRes.ok);
      
      if (!fileRes.ok) {
        console.error("❌ Template file not found, falling back to text");
        // Fallback: Tạo contract dạng text nếu không có template DOCX
        downloadContractAsText();
        return;
      }

      const buffer = await fileRes.arrayBuffer();
      const zip = new PizZip(buffer);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      // 3️⃣ Chuẩn bị dữ liệu để render - Đơn giản hóa để test
      const vehicle = postData?.vehicle || {};
      const renderData = {
        // Contract info
        contractSigningDate: contractData.signedDate 
          ? new Date(contractData.signedDate).toLocaleDateString("vi-VN")
          : new Date().toLocaleDateString("vi-VN"),
        
        // Seller info  
        sellerName: contractData.sellerName || "Nguyen Van A",
        sellerEmail: "seller@voltera.com",
        
        // Buyer info
        buyerName: contractData.buyerName || "Tran Thi B", 
        buyerEmail: "buyer@voltera.com",
        
        // Vehicle info
        title: contractData.postTitle || postData?.title || "Tesla Model 3",
        batteryCapacity: vehicle.batterycapacity ? `${vehicle.batterycapacity} kWh` : "75 kWh",
        odo: vehicle.odo ? `${vehicle.odo}` : "5000",
        price: postData?.price ? new Intl.NumberFormat('vi-VN').format(postData.price) : "1,500,000,000",
        
        // Current date
        date: new Date().toLocaleDateString("vi-VN"),
      };

      // 4️⃣ Render dữ liệu
      doc.render(renderData);

      // 5️⃣ Xuất file
      const blob = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      console.log("💾 Downloading DOCX file...");
      console.log("📁 Blob size:", blob.size);
      saveAs(blob, `HopDongMuaBanXe_${contractData.contractId}_${new Date().toISOString().split('T')[0]}.docx`);
    } catch (err) {
      console.error("❌ Error downloading DOCX contract:", err);
      console.error("❌ Error details:", err.message);
      console.error("❌ Error stack:", err.stack);
      
      // Show specific error to user
      alert(`Lỗi tạo file DOCX: ${err.message}. Sẽ tạo file text thay thế.`);
      
      // Fallback nếu có lỗi với DOCX
      downloadContractAsText();
    } finally {
      setLoading(false);
    }
  };

  // Fallback: Download contract as text file
  const downloadContractAsText = () => {
    try {
      // Kiểm tra xem cả hai bên đã ký chưa
      if (!contractData.signedByBuyer || !contractData.signedBySeller) {
        alert("Không thể tải hợp đồng! Cả người mua và người bán phải ký trước khi tải xuống.");
        return;
      }

      const vehicle = postData?.vehicle || {};
      
      const contractText = `
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-----------------------------

HỢP ĐỒNG MUA BÁN XE ĐIỆN

Hôm nay, ngày ${contractData.signedDate 
  ? new Date(contractData.signedDate).toLocaleDateString("vi-VN")
  : new Date().toLocaleDateString("vi-VN")}, thông qua hệ thống Voltera, chúng tôi gồm có:

BÊN BÁN (Bên A):
• Họ tên: ${contractData.sellerName || "N/A"}
• Email: seller@example.com
• Chủ sở hữu bài đăng: ${contractData.postTitle || postData?.title || "N/A"}

BÊN MUA (Bên B):
• Họ tên: ${contractData.buyerName || "N/A"}
• Email: buyer@example.com

Cùng nhau thỏa thuận ký kết Hợp đồng mua bán xe điện với các điều khoản sau:

Điều 1. Thông tin xe điện
• Tên xe: ${contractData.postTitle || postData?.title || "N/A"}
• Dung lượng pin: ${vehicle.batterycapacity ? `${vehicle.batterycapacity} kWh` : "N/A"}
• Số km đã đi: ${vehicle.odo || "0"} km
• Giá bán: ${postData?.price ? new Intl.NumberFormat('vi-VN').format(postData.price) : "N/A"} VND

Điều 2. Quyền và nghĩa vụ của Bên bán
1. Bên bán cam kết xe điện thuộc quyền sở hữu hợp pháp, không có tranh chấp, thế chấp, cầm cố.
2. Bên bán có trách nhiệm cung cấp đầy đủ các giấy tờ chứng minh nguồn gốc và tình trạng của xe.
3. Bên bán phải giao xe đúng thời hạn và đúng như mô tả trong bài đăng.

Điều 3. Quyền và nghĩa vụ của Bên mua
1. Bên mua có trách nhiệm thanh toán đầy đủ và đúng thời hạn theo thỏa thuận.
2. Bên mua có trách nhiệm kiểm tra kỹ tình trạng xe trước khi nhận bàn giao.
3. Bên mua chịu toàn bộ trách nhiệm về xe sau khi hoàn tất giao dịch.

Điều 4. Điều khoản chung
1. Hai bên cam kết thực hiện đúng và đầy đủ các điều khoản của hợp đồng này.
2. Hợp đồng này có hiệu lực từ khi hai bên xác nhận và ký trên hệ thống Voltera.
3. Trường hợp có tranh chấp, hai bên sẽ giải quyết bằng thương lượng, nếu không thành sẽ đưa ra cơ quan có thẩm quyền giải quyết.

Hợp đồng số: ${contractData.contractId}
Trạng thái: ${contractData.contractStatus}
Ngày tạo: ${new Date().toLocaleDateString("vi-VN")}

BÊN BÁN (Ký tên): ${contractData.signedBySeller ? "✅ Đã ký" : "❌ Chưa ký"}

BÊN MUA (Ký tên): ${contractData.signedByBuyer ? "✅ Đã ký" : "❌ Chưa ký"}

---
Được tạo bởi hệ thống Voltera
`;

      // Tạo file text và download
      const blob = new Blob([contractText], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `HopDongMuaBanXe_${contractData.contractId}_${new Date().toISOString().split('T')[0]}.txt`);
      
    } catch (err) {
      console.error("Error creating text contract:", err);
      alert("Không thể tạo hợp đồng. Vui lòng thử lại.");
    }
  };

  if (loading && !contractData) {
    return (
      <div className="contract-preview">
        <div className="contract-header">
          <h2>Đang tải thông tin hợp đồng...</h2>
        </div>
        <div className="contract-loading">
          <div className="contract-skeleton">
            <div className="contract-skeleton-line"></div>
            <div className="contract-skeleton-line medium"></div>
            <div className="contract-skeleton-line short"></div>
            <div className="contract-skeleton-line"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contract-preview">
      <div className="contract-header">
        <h2>Thông tin hợp đồng</h2>
      </div>

      <div className="contract-content">
        {/* Contract Preview */}
        {contractData ? (
          <>
            <div className="contract-details">
              <h3>Chi tiết hợp đồng</h3>
              <div className="contract-info-grid">
                <div className="contract-info-section">
                  <div className="contract-info-item">
                    <span className="contract-info-label">ID Hợp đồng</span>
                    <span className="contract-info-value">#{contractData.contractId}</span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Người bán</span>
                    <span className="contract-info-value">{contractData.sellerName}</span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Người mua</span>
                    <span className="contract-info-value">{contractData.buyerName}</span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Bài đăng</span>
                    <span className="contract-info-value">{contractData.postTitle}</span>
                  </div>
                  {postData && (
                    <>
                      <div className="contract-info-item">
                        <span className="contract-info-label">Giá xe</span>
                        <span className="contract-info-value">
                          {postData.price ? new Intl.NumberFormat('vi-VN').format(postData.price) + ' VND' : 'N/A'}
                        </span>
                      </div>
                      {postData.vehicle && (
                        <>
                          <div className="contract-info-item">
                            <span className="contract-info-label">Dung lượng pin</span>
                            <span className="contract-info-value">
                              {postData.vehicle.batterycapacity ? `${postData.vehicle.batterycapacity} kWh` : 'N/A'}
                            </span>
                          </div>
                          <div className="contract-info-item">
                            <span className="contract-info-label">Số km đã đi</span>
                            <span className="contract-info-value">{postData.vehicle.odo || 0} km</span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
                <div className="contract-info-section">
                  <div className="contract-info-item">
                    <span className="contract-info-label">Trạng thái</span>
                    <span className={`contract-status-badge ${contractData.contractStatus.toLowerCase()}`}>
                      {contractData.contractStatus}
                    </span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Người mua đã ký</span>
                    <span className={`contract-sign-status ${contractData.signedByBuyer ? 'signed' : 'unsigned'}`}>
                      {contractData.signedByBuyer ? "✅ Đã ký" : "❌ Chưa ký"}
                    </span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Người bán đã ký</span>
                    <span className={`contract-sign-status ${contractData.signedBySeller ? 'signed' : 'unsigned'}`}>
                      {contractData.signedBySeller ? "✅ Đã ký" : "❌ Chưa ký"}
                    </span>
                  </div>
                  {contractData.signedDate && (
                    <div className="contract-info-item">
                      <span className="contract-info-label">Ngày ký</span>
                      <span className="contract-info-value">
                        {new Date(contractData.signedDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {contractData.terms && (
                <div className="contract-terms">
                  <h4>Điều khoản hợp đồng</h4>
                  <p>{contractData.terms}</p>
                </div>
              )}
            </div>

            {/* Download Status Info */}
            <div className="contract-download-info">
              {contractData.signedByBuyer && contractData.signedBySeller ? (
                <div className="contract-info-card success">
                  <div className="contract-info-icon">🎉</div>
                  <div className="contract-info-text">
                    <strong>Hợp đồng đã hoàn tất!</strong>
                    <p>Cả hai bên đã ký hợp đồng. Bạn có thể tải xuống hợp đồng ngay bây giờ.</p>
                    <div className="contract-progress-status">
                      <span>Trạng thái:</span>
                      <ul>
                        <li className="completed">✅ Người bán đã ký</li>
                        <li className="completed">✅ Người mua đã ký</li>
                        <li className="completed">🔓 Có thể tải xuống</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="contract-info-card">
                  <div className="contract-info-icon">ℹ️</div>
                  <div className="contract-info-text">
                    <strong>Lưu ý về tải hợp đồng:</strong>
                    <p>Chỉ có thể tải xuống hợp đồng khi cả người mua và người bán đều đã ký.</p>
                    <div className="contract-progress-status">
                      <span>Trạng thái hiện tại:</span>
                      <ul>
                        <li className={contractData.signedBySeller ? 'completed' : 'pending'}>
                          {contractData.signedBySeller ? '✅' : '⏳'} Người bán
                        </li>
                        <li className={contractData.signedByBuyer ? 'completed' : 'pending'}>
                          {contractData.signedByBuyer ? '✅' : '⏳'} Người mua
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="contract-actions">
              {/* Sign Contract Button */}
              {contractData.contractStatus === 'PENDING' && !contractData.signedByBuyer && (
                <button
                  onClick={signContract}
                  disabled={isSigning}
                  className="contract-btn primary"
                >
                  {isSigning && <div className="contract-btn-spinner"></div>}
                  {isSigning ? "Đang ký..." : "✍️ Ký hợp đồng"}
                </button>
              )}

              {/* Download Contract Button - Only if both parties signed */}
              {contractData.signedByBuyer && contractData.signedBySeller ? (
                <button
                  onClick={downloadContract}
                  disabled={loading}
                  className="contract-btn secondary"
                >
                  {loading && <div className="contract-btn-spinner"></div>}
                  {loading ? "Đang tải..." : "📄 Tải hợp đồng"}
                </button>
              ) : (
                <button
                  disabled={true}
                  className="contract-btn outline"
                  title="Chỉ có thể tải hợp đồng khi cả hai bên đã ký"
                >
                  🔒 Tải hợp đồng (Chờ ký)
                </button>
              )}

              {/* Cancel Contract Button */}
              {contractData.contractStatus === 'PENDING' && (
                <button
                  onClick={() => {
                    if (window.confirm("Bạn có chắc muốn hủy hợp đồng này? Thao tác này không thể hoàn tác.")) {
                      console.log("✅ [Confirm] User confirmed cancel");
                      cancelContract();
                    } else {
                      console.log("❌ [Confirm] User cancelled");
                    }
                  }}
                  disabled={isCanceling}
                  className="contract-btn danger"
                >
                  {isCanceling && <div className="contract-btn-spinner"></div>}
                  {isCanceling ? "Đang hủy..." : "❌ Hủy hợp đồng"}
                </button>
              )}
            </div>
          </>
        ) : (
          // Create New Contract
          <div className="contract-create-new">
            <div className="contract-create-icon">📝</div>
            <p>Chưa có hợp đồng cho bài đăng này.</p>
            <button
              onClick={showContractPreview}
              disabled={isCreating}
              className="contract-btn primary"
            >
              📋 Xem trước & Tạo hợp đồng
            </button>
          </div>
        )}
      </div>

      {/* Contract Info Preview Modal */}
      <ContractInfoPreview
        postId={postId}
        vehicleData={postData ? {
          postID: String(postData.postId || ""),
          title: postData.title || "",
          brand: postData.vehicle?.brand || "",
          model: postData.vehicle?.model || "",
          version: postData.vehicle?.version || "",
          year: postData.vehicle?.yearManufacture || "",
          color: postData.vehicle?.color || "",
          odo: postData.vehicle?.odo || 0,
          batteryCapacity: postData.vehicle?.batterycapacity ? `${postData.vehicle.batterycapacity} kWh` : "",
          range: postData.vehicle?.range ? `${postData.vehicle.range} km` : "",
          price: postData.price || 0,
          seller: {
            address: postData.location || ""
          }
        } : null}
        show={showPreview}
        onCreateContract={handleContractCreated}
        onCancel={() => setShowPreview(false)}
      />
    </div>
  );
}
