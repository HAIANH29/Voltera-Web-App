import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../config/api";
import ContractPreview from "../../components/contract/contractPreview";
import "./ContractPage.css";

// Icon SVGs (tương tự dashboardAdmin)
const ContractIcon = () => (
  <svg
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="4" y="4" width="16" height="16" rx="4" strokeWidth="2" />
    <path d="M8 8h8M8 12h8M8 16h4" strokeWidth="2" />
  </svg>
);

export default function ContractPage() {
  const [searchParams] = useSearchParams();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  // Contract viewing/creation states
  const postId = searchParams.get("postId");
  const action = searchParams.get("action");
  const contractId = searchParams.get("contractId");
  const [viewingContract, setViewingContract] = useState(null);
  const [showContractPreview, setShowContractPreview] = useState(false);
  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [loadingVehicle, setLoadingVehicle] = useState(false);

  // Fetch contract list
  const fetchContracts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/contract/list");
      setContracts(res.data);
      console.log("✅ Contracts loaded:", res.data);
      console.log("🔍 First contract structure:", res.data[0]);
    } catch (err) {
      console.error("❌ Error loading contracts:", err);
      setError(err.response?.data?.message || "Failed to load contracts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    // Nếu có contractId trong URL, hiển thị contract detail
    if (contractId) {
      setViewingContract(contractId);
    }
    // Nếu có postId và action=create, hiển thị contract creation
    if (postId && action === "create") {
      setShowContractPreview(true);
    }
  }, [contractId, postId, action]);



  // Sign contract
  const handleSign = async (id) => {
    setActionLoading(true);
    setError("");
    try {
      await api.put(`/api/contract/${id}/sign`);
      fetchContracts();
    } catch (err) {
      console.error("❌ Error signing contract:", err);
      setError(err.response?.data?.message || "Failed to sign contract");
    }
    setActionLoading(false);
  };

  // Cancel contract
  const handleCancel = async (id) => {
    setActionLoading(true);
    setError("");
    try {
      await api.put(`/api/contract/${id}/cancel`);
      fetchContracts();
    } catch (err) {
      console.error("❌ Error cancelling contract:", err);
      setError(err.response?.data?.message || "Failed to cancel contract");
    }
    setActionLoading(false);
  };

  // Handle viewing contract detail
  const handleViewContract = async (contractId) => {
    console.log("🔍 Viewing contract:", contractId);
    console.log("🔍 Available contracts:", contracts);
    
    setViewingContract(contractId);
    
    // Tìm contract để lấy postId
    const contract = contracts.find(c => c.contractId === contractId);
    console.log("🔍 Found contract:", contract);
    
    if (contract && contract.postId) {
      console.log("🔍 Fetching vehicle for postId:", contract.postId);
      await fetchVehicleDetail(contract.postId);
    } else {
      console.warn("❌ Contract not found or missing postId");
    }
  };

  // Map and format vehicle data (similar to vehicleDetail.jsx)
  const mapVehicleData = (postData) => {
    const v = postData?.vehicle || {};
    
    return {
      ...postData,
      vehicle: {
        ...v,
        // Format fields with proper fallbacks
        batterycapacity: v?.batterycapacity != null ? v.batterycapacity : null,
        batterycapacityDisplay: v?.batterycapacity != null ? `${v.batterycapacity} kWh` : "Not specified",
        
        range: v?.range != null ? v.range : null,
        rangeDisplay: v?.range != null ? `${v.range} km` : "Not specified",
        
        chargingtime: v?.chargingtime != null ? v.chargingtime : null,
        chargingtimeDisplay: v?.chargingtime != null ? `${v.chargingtime} hours` : "Not specified",
        
        numberofseat: v?.numberofseat != null ? v.numberofseat : 5, // default 5 seats
        numberofseatDisplay: v?.numberofseat != null ? v.numberofseat : 5,
        
        yearmanufacture: v?.yearmanufacture > 0 ? v.yearmanufacture : new Date().getFullYear(),
        
        licenseplate: v?.licenseplate || "Not assigned",
        origin: v?.origin || "International",
        
        bodyinsurance: v?.bodyinsurance != null ? v.bodyinsurance : false,
        vehicleinspection: v?.vehicleinspection != null ? v.vehicleinspection : false,
      }
    };
  };

  // Fetch vehicle detail from post
  const fetchVehicleDetail = async (postId) => {
    setLoadingVehicle(true);
    try {
      const response = await api.get(`/api/post/detail/${postId}`);
      const mappedData = mapVehicleData(response.data);
      setVehicleDetail(mappedData);
      console.log("✅ Vehicle detail loaded:", response.data);
      console.log("✅ Mapped vehicle data:", mappedData);
      console.log("🔍 Vehicle data:", response.data.vehicle);
      console.log("🔍 Image URLs:", response.data.imageUrls);
      
      // Debug individual fields (using actual backend field names)
      const vehicle = response.data.vehicle;
      if (vehicle) {
        console.log("🔍 DEBUG Vehicle Fields (Backend Format):");
        console.log("- brand:", vehicle.brand, typeof vehicle.brand);
        console.log("- model:", vehicle.model, typeof vehicle.model);
        console.log("- version:", vehicle.version, typeof vehicle.version);
        console.log("- yearmanufacture:", vehicle.yearmanufacture, typeof vehicle.yearmanufacture);
        console.log("- color:", vehicle.color, typeof vehicle.color);
        console.log("- odo:", vehicle.odo, typeof vehicle.odo);
        console.log("- batterycapacity:", vehicle.batterycapacity, typeof vehicle.batterycapacity);
        console.log("- range:", vehicle.range, typeof vehicle.range);
        console.log("- chargingtime:", vehicle.chargingtime, typeof vehicle.chargingtime);
        console.log("- numberofseat:", vehicle.numberofseat, typeof vehicle.numberofseat);
        console.log("- style:", vehicle.style, typeof vehicle.style);
        console.log("- origin:", vehicle.origin, typeof vehicle.origin);
        console.log("- licenseplate:", vehicle.licenseplate, typeof vehicle.licenseplate);
        console.log("- bodyinsurance:", vehicle.bodyinsurance, typeof vehicle.bodyinsurance);
        console.log("- vehicleinspection:", vehicle.vehicleinspection, typeof vehicle.vehicleinspection);
      }
    } catch (error) {
      console.error("❌ Error loading vehicle detail:", error);
      setVehicleDetail(null);
    }
    setLoadingVehicle(false);
  };

  // Handle contract created from preview modal
  const handleContractCreated = (newContractData) => {
    console.log("✅ Contract created:", newContractData);
    setShowContractPreview(false);
    fetchContracts();
    alert(
      `🎉 Contract #${newContractData.contractId} has been created and signed successfully!`
    );
  };

  return (
    <div className="contract-page">
      <div className="contract-header-section">
        <div className="header-content">
          <div className="header-left">
            <ContractIcon />
            <div className="header-text">
              <h1>Contract Management</h1>
              <p>View and manage all your purchase contracts</p>
            </div>
          </div>
          <div className="header-actions">
            {postId && (
              <button className="btn btn-primary" onClick={() => setShowContractPreview(true)}>
                📋 Create Contract for Post #{postId}
              </button>
            )}
            {viewingContract && (
              <button className="btn btn-secondary" onClick={() => setViewingContract(null)}>
                ⬅️ Back to Contract List
              </button>
            )}
            <button
              className="btn btn-refresh"
              onClick={fetchContracts}
              disabled={loading}
            >
              🔄 {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {!viewingContract && (
        <div className="contracts-container">
          <div className="contracts-header">
            <h3>Your Contracts ({contracts.length})</h3>
          </div>
          <div className="contracts-content">
          {error && (
            <div
              style={{
                color: "red",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "6px",
              }}
            >
              ❌ {error}
            </div>
          )}
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <div className="loading-text">Loading...</div>
            </div>
          ) : contracts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <div className="empty-title">No contracts found</div>
              <div className="empty-text">
                You have not created or received any purchase contracts.
              </div>
            </div>
          ) : (
            <div className="contracts-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>POST TITLE</th>
                    <th>BUYER</th>
                    <th>SELLER</th>
                    <th>STATUS</th>
                    <th>SIGNED STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.contractId}>
                      <td>#{contract.contractId}</td>
                      <td>{contract.postTitle || "N/A"}</td>
                      <td>{contract.buyerName || "N/A"}</td>
                      <td>{contract.sellerName || "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${
                            contract.contractStatus === "SIGNED"
                              ? "success"
                              : contract.contractStatus === "CANCELLED" ||
                                contract.contractStatus === "CANCEL"
                              ? "danger"
                              : "secondary"
                          }`}
                        >
                          {contract.contractStatus}
                        </span>
                      </td>
                      <td className="signed-status">
                        <div>BUYER: {contract.signedByBuyer ? "✅" : "❌"} SELLER: {contract.signedBySeller ? "✅" : "❌"}</div>
                      </td>
                      <td className="action-buttons">
                        {contract.contractStatus === "PENDING" && (
                          <>
                            <button
                              className="btn btn-sign"
                              disabled={actionLoading}
                              onClick={() => handleSign(contract.contractId)}
                            >
                              SIGN
                            </button>
                            <button
                              className="btn btn-cancel"
                              disabled={actionLoading}
                              onClick={() => handleCancel(contract.contractId)}
                            >
                              CANCEL
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-view"
                          onClick={() => handleViewContract(contract.contractId)}
                        >
                          VIEW
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </div>
      )}

      {/* Contract Detail View */}
      {viewingContract && (
        <div className="contract-detail-section">
          <ContractPreview
            contractId={viewingContract}
            onClose={() => {
              setViewingContract(null);
              setVehicleDetail(null);
            }}
          />
          
          {/* Vehicle Information Section */}
          <div className="vehicle-info-section">
            <div className="vehicle-info-header">
              <h3>🚗 Vehicle Information</h3>
              <p style={{fontSize: "12px", color: "#666"}}>
                Debug: vehicleDetail = {vehicleDetail ? "EXISTS" : "NULL"}, 
                Loading = {loadingVehicle ? "YES" : "NO"}
              </p>
              {vehicleDetail && (
                <div style={{fontSize: "10px", color: "#999", background: "#f5f5f5", padding: "8px", borderRadius: "4px", marginTop: "8px"}}>
                  <strong>Raw Vehicle Object Keys:</strong> {Object.keys(vehicleDetail.vehicle || {}).join(", ")}
                  <br />
                  <strong>Vehicle Object:</strong> {JSON.stringify(vehicleDetail.vehicle, null, 2)}
                </div>
              )}
            </div>
            <div className="vehicle-info-content">
              {loadingVehicle ? (
                <div className="loading-state">
                  <div className="loading-spinner" />
                  <div className="loading-text">Loading vehicle details...</div>
                </div>
              ) : vehicleDetail ? (
                <div className="vehicle-details-grid">
                  <div className="vehicle-basic-info">
                    <h4>Basic Information</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Title:</span>
                        <span className="value">{vehicleDetail.title || "N/A"}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Price:</span>
                        <span className="value">
                          ${vehicleDetail.price?.toLocaleString() || "Contact for price"}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="label">Location:</span>
                        <span className="value">{vehicleDetail.location || "N/A"}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Status:</span>
                        <span className="value">{vehicleDetail.status || "Available"}</span>
                      </div>
                    </div>
                    
                    {vehicleDetail.description && (
                      <div className="vehicle-description">
                        <h5>Description</h5>
                        <p>{vehicleDetail.description}</p>
                      </div>
                    )}
                  </div>
                  
                  {vehicleDetail.vehicle && (
                    <div className="vehicle-specs-info">
                      <h4>Vehicle Specifications</h4>
                      <div className="specs-grid">
                        <div className="spec-item">
                          <span className="label">Brand:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.brand || "N/A"} 
                            <span style={{fontSize: "10px", color: "#999"}}>
                              ({typeof vehicleDetail.vehicle.brand}: {JSON.stringify(vehicleDetail.vehicle.brand)})
                            </span>
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Model:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.model || "N/A"}
                            <span style={{fontSize: "10px", color: "#999"}}>
                              ({typeof vehicleDetail.vehicle.model}: {JSON.stringify(vehicleDetail.vehicle.model)})
                            </span>
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Version:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.version || "N/A"}
                            <span style={{fontSize: "10px", color: "#999"}}>
                              ({typeof vehicleDetail.vehicle.version}: {JSON.stringify(vehicleDetail.vehicle.version)})
                            </span>
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Year:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.yearmanufacture}
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Color:</span>
                          <span className="value">{vehicleDetail.vehicle.color || "N/A"}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Mileage:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.odo ? 
                              `${vehicleDetail.vehicle.odo.toLocaleString()} km` : 
                              "Brand New (0 km)"}
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Battery Capacity:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.batterycapacityDisplay}
                            <span style={{fontSize: "10px", color: "#999"}}>
                              (Raw: {JSON.stringify(vehicleDetail.vehicle.batterycapacity)})
                            </span>
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Range:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.rangeDisplay}
                            <span style={{fontSize: "10px", color: "#999"}}>
                              (Raw: {JSON.stringify(vehicleDetail.vehicle.range)})
                            </span>
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Charging Time:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.chargingtimeDisplay}
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Number of Seats:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.numberofseatDisplay}
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Style:</span>
                          <span className="value">{vehicleDetail.vehicle.style || "N/A"}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Origin:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.origin}
                            <span style={{fontSize: "10px", color: "#999"}}>
                              (Raw: {JSON.stringify(vehicleDetail.vehicle.origin)})
                            </span>
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="label">License Plate:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.licenseplate}
                            <span style={{fontSize: "10px", color: "#999"}}>
                              (Raw: {JSON.stringify(vehicleDetail.vehicle.licenseplate)})
                            </span>
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Body Insurance:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.bodyinsurance ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Vehicle Inspection:</span>
                          <span className="value">
                            {vehicleDetail.vehicle.vehicleinspection ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vehicle Images */}
                  {vehicleDetail.imageUrls && vehicleDetail.imageUrls.length > 0 && (
                    <div className="vehicle-images-info">
                      <h4>Vehicle Images</h4>
                      <div className="images-grid">
                        {vehicleDetail.imageUrls.map((imageUrl, index) => (
                          <div key={index} className="image-item">
                            <img 
                              src={imageUrl} 
                              alt={`Vehicle ${index + 1}`}
                              onError={(e) => {
                                e.target.src = "/placeholder-car.jpg";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-vehicle-data">
                  <p>No vehicle data available. Contract may not have postId.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
