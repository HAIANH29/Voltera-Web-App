import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./vehicleDetail.css";

// Mock data for demonstration purposes
const mockVehiclesData = [
  {
    postID: "VH001",
    batteryType: "Lithium-ion",
    brand: "Tesla",
    model: "Model 3",
    version: "Standard Range Plus",
    status: "new",
    odo: 0,
    batteryCapacity: "75 kWh",
    range: "448 km",
    chargingTime: "8h (AC) / 30min (DC)",
    color: "Pearl White",
    numberOfSeat: 5,
    style: "Sedan",
    image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400",
    sellerName: "Nguyễn Văn A",
    price: 1200000000,
    isFavorite: false,
    description: "Tesla Model 3 là một chiếc sedan điện cao cấp với thiết kế tối giản và công nghệ tiên tiến. Xe được trang bị hệ thống Autopilot và màn hình cảm ứng 15 inch.",
    features: [
      "Autopilot",
      "Màn hình cảm ứng 15 inch",
      "Sạc siêu nhanh",
      "Hệ thống âm thanh cao cấp",
      "Cập nhật OTA",
      "Sentry Mode"
    ],
    specifications: {
      "Động cơ": "Điện AC đồng bộ",
      "Công suất": "283 hp",
      "Mô-men xoắn": "420 Nm",
      "Tăng tốc 0-100km/h": "5.6 giây",
      "Tốc độ tối đa": "225 km/h",
      "Dung tích cốp": "425L",
      "Trọng lượng": "1,611 kg"
    },
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
    ],
    sellerInfo: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      address: "Quận 1, TP.HCM",
      rating: 4.8,
      totalSales: 25
    }
  },
];

export default function VehicleDetail() {
  const { postID } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      console.log("📌 postID từ URL:", postID);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundVehicle = mockVehiclesData.find(v => v.postID === postID);
      if (foundVehicle) {
        setVehicle(foundVehicle);
        setIsFavorite(foundVehicle.isFavorite);
      }
      setLoading(false);
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
          <p>Đang tải thông tin xe...</p>
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
        <span onClick={() => navigate('/')} className="breadcrumb-link">Trang chủ</span>
        <span className="breadcrumb-separator">/</span>
        <span onClick={() => navigate('/vehicles')} className="breadcrumb-link">Xe điện</span>
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

            {/* Features */}
            {vehicle.features && (
              <div className="detail-content-section">
                <h2>Outstanding Features</h2>
                <div className="detail-features-grid">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="detail-feature-item">
                      <span className="detail-feature-icon">✓</span>
                      <span className="detail-feature-text">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
            <div className="detail-price-note">Giá bán</div>
          </div>

          {/* Key Information */}
          <div className="detail-key-info">
            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span className="detail-info-label">Battery Type:</span>
                <span className="detail-info-value">{vehicle.batteryType}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Battery Capacity:</span>
                <span className="detail-info-value">{vehicle.batteryCapacity}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Range:</span>
                <span className="detail-info-value">{vehicle.range}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Charging Time:</span>
                <span className="detail-info-value">{vehicle.chargingTime}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Number of Seats:</span>
                <span className="detail-info-value">{vehicle.numberOfSeat}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Style:</span>
                <span className="detail-info-value">{vehicle.style}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Color:</span>
                <span className="detail-info-value">{vehicle.color}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">ODO:</span>
                <span className="detail-info-value">
                  {vehicle.odo > 0 ? `${vehicle.odo.toLocaleString()} km` : 'New car'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Section */}
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
                Liên hệ người bán
              </button>
              <button className="detail-contact-btn secondary">
                <span className="message-icon">💬</span>
                Nhắn tin
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}