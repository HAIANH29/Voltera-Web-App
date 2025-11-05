import React from 'react';
import './postInfo.css';

export default function PostInfo({ postData, contractData }) {
  if (!postData) {
    return (
      <div className="post-info-loading">
        <p>No post information available.</p>
      </div>
    );
  }

  // Determine if this is battery or vehicle contract
  const hasBatteryInPost = !!postData?.battery;
  const postType = postData?.type;
  const contractPostTitle = contractData?.postTitle || postData?.title || '';
  const isBatteryByTitle = contractPostTitle.toLowerCase().includes('battery') || 
                           contractPostTitle.toLowerCase().includes('pin') ||
                           contractPostTitle.toLowerCase().includes('electric battery');
  const isBattery = hasBatteryInPost || 
                    postType === 'battery' || 
                    isBatteryByTitle ||
                    (contractData?.contractType && contractData.contractType === 'battery');
  
  console.log("🔍 PostInfo type detection:", {
    hasBatteryInPost, postType, isBatteryByTitle, 
    contractType: contractData?.contractType,
    finalIsBattery: isBattery, contractPostTitle
  });

  return (
    <div className="post-info-section">
      <div className="post-info-item">
        <span className="post-info-label">
          {isBattery ? 'Battery Price' : 'Vehicle Price'}
        </span>
        <span className="post-info-value">
          {postData.price
            ? new Intl.NumberFormat("en-US").format(postData.price) + " USD"
            : "N/A"}
        </span>
      </div>
      
      {/* Battery Information */}
      {isBattery && postData.battery && (
        <>
          <div className="post-info-item">
            <span className="post-info-label">Serial Number</span>
            <span className="post-info-value">
              {postData.battery.serialNumber || "N/A"}
            </span>
          </div>
          <div className="post-info-item">
            <span className="post-info-label">Original Capacity</span>
            <span className="post-info-value">
              {postData.battery.originCapacity 
                ? `${postData.battery.originCapacity} kWh`
                : "N/A"}
            </span>
          </div>
          <div className="post-info-item">
            <span className="post-info-label">Remaining Capacity</span>
            <span className="post-info-value">
              {postData.battery.remainingCapacity 
                ? `${postData.battery.remainingCapacity} kWh`
                : "N/A"}
            </span>
          </div>
          <div className="post-info-item">
            <span className="post-info-label">Voltage</span>
            <span className="post-info-value">
              {postData.battery.voltage 
                ? `${postData.battery.voltage}V`
                : "N/A"}
            </span>
          </div>
          <div className="post-info-item">
            <span className="post-info-label">Cycle Count</span>
            <span className="post-info-value">
              {postData.battery.cycleCount || "0"} cycles
            </span>
          </div>
        </>
      )}
      
      {/* Vehicle Information */}
      {!isBattery && postData.vehicle && (
        <>
          <div className="post-info-item">
            <span className="post-info-label">Brand & Model</span>
            <span className="post-info-value">
              {`${postData.vehicle.brand || ''} ${postData.vehicle.model || ''}`.trim() || "N/A"}
            </span>
          </div>
          <div className="post-info-item">
            <span className="post-info-label">Battery Capacity</span>
            <span className="post-info-value">
              {postData.vehicle.batterycapacity
                ? `${postData.vehicle.batterycapacity} kWh`
                : "N/A"}
            </span>
          </div>
          <div className="post-info-item">
            <span className="post-info-label">Mileage</span>
            <span className="post-info-value">
              {postData.vehicle.odo || 0} km
            </span>
          </div>
          <div className="post-info-item">
            <span className="post-info-label">Year</span>
            <span className="post-info-value">
              {postData.vehicle.yearmanufacture || "N/A"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
