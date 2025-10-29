import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import "./vehicleDetail.css";

/**
 * Map PostResponse (backend) -> detail view model
 * Keep the returned shape minimal and defensive (fields may be null)
 */
const mapPostToDetail = (p) => {
  const v = p?.vehicle || {};
  const priceNumber = p?.price != null ? Number(p.price) : 0;

  const images = Array.isArray(p?.imageUrls) && p.imageUrls.length > 0
    ? p.imageUrls
    : p?.thumbnail ? [p.thumbnail] : [];

  return {
    postID: String(p?.postId ?? ""),
    title: p?.title || `${v?.brand || ''} ${v?.model || ''} ${v?.version || ''}`.trim(),
    description: p?.description || "Modern electric vehicle with up-to-date features.",
    price: priceNumber,
    status: (p?.status || "").toLowerCase(),

    // vehicle specific
    brand: v?.brand || "",
    model: v?.model || "",
    version: v?.version || "",
    style: v?.style || "",
    color: v?.color || "",
    numberOfSeat: Number(v?.numberofseat ?? 0),
    odo: Number(v?.odo ?? 0),
    year: Number(v?.yearmanufacture ?? 0),
    batteryCapacityRaw: v?.batterycapacity ?? null,
    batteryCapacity: v?.batterycapacity != null ? `${v.batterycapacity} kWh` : null,
    rangeRaw: v?.range ?? null,
    range: v?.range != null ? `${v.range} km` : null,
    chargingTimeRaw: v?.chargingtime ?? null,
    chargingTime: v?.chargingtime != null ? `${v.chargingtime} h` : null,
    licensePlate: v?.licenseplate || null,
    origin: v?.origin || null,
    bodyInsurance: Boolean(v?.bodyinsurance),
    vehicleInspection: Boolean(v?.vehicleinspection),

    // images
    images,
    image: images[0] || '/placeholder-car.jpg',

    // seller/location (backend only sets location string currently)
    seller: {
      address: p?.location || null,
    },

    // specifications (English labels)
    specifications: {
      "Year": v?.yearmanufacture || "N/A",
      "Seats": v?.numberofseat || "N/A",
      "Body type": v?.style || "N/A",
      "Color": v?.color || "N/A",
      "Odometer": v?.odo ? `${v.odo.toLocaleString()} km` : "New",
      "Battery": v?.batterycapacity ? `${v.batterycapacity} kWh` : "N/A",
      "Range": v?.range ? `${v.range} km` : "N/A",
      "Charging time": v?.chargingtime ? `${v.chargingtime} h` : "N/A",
      "Origin": v?.origin || "N/A",
      "License plate": v?.licenseplate || "N/A",
      "Body insurance": v?.bodyinsurance ? "Yes" : "No",
      "Vehicle inspection": v?.vehicleinspection ? "Yes" : "No",
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

  // FORCE TESLA COLORS - KILL GREEN OVERRIDE
  useEffect(() => {
    const forceColors = () => {
      const featureItems = document.querySelectorAll('.detail-feature-item');
      featureItems.forEach(item => {
        item.style.background = 'linear-gradient(135deg, rgba(232,33,39,0.08) 0%, rgba(232,33,39,0.05) 100%)';
        item.style.border = '2px solid rgba(232,33,39,0.2)';
        item.style.borderLeft = '4px solid #e82127';
        item.style.borderRadius = '12px';
        item.style.boxShadow = '0 2px 8px rgba(232,33,39,0.1)';
        
        const icon = item.querySelector('.detail-feature-icon');
        if (icon) {
          icon.style.color = '#e82127';
          icon.style.fontSize = '18px';
          icon.style.fontWeight = '700';
        }
        
        const text = item.querySelector('.detail-feature-text');
        if (text) {
          text.style.color = '#0b0f13';
          text.style.fontWeight = '600';
          text.style.fontSize = '15px';
        }
      });
    };
    
    // Force colors immediately and after delays
    forceColors();
    const timer1 = setTimeout(forceColors, 50);
    const timer2 = setTimeout(forceColors, 200);
    const timer3 = setTimeout(forceColors, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [vehicle]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleContactSeller = () => {
    if (vehicle?.sellerInfo?.phone) {
      window.open(`tel:${vehicle.sellerInfo.phone}`);
    }
  };

  const handlePurchase = () => {
    // Check if user is logged in - sử dụng cùng pattern như headerAfter
    const token = Cookies.get("accessToken");
    if (!token) {
      alert("Vui lòng đăng nhập để mua xe.");
      navigate("/login");
      return;
    }

    // Navigate to contract page with postId
    navigate(`/contract/post/${postID}`);
  };

  const handleCreateContract = () => {
    // Check if user is logged in
    const token = Cookies.get("accessToken");
    if (!token) {
      alert("Vui lòng đăng nhập để tạo hợp đồng.");
      navigate("/login");
      return;
    }

    // Check if vehicle data is available
    if (!vehicle) {
      alert("Thông tin xe chưa được tải. Vui lòng thử lại.");
      return;
    }

    // Debug: Log vehicle data before showing modal
    console.log("🔍 Vehicle data being passed to modal:", vehicle);
    console.log("🔍 Vehicle brand:", vehicle.brand);
    console.log("🔍 Vehicle model:", vehicle.model);
    console.log("🔍 Vehicle price:", vehicle.price);

    // Show contract preview modal
    setShowContractPreview(true);
  };

  const handleContractCreated = (contractData) => {
    setShowContractPreview(false);
    // Navigate to contract page to view the created contract
    if (contractData?.contractId) {
      navigate(`/contract?contractId=${contractData.contractId}`);
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
            {(vehicle.odo === 0 || vehicle.status === 'new') && <div className="new-badge">New</div>}
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
                    <span className="detail-feature-icon">⚡</span>
                    <span className="detail-feature-text">Battery: {vehicle.batteryCapacity}</span>
                  </div>
                )}
                {vehicle.range && (
                  <div className="detail-feature-item">
                    <span className="detail-feature-icon">�</span>
                    <span className="detail-feature-text">Range: {vehicle.range}</span>
                  </div>
                )}
                {vehicle.chargingTime && (
                  <div className="detail-feature-item">
                    <span className="detail-feature-icon">🔌</span>
                    <span className="detail-feature-text">Charging: {vehicle.chargingTime}</span>
                  </div>
                )}
                {vehicle.odo === 0 && (
                  <div className="detail-feature-item">
                    <span className="detail-feature-icon">⭐</span>
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
                <div className="detail-seller-name">
                  {vehicle.seller?.address ? `Seller in ${vehicle.seller.address}` : "Private Seller"}
                </div>
                <div className="detail-seller-rating">
                  <span className="detail-stars">★★★★★</span>
                  <span className="detail-rating-text">(4.8/5)</span>
                </div>
                {vehicle.seller?.address && (
                  <div className="detail-seller-location">📍 {vehicle.seller.address}</div>
                )}
              </div>
            </div>

            <div className="detail-contact-buttons">
              <button className="detail-contact-btn secondary" onClick={handleContactSeller}>
                <span className="phone-icon">📞</span>
                Contact Seller
              </button>
              <button className="detail-contact-btn primary" onClick={handleCreateContract}>
                <span className="contract-icon">📋</span>
                Tạo hợp đồng
              </button>
              <button className="detail-contact-btn success" onClick={handlePurchase}>
                <span className="buy-icon">🚗</span>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}