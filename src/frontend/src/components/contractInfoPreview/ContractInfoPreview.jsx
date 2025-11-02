import React, { useState, useEffect, useMemo } from "react";
import api from "../../config/api";
import Cookies from "js-cookie";
import "./ContractInfoPreview.css";

// Map and format vehicle data (similar to ContractPage.jsx)
const mapVehicleData = (vehicleData) => {
  const v = vehicleData || {};
  
  return {
    ...v,
    // Format fields with proper fallbacks
    batterycapacity: v.batterycapacity != null ? v.batterycapacity : null,
    batterycapacityDisplay: v.batterycapacity != null ? `${v.batterycapacity} kWh` : "Not specified",
    
    range: v.range != null ? v.range : null,
    rangeDisplay: v.range != null ? `${v.range} km` : "Not specified",
    
    chargingtime: v.chargingtime != null ? v.chargingtime : null,
    chargingtimeDisplay: v.chargingtime != null ? `${v.chargingtime} hours` : "Not specified",
    
    numberofseat: v.numberofseat != null ? v.numberofseat : 5, // default 5 seats
    numberofseatDisplay: v.numberofseat != null ? v.numberofseat : 5,
    
    yearmanufacture: v.yearmanufacture > 0 ? v.yearmanufacture : new Date().getFullYear(),
    
    licenseplate: v.licenseplate || "Not assigned",
    origin: v.origin || "International",
    
    bodyinsurance: v.bodyinsurance != null ? v.bodyinsurance : false,
    vehicleinspection: v.vehicleinspection != null ? v.vehicleinspection : false,
    
    brand: v.brand || "Electric Vehicle",
    model: v.model || "Premium Model", 
    version: v.version || "Standard",
    color: v.color || "Silver",
    style: v.style || "SUV",
  };
};

export default function ContractInfoPreview({
  postId,
  vehicleData, // Optional - nhận vehicleData từ vehicleDetail hoặc fetch từ API
  onCreateContract,
  onCancel,
  show,
}) {
  const [buyerData, setBuyerData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const token = Cookies.get("accessToken");

  // Function để lấy thông tin buyer từ token
  const getBuyerInfo = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        const payload = tokenPayload.payload || tokenPayload;

        return {
          fullName:
            payload.fullName ||
            payload.name ||
            currentUser?.fullName ||
            "Buyer",
          username:
            payload.username ||
            payload.sub ||
            currentUser?.username ||
            "Current User",
          email: payload.email || currentUser?.email || "Unknown",
          phone: payload.phone || "Không rõ",
        };
      } catch (tokenError) {
        console.error("Error decoding token:", tokenError);
      }
    }

    return {
      fullName:
        currentUser?.fullName ||
        currentUser?.name ||
        currentUser?.username ||
        "Buyer",
      username: currentUser?.username || currentUser?.email || "Current User",
      email: currentUser?.email || "Unknown",
      phone: currentUser?.phone || "Không rõ",
    };
  };

  // Preload buyer data ngay khi component mount
  useEffect(() => {
    if (token) {
      const currentUser = getBuyerInfo();
      setBuyerData(currentUser);
    }
  }, [token]);

  useEffect(() => {
    if (show) {
      // Tối ưu: Nếu có vehicleData thì load ngay lập tức
      if (vehicleData) {
        setLoading(false);
        const currentUser = getBuyerInfo();
        setBuyerData(currentUser);

        // Map vehicle data when using passed vehicleData
        const vehicleForMapping = {
          brand: vehicleData.brand,
          model: vehicleData.model,
          version: vehicleData.version,
          yearmanufacture: vehicleData.yearmanufacture,
          color: vehicleData.color,
          odo: vehicleData.odo,
          batterycapacity: vehicleData.batteryCapacityRaw,
          range: vehicleData.rangeRaw,
          numberofseat: vehicleData.numberOfSeat,
        };

        const mappedVehicle = mapVehicleData(vehicleForMapping);
        const finalData = {
          postId: vehicleData.postID,
          title: vehicleData.title,
          price: vehicleData.price,
          vehicle: mappedVehicle,
          location: vehicleData.seller?.address,
          user: {
            fullName: "Seller",
            username: "seller",
            email: "seller@example.com",
            phone: "Contact through system",
          },
        };

        setPostData(finalData);
        console.log("✅ ContractInfoPreview using vehicleData:");
        console.log("- Original vehicleData:", vehicleData);
        console.log("- Mapped vehicle:", mappedVehicle);
        console.log("- Final postData:", finalData);
      } else {
        fetchAllData();
      }
    }
  }, [show, postId, vehicleData]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      // Chỉ fetch từ API nếu không có vehicleData
      if (postId) {
        console.log("🔄 Fetching post data for postID:", postId);

        // Thêm timeout để tránh load quá lâu
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        try {
          const postResponse = await api.get(`/api/post/detail/${postId}`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          // Map vehicle data with proper formatting
          const rawData = postResponse.data;
          const mappedData = {
            ...rawData,
            vehicle: rawData.vehicle ? mapVehicleData(rawData.vehicle) : null
          };

          setPostData(mappedData);
          console.log("✅ Post data loaded:", rawData);
          console.log("✅ Mapped post data:", mappedData);
          console.log("🔍 Vehicle mapping comparison:");
          console.log("- Raw vehicle:", rawData.vehicle);
          console.log("- Mapped vehicle:", mappedData.vehicle);

          // Get buyer information from token
          const currentUser = getBuyerInfo();
          setBuyerData(currentUser);
        } catch (apiError) {
          clearTimeout(timeoutId);
          if (apiError.name === "AbortError") {
            throw new Error(
              "Loading information takes too long, please try again"
            );
          }
          throw apiError;
        }
      } else {
        throw new Error("No post information available to load");
      }
    } catch (err) {
      console.error("❌ Error fetching contract data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while loading information"
      );
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
      const contractResponse = await api.post("/api/contract/create", {
        postId: parseInt(postId),
      });

      console.log("✅ Contract created:", contractResponse.data);

      if (contractResponse.data?.contractId) {
        // 2. Auto-sign contract as buyer
        console.log("🔄 Auto-signing contract as buyer...");

        const signResponse = await api.put(
          `/api/contract/${contractResponse.data.contractId}/sign`
        );

        console.log("✅ Contract signed:", signResponse.data);

        alert(
          "🎉 Contract has been created and signed successfully! The seller will be notified."
        );

        // Call parent callback if provided
        if (onCreateContract) {
          onCreateContract(contractResponse.data);
        }
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while creating the contract"
      );
    } finally {
      setCreating(false);
    }
  };

  if (!show) return null;

  // Only show loading when there's no vehicle data or buyer info
  if (loading && (!vehicleData || !buyerData)) {
    return (
      <div className="contract-preview-overlay">
        <div className="contract-preview-modal">
          <div className="contract-preview-loading">
            <div
              className="loading-spinner"
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f4f6",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <p style={{ marginTop: "16px", color: "#6b7280" }}>
              {buyerData
                ? "Loading vehicle information..."
                : vehicleData
                ? "Preparing information..."
                : "Initializing contract..."}
            </p>
            <div
              style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}
            >
              Please wait a moment
            </div>
          </div>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Sử dụng postData đã fetch
  const vehicle = postData.vehicle || {};

  // Create seller data from postData
  const sellerData = {
    fullName:
      postData.user?.fullName || `Seller in ${postData.location || "Unknown"}`,
    username: postData.user?.username || `Seller - Post #${postId}`,
    email: postData.user?.email || "Contact through system",
    phone: postData.user?.phone || "Contact through system",
    address: postData.location || "Không rõ địa chỉ",
  };

  return (
    <div className="contract-preview-overlay" onClick={onCancel}>
      <div
        className="contract-preview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="contract-preview-header">
          <h2>📋 Vehicle Purchase Contract Information</h2>
          <button className="modal-close" onClick={onCancel}>
            ✕
          </button>
        </div>

        <div className="contract-preview-content">
          {error && (
            <div className="error-banner">
              <strong>⚠️ Lỗi:</strong> {error}
            </div>
          )}

          <div className="contract-sections">
            {/* Vehicle Information */}
            <div className="contract-section">
              <div className="section-header">
                <h3>🚗 Vehicle Information</h3>
              </div>
              <div className="section-content">
                <div className="info-row">
                  <span className="label">Tiêu đề:</span>
                  <span className="value">
                    {postData.title ||
                      (vehicle.brand && vehicle.model
                        ? `${vehicle.brand} ${vehicle.model} ${
                            vehicle.version || ""
                          }`.trim()
                        : "Thông tin xe")}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Brand:</span>
                  <span className="value">{vehicle.brand}</span>
                </div>
                <div className="info-row">
                  <span className="label">Mẫu xe:</span>
                  <span className="value">{vehicle.model}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phiên bản:</span>
                  <span className="value">{vehicle.version}</span>
                </div>
                <div className="info-row">
                  <span className="label">Year:</span>
                  <span className="value">{vehicle.yearmanufacture}</span>
                </div>
                <div className="info-row">
                  <span className="label">Màu sắc:</span>
                  <span className="value">{vehicle.color}</span>
                </div>
                <div className="info-row">
                  <span className="label">Mileage:</span>
                  <span className="value">
                    {vehicle.odo
                      ? `${Number(vehicle.odo).toLocaleString()} km`
                      : "New vehicle"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Dung lượng pin:</span>
                  <span className="value">{vehicle.batterycapacityDisplay}</span>
                </div>
                <div className="info-row">
                  <span className="label">Range:</span>
                  <span className="value">{vehicle.rangeDisplay}</span>
                </div>
                <div className="info-row">
                  <span className="label">Thời gian sạc:</span>
                  <span className="value">{vehicle.chargingtimeDisplay}</span>
                </div>
                <div className="info-row">
                  <span className="label">Số ghế:</span>
                  <span className="value">{vehicle.numberofseatDisplay}</span>
                </div>
                <div className="info-row">
                  <span className="label">Seats:</span>
                  <span className="value">{vehicle.numberofseat || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Địa điểm:</span>
                  <span className="value">{postData.location || "N/A"}</span>
                </div>
                <div className="info-row price-row">
                  <span className="label">Price:</span>
                  <span className="value price">
                    {postData.price
                      ? `${Number(postData.price).toLocaleString()} ₫`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="contract-section">
              <div className="section-header">
                <h3>👤 Seller Information</h3>
              </div>
              <div className="section-content">
                <div className="info-row">
                  <span className="label">Full Name:</span>
                  <span className="value">
                    {sellerData?.fullName || sellerData?.username || "N/A"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{sellerData?.email || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone Number:</span>
                  <span className="value">{sellerData?.phone || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Địa chỉ:</span>
                  <span className="value">{sellerData.address}</span>
                </div>
              </div>
            </div>

            {/* Buyer Information */}
            <div className="contract-section">
              <div className="section-header">
                <h3>🛒 Buyer Information</h3>
              </div>
              <div className="section-content">
                <div className="info-row">
                  <span className="label">Full Name:</span>
                  <span className="value">
                    {buyerData?.fullName || buyerData?.username || "N/A"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{buyerData?.email || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone Number:</span>
                  <span className="value">{buyerData?.phone || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Contract Terms */}
            <div className="contract-section">
              <div className="section-header">
                <h3>📝 Contract Terms</h3>
              </div>
              <div className="section-content">
                <div className="contract-terms">
                  <ul>
                    <li>
                      Contract is valid for 7 days from the date of creation
                    </li>
                    <li>Buyer commits to pay the agreed amount</li>
                    <li>
                      Seller commits to deliver the vehicle in the condition as
                      described
                    </li>
                    <li>
                      Both parties can cancel the contract if both parties have
                      not signed
                    </li>
                    <li>
                      Contract is only valid when both parties have signed
                    </li>
                    <li>
                      When creating a contract, the buyer will automatically
                      sign the contract
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contract-preview-footer">
          <button className="btn-cancel" onClick={onCancel} disabled={creating}>
            Cancel
          </button>
          <button
            className="btn-create"
            onClick={handleCreateAndSign}
            disabled={creating}
          >
            {creating ? (
              <>
                <div className="btn-loading-spinner"></div>
                Creating contract...
              </>
            ) : (
              <>✍️ Create Contract & Sign</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
