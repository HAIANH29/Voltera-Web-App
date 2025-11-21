import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../config/api";
import ContractPreview from "../../components/contract/contractPreview";
import ContractInfoPreview from "../../components/contractInfoPreview/ContractInfoPreview";
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
  const contractType = searchParams.get("type"); // "vehicle" or "battery"
  const contractId = searchParams.get("contractId");
  const [viewingContract, setViewingContract] = useState(null);
  const [showContractPreview, setShowContractPreview] = useState(false);
  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [batteryDetail, setBatteryDetail] = useState(null);
  const [loadingVehicle, setLoadingVehicle] = useState(false);

  // Fetch contract list
  const fetchContracts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/contract/list");
      setContracts(res.data);
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
    // Clear previous states first
    setVehicleDetail(null);
    setBatteryDetail(null);
    console.log("🔄 Cleared previous contract states, viewing contract:", contractId);
    
    setViewingContract(contractId);
    
    // Tìm contract để lấy postId
    const contract = contracts.find(c => c.contractId === contractId);
    console.log("📋 Found contract:", contract);
    
    if (contract && contract.postId) {
      // Check if contract is for battery or vehicle based on post data
      try {
        console.log("🔍 Fetching post detail for postId:", contract.postId);
        const response = await api.get(`/api/post/detail/${contract.postId}`);
        console.log("📄 Post data received:", response.data);
        
        if (response.data.battery) {
          console.log("🔋 Detected battery contract, fetching battery detail");
          await fetchBatteryDetail(contract.postId);
        } else if (response.data.vehicle) {
          console.log("🚗 Detected vehicle contract, fetching vehicle detail");
          await fetchVehicleDetail(contract.postId);
        } else {
          console.log("❓ Unknown contract type, defaulting to vehicle");
          await fetchVehicleDetail(contract.postId);
        }
      } catch (error) {
        console.error("❌ Error determining contract type:", error);
        // Fallback to vehicle for backward compatibility
        await fetchVehicleDetail(contract.postId);
      }
    }
  };

  // Map and format vehicle data (similar to vehicleDetail.jsx)
  const mapVehicleData = (postData) => {
    const v = postData?.vehicle || {};
    
    // Handle both camelCase (from API) and lowercase field names
    const batteryCapacity = v.batteryCapacity ?? v.batterycapacity;
    const chargingTime = v.chargingTime ?? v.chargingtime;
    const numberOfSeat = v.numberOfSeat ?? v.numberofseat;
    const yearManufacture = v.yearManufacture ?? v.yearmanufacture;
    const licensePlate = v.licensePlate ?? v.licenseplate;
    const bodyInsurance = v.bodyInsurance ?? v.bodyinsurance;
    const vehicleInspection = v.vehicleInspection ?? v.vehicleinspection;
    
    return {
      ...postData,
      vehicle: {
        ...v,
        // Format fields with proper fallbacks using both naming conventions
        batterycapacity: batteryCapacity != null ? batteryCapacity : null,
        batterycapacityDisplay: batteryCapacity != null ? `${batteryCapacity} kWh` : "Not specified",
        
        range: v.range != null ? v.range : null,
        rangeDisplay: v.range != null ? `${v.range} km` : "Not specified",
        
        chargingtime: chargingTime != null ? chargingTime : null,
        chargingtimeDisplay: chargingTime != null ? `${chargingTime} hours` : "Not specified",
        
        numberofseat: numberOfSeat != null ? numberOfSeat : 5, // default 5 seats
        numberofseatDisplay: numberOfSeat != null ? numberOfSeat : 5,
        
        yearmanufacture: yearManufacture > 0 ? yearManufacture : new Date().getFullYear(),
        
        licenseplate: licensePlate || "Not assigned",
        origin: v.origin || "International",
        
        bodyinsurance: bodyInsurance != null ? bodyInsurance : false,
        vehicleinspection: vehicleInspection != null ? vehicleInspection : false,
      }
    };
  };

  // Map and format battery data (similar to electricDetail.jsx)
  const mapBatteryData = (postData) => {
    const b = postData?.battery || {};
    
    return {
      ...postData,
      battery: {
        ...b,
        // Format battery fields with proper fallbacks
        serialNumber: b?.serialNumber || "Not assigned",
        originCapacity: b?.originCapacity != null ? b.originCapacity : null,
        originCapacityDisplay: b?.originCapacity != null ? `${b.originCapacity} kWh` : "Not specified",
        
        remainingCapacity: b?.remainingCapacity != null ? b.remainingCapacity : null,
        remainingCapacityDisplay: b?.remainingCapacity != null ? `${b.remainingCapacity} kWh` : "Not specified",
        
        voltage: b?.voltage != null ? b.voltage : null,
        voltageDisplay: b?.voltage != null ? `${b.voltage}V` : "Not specified",
        
        cycleCount: b?.cycleCount != null ? b.cycleCount : 0,
        
        mileageCovered: b?.mileageCovered != null ? b.mileageCovered : 0,
        mileageCoveredDisplay: b?.mileageCovered != null ? `${b.mileageCovered} km` : "New battery",
        
        warranty: b?.warranty || "No warranty information",
        weight: b?.weight != null ? `${b.weight} kg` : "Not specified",
        lifeCycle: b?.lifeCycle != null ? `${b.lifeCycle} cycles` : "Not specified",
        
        batteryType: b?.batteryTypeId?.typename || "Li-ion",
        technical: b?.batteryTypeId?.technical || "",
        description: b?.batteryTypeId?.description || "",
      }
    };
  };

  // Fetch vehicle detail from post
  const fetchVehicleDetail = async (postId) => {
    console.log("🚗 Fetching vehicle detail for postId:", postId);
    // Clear battery detail to avoid cross-contamination
    setBatteryDetail(null);
    setLoadingVehicle(true);
    try {
      const response = await api.get(`/api/post/detail/${postId}`);
      const rawData = response.data;
      const mappedData = mapVehicleData(rawData);
      console.log("✅ ContractPage vehicle data loaded:", {
        rawData: rawData,
        mappedData: mappedData,
        batteryCapacityRaw: rawData?.vehicle?.batteryCapacity,
        batteryCapacityLowercase: rawData?.vehicle?.batterycapacity,
        batteryCapacityDisplay: mappedData?.vehicle?.batterycapacityDisplay,
        chargingTimeRaw: rawData?.vehicle?.chargingTime,
        chargingTimeLowercase: rawData?.vehicle?.chargingtime,
        chargingTimeDisplay: mappedData?.vehicle?.chargingtimeDisplay,
        vehicleKeys: rawData?.vehicle ? Object.keys(rawData.vehicle) : 'no vehicle data'
      });
      console.log("🚗 Setting vehicle detail:", mappedData);
      setVehicleDetail(mappedData);
    } catch (error) {
      console.error("❌ Error loading vehicle detail:", error);
      setVehicleDetail(null);
    }
    setLoadingVehicle(false);
  };

  // Fetch battery detail from post
  const fetchBatteryDetail = async (postId) => {
    console.log("🔋 Fetching battery detail for postId:", postId);
    // Clear vehicle detail to avoid cross-contamination
    setVehicleDetail(null);
    setLoadingVehicle(true); // Reuse the same loading state
    try {
      const response = await api.get(`/api/post/detail/${postId}`);
      const mappedData = mapBatteryData(response.data);
      console.log("🔋 Setting battery detail:", mappedData);
      setBatteryDetail(mappedData);
    } catch (error) {
      console.error("❌ Error loading battery detail:", error);
      setBatteryDetail(null);
    }
    setLoadingVehicle(false);
  };

  // Handle contract created from preview modal
  const handleContractCreated = (newContractData) => {
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
            {viewingContract && (
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  try {
                    setViewingContract(null);
                    setVehicleDetail(null);
                  } catch (error) {
                    console.error("Error going back:", error);
                    window.location.reload();
                  }
                }}
              >
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
        <div className="contract-detail-section" key={`contract-${viewingContract}`}>
          <ContractPreview
            key={`preview-${viewingContract}`}
            contractId={viewingContract}
            onClose={() => {
              try {
                setViewingContract(null);
                setVehicleDetail(null);
                setBatteryDetail(null);
                console.log("🔄 Cleared all contract detail states");
              } catch (error) {
                console.error("Error closing contract preview:", error);
                window.location.reload();
              }
            }}
          />
          
          {/* Vehicle/Battery Information Section */}
          <div className="vehicle-info-section" key={`info-${viewingContract}-${batteryDetail ? 'battery' : 'vehicle'}`}>
            <div className="vehicle-info-header">
              <h3>{batteryDetail ? "🔋 Battery Information" : "🚗 Vehicle Information"}</h3>
            </div>
            <div className="vehicle-info-content">
              {loadingVehicle ? (
                <div className="loading-state">
                  <div className="loading-spinner" />
                  <div className="loading-text">Loading {batteryDetail || contractType === 'battery' ? 'battery' : 'vehicle'} details...</div>
                </div>
              ) : batteryDetail && !vehicleDetail ? (
                <div className="battery-details-grid">
                  <div className="battery-basic-info">
                    <h4>Basic Information</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Title:</span>
                        <span className="value">{batteryDetail.title || "N/A"}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Price:</span>
                        <span className="value">
                          ${batteryDetail.price?.toLocaleString() || "Contact for price"}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="label">Location:</span>
                        <span className="value">{batteryDetail.location || "N/A"}</span>
                      </div>
                    </div>
                    
                    {batteryDetail.description && (
                      <div className="battery-description">
                        <h5>Description</h5>
                        <p>{batteryDetail.description}</p>
                      </div>
                    )}
                  </div>
                  
                  {batteryDetail.battery && (
                    <div className="battery-specs-info">
                      <h4>Battery Specifications</h4>
                      <div className="specs-grid">
                        <div className="spec-item">
                          <span className="label">Battery Type:</span>
                          <span className="value">{batteryDetail.battery.batteryType || "N/A"}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Serial Number:</span>
                          <span className="value">{batteryDetail.battery.serialNumber}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Original Capacity:</span>
                          <span className="value">{batteryDetail.battery.originCapacityDisplay}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Remaining Capacity:</span>
                          <span className="value">{batteryDetail.battery.remainingCapacityDisplay}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Voltage:</span>
                          <span className="value">{batteryDetail.battery.voltageDisplay}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Cycle Count:</span>
                          <span className="value">{batteryDetail.battery.cycleCount}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Mileage Covered:</span>
                          <span className="value">{batteryDetail.battery.mileageCoveredDisplay}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Warranty:</span>
                          <span className="value">{batteryDetail.battery.warranty}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Weight:</span>
                          <span className="value">{batteryDetail.battery.weight}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Life Cycle:</span>
                          <span className="value">{batteryDetail.battery.lifeCycle}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Battery Images */}
                  {batteryDetail.imageUrls && batteryDetail.imageUrls.length > 0 && (
                    <div className="battery-images-info">
                      <h4>Battery Images</h4>
                      <div className="images-grid">
                        {batteryDetail.imageUrls.map((imageUrl, index) => (
                          <div key={index} className="image-item">
                            <img 
                              src={imageUrl} 
                              alt={`Battery ${index + 1}`}
                              onError={(e) => {
                                e.target.src = "/placeholder-battery.jpg";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : vehicleDetail && !batteryDetail ? (
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
                          <span className="value">{vehicleDetail.vehicle.brand || "N/A"}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Model:</span>
                          <span className="value">{vehicleDetail.vehicle.model || "N/A"}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Version:</span>
                          <span className="value">{vehicleDetail.vehicle.version || "N/A"}</span>
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
                          <span className="value">{vehicleDetail.vehicle.batterycapacityDisplay}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">Range:</span>
                          <span className="value">{vehicleDetail.vehicle.rangeDisplay}</span>
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
                          <span className="value">{vehicleDetail.vehicle.origin}</span>
                        </div>
                        <div className="spec-item">
                          <span className="label">License Plate:</span>
                          <span className="value">{vehicleDetail.vehicle.licenseplate}</span>
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
                  <p>
                    {batteryDetail && vehicleDetail 
                      ? "⚠️ Both battery and vehicle data loaded - this indicates a state management issue."
                      : `No ${batteryDetail ? 'battery' : vehicleDetail ? 'vehicle' : 'contract'} data available. Contract may not have postId or data is still loading.`
                    }
                  </p>
                  <div className="debug-info" style={{fontSize: '0.8em', color: '#666', marginTop: '10px'}}>
                    Debug: batteryDetail={batteryDetail ? 'loaded' : 'null'}, vehicleDetail={vehicleDetail ? 'loaded' : 'null'}, contractId={viewingContract}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contract Info Preview Modal */}
      {showContractPreview && postId && (
        <ContractInfoPreview
          postId={postId}
          show={showContractPreview}
          onCreateContract={handleContractCreated}
          onCancel={() => setShowContractPreview(false)}
        />
      )}
    </div>
  );
}
