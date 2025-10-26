import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import "./vehicleDetail.css";

/**
 * Map PostResponse từ BE -> format cho detail page
 */
const mapPostToDetail = (p) => {
  const v = p?.vehicle || {};
  
  return {
    postID: String(p?.postId ?? ""),
    brand: v?.brand || "",
    model: v?.model || "",
    version: v?.version || "",
    style: v?.style || "",
    color: v?.color || "",
    numberOfSeat: Number(v?.numberofseat ?? 0),
    odo: Number(v?.odo ?? 0),
    status: Number(v?.odo ?? 0) > 0 ? "old" : "new",
    batteryCapacity: v?.batterycapacity != null ? `${v.batterycapacity} kWh` : "",
    range: v?.range != null ? `${v.range} km` : "",
    chargingTime: v?.chargingtime != null ? `${v.chargingtime}h` : "",
    year: Number(v?.yearmanufacture ?? 0),
    price: Number(p?.price ?? 0),
    title: p?.title || `${v?.brand} ${v?.model} ${v?.version}`,
    description: p?.description || "High-quality electric vehicle with advanced technology.",
    
    // Images
    image: p?.thumbnail || (Array.isArray(p?.imageUrls) && p.imageUrls.length > 0 ? p.imageUrls[0] : ""),
    images: Array.isArray(p?.imageUrls) ? p.imageUrls : (p?.thumbnail ? [p.thumbnail] : []),
    
    // Seller info
    sellerName: p?.location || "Vehicle Seller",
    sellerInfo: {
      name: p?.location || "Vehicle Seller",
      address: p?.location || "",
    },
    
    // Additional specs based on vehicle data
    specifications: {
      "Năm sản xuất": v?.yearmanufacture || "N/A",
      "Số chỗ ngồi": v?.numberofseat || "N/A",
      "Loại xe": v?.style || "N/A",
      "Màu sắc": v?.color || "N/A",
      "ODO": v?.odo ? `${v.odo.toLocaleString()} km` : "Xe mới",
      "Dung lượng pin": v?.batterycapacity ? `${v.batterycapacity} kWh` : "N/A",
      "Quãng đường": v?.range ? `${v.range} km` : "N/A",
      "Thời gian sạc": v?.chargingtime ? `${v.chargingtime}h` : "N/A",
      "Xuất xứ": v?.origin || "N/A",
      "Biển số": v?.licenseplate || "N/A",
      "Bảo hiểm thân vỏ": v?.bodyinsurance ? "Có" : "Không",
      "Kiểm định": v?.vehicleinspection ? "Có" : "Không",
    },
    
    isFavorite: false,
  };
};

export default function VehicleDetail() {
  const { postID } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!postID) return;
      
      setLoading(true);
      console.log("📌 Fetching vehicle detail for postID:", postID);
      
      try {
        const response = await api.get(`/api/post/detail/${postID}`);
        const postData = response.data;
        
        // Kiểm tra xem post có chứa vehicle không
        if (!postData?.vehicle) {
          console.warn("Post không chứa thông tin vehicle");
          setVehicle(null);
          return;
        }
        
        const mappedVehicle = mapPostToDetail(postData);
        setVehicle(mappedVehicle);
        setIsFavorite(mappedVehicle.isFavorite);
        
        console.log("✅ Vehicle detail loaded:", mappedVehicle);
      } catch (error) {
        console.error("❌ Failed to fetch vehicle detail:", error);
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [postID]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleContactSeller = () => {
    if (vehicle?.sellerInfo?.phone) {
      window.open(`tel:${vehicle.sellerInfo.phone}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="vehicle-detail-page">
        <div className="detail-loading">
          <div className="detail-loading-spinner"></div>
          <p>Loading ...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="vehicle-detail-page">
        <div className="detail-not-found">
          <h2>No vehicle found</h2>
          <button onClick={() => navigate('/vehicles')} className="detail-back-btn">
            Back to list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-detail-page">
      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
        <span className="breadcrumb-separator">/</span>
        <span onClick={() => navigate('/vehicles')} className="breadcrumb-link">Electric Vehicles</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{vehicle.brand} {vehicle.model}</span>
      </div>

      <div className="detail-main-container">
        {/* Left Column - Images */}
        <div className="detail-images-tabs">
          <div className="detail-main-image">
            <img 
              src={vehicle.images?.[selectedImage] || vehicle.image || '/placeholder-car.jpg'} 
              alt={`${vehicle.brand} ${vehicle.model}`}
              onError={(e) => {
                e.target.src = '/placeholder-car.jpg';
              }}
            />
            {vehicle.status === 'new' && <div className="new-badge">Mới</div>}
          </div>
          
          {vehicle.images && vehicle.images.length > 1 && (
            <div className="detail-image-thumbnails">
              {vehicle.images.map((img, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`View ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
          {/* Detailed Information Tabs */}
      <div className="detail-tabs-section">
        <div className="detail-tabs-container">
          <div className="detail-tab-content">
            {/* Description */}
            <div className="detail-content-section">
              <h2>Description</h2>
              <div className="detail-description">
                {vehicle.description || "Modern electric car with advanced technology and beautiful design."}
              </div>
            </div>

            {/* Key Features from vehicle specs */}
            <div className="detail-content-section">
              <h2>Key Features</h2>
              <div className="detail-features-grid">
                {vehicle.batteryCapacity && (
                  <div className="detail-feature-item">
                    <span className="detail-feature-icon">🔋</span>
                    <span className="detail-feature-text">Battery: {vehicle.batteryCapacity}</span>
                  </div>
                )}
                {vehicle.range && (
                  <div className="detail-feature-item">
                    <span className="detail-feature-icon">🛣️</span>
                    <span className="detail-feature-text">Range: {vehicle.range}</span>
                  </div>
                )}
                {vehicle.chargingTime && (
                  <div className="detail-feature-item">
                    <span className="detail-feature-icon">⚡</span>
                    <span className="detail-feature-text">Charging: {vehicle.chargingTime}</span>
                  </div>
                )}
                {vehicle.status === 'new' && (
                  <div className="detail-feature-item">
                    <span className="detail-feature-icon">✨</span>
                    <span className="detail-feature-text">Brand New Vehicle</span>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            {vehicle.specifications && (
              <div className="detail-content-section">
                <h2>Specifications</h2>
                <div className="detail-specifications-table">
                  {Object.entries(vehicle.specifications).map(([key, value]) => (
                    <div key={key} className="detail-spec-row">
                      <div className="detail-spec-label">{key}</div>
                      <div className="detail-spec-value">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
        </div>

        {/* Right Column - Details */}
        <div className="detail-info-section">
          <div className="detail-vehicle-header">
            <h1 className="detail-vehicle-title">
              {vehicle.brand} {vehicle.model} {vehicle.version}
            </h1>
            <button 
              className={`detail-favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteClick}
            >
              <span className="detail-heart-icon">♥</span>
            </button>
          </div>

          <div className="detail-price-section">
            <div className="detail-price">{formatPrice(vehicle.price)}</div>
            <div className="detail-price-note">Price</div>
          </div>

            {/* Key Information */}
          <div className="detail-key-info">
            <div className="detail-info-grid">
              {vehicle.batteryCapacity && (
                <div className="detail-info-item">
                  <span className="detail-info-label">Battery Capacity:</span>
                  <span className="detail-info-value">{vehicle.batteryCapacity}</span>
                </div>
              )}
              {vehicle.range && (
                <div className="detail-info-item">
                  <span className="detail-info-label">Range:</span>
                  <span className="detail-info-value">{vehicle.range}</span>
                </div>
              )}
              {vehicle.chargingTime && (
                <div className="detail-info-item">
                  <span className="detail-info-label">Charging Time:</span>
                  <span className="detail-info-value">{vehicle.chargingTime}</span>
                </div>
              )}
              <div className="detail-info-item">
                <span className="detail-info-label">Number of Seats:</span>
                <span className="detail-info-value">{vehicle.numberOfSeat || 'N/A'}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Style:</span>
                <span className="detail-info-value">{vehicle.style || 'N/A'}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Color:</span>
                <span className="detail-info-value">{vehicle.color || 'N/A'}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">ODO:</span>
                <span className="detail-info-value">
                  {vehicle.odo > 0 ? `${vehicle.odo.toLocaleString()} km` : 'New car'}
                </span>
              </div>
              {vehicle.year > 0 && (
                <div className="detail-info-item">
                  <span className="detail-info-label">Year:</span>
                  <span className="detail-info-value">{vehicle.year}</span>
                </div>
              )}
            </div>
          </div>          {/* Contact Section */}
          <div className="detail-contact-section">
            <div className="detail-seller-info">
              <h3>Seller Information</h3>
              <div className="detail-seller-details">
                <div className="detail-seller-name">{vehicle.sellerInfo?.name || vehicle.sellerName}</div>
                {vehicle.sellerInfo?.rating && (
                  <div className="detail-seller-rating">
                    <span className="detail-stars">★★★★★</span>
                    <span className="detail-rating-text">({vehicle.sellerInfo.rating}/5)</span>
                  </div>
                )}
                {vehicle.sellerInfo?.address && (
                  <div className="detail-seller-location">{vehicle.sellerInfo.address}</div>
                )}
              </div>
            </div>

            <div className="detail-contact-buttons">
              <button className="detail-contact-btn primary" onClick={handleContactSeller}>
                <span className="phone-icon">📞</span>
                Contact Seller
              </button>
              <button className="detail-contact-btn secondary">
                <span className="buy-icon">🛒</span>
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}