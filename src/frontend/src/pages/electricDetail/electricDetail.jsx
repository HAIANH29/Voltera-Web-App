import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import Cookies from "../../utils/cookies";
import { routes } from "../../routes";
import "./electricDetail.css";

/**
 * Map PostResponse (backend) -> detail view model for battery
 * Keep the returned shape minimal and defensive (fields may be null)
 */
const mapPostToDetail = (p) => {
  const b = p?.battery || {};
  const priceNumber = p?.price != null ? Number(p.price) : 0;

  const images =
    Array.isArray(p?.imageUrls) && p.imageUrls.length > 0
      ? p.imageUrls
      : p?.thumbnail
      ? [p.thumbnail]
      : [];

  return {
    postID: String(p?.postId ?? ""),
    title: p?.title || `${b?.batteryTypeId?.typename || "Battery"} Pack`,
    description:
      p?.description ||
      "High-quality battery with advanced technology and durability.",
    price: priceNumber,
    status: (p?.status || "").toLowerCase(),

    // battery specific - matching BatteryDTO field names
    productName: p?.title || `${b?.batteryTypeId?.typename || "Battery"} Pack`,
    isNew: (b?.cycleCount || 0) < 100, // Consider low cycle count as "new"

    // images
    images,
    image: images[0] || "/placeholder-battery.jpg",

    // seller/location (backend only sets location string currently)
    seller: {
      address: p?.location || null,
    },
    sellerName: p?.location || "Battery Seller",

    // battery details from BatteryDTO
    batteryDetails: {
      serialNumber: b?.serialNumber,
      batteryType: b?.batteryTypeId?.typename,
      originalCapacity: b?.originCapacity ? `${b.originCapacity}kWh` : null,
      remainingCapacity: b?.remainingCapacity
        ? `${b.remainingCapacity}kWh`
        : null,
      mileageCovered: b?.mileageCovered ? `${b.mileageCovered}km` : null,
      voltage: b?.voltage ? `${b.voltage}V` : null,
      cycleCount: b?.cycleCount || 0,
      warranty: b?.warranty,
      weight: b?.weight ? `${b.weight}kg` : null,
      lifeCycle: b?.lifeCycle ? `${b.lifeCycle} cycles` : "8000 cycles",
      technical: b?.batteryTypeId?.technical,
      description: b?.batteryTypeId?.description,
    },

    // seller info (mock for now, can be enhanced later)
    sellerInfo: {
      name: p?.location || "Battery Seller",
      address: p?.location,
      rating: 4.8,
      totalSales: 50,
    },

    // features (derived from battery type or default)
    features: [
      "Advanced battery technology",
      "Long-lasting performance",
      "Fast charging capability",
      "Environmentally friendly",
      "Professional warranty support",
      "High energy density",
    ],

    // specifications (derived from battery data)
    specifications: {
      "Battery Type": b?.batteryTypeId?.typename || "N/A",
      "Serial Number": b?.serialNumber || "N/A",
      "Original Capacity": b?.originCapacity
        ? `${b.originCapacity} kWh`
        : "N/A",
      "Current Capacity": b?.remainingCapacity
        ? `${b.remainingCapacity} kWh`
        : "N/A",
      Voltage: b?.voltage ? `${b.voltage}V` : "N/A",
      "Cycle Count": b?.cycleCount ? `${b.cycleCount}` : "N/A",
      "Mileage Covered": b?.mileageCovered ? `${b.mileageCovered}km` : "N/A",
      Weight: b?.weight ? `${b.weight}kg` : "N/A",
      "Life Cycle": b?.lifeCycle ? `${b.lifeCycle} cycles` : "N/A",
      Warranty: b?.warranty || "N/A",
    },

    isFavorite: false,
  };
};

// Mock data for fallback (development only)
const mockBatteriesData = [
  {
    postID: 1,
    image: "https://images.unsplash.com/photo-1558618047-3c8c6c8b1c0e?w=400",
    productName: "Tesla Model S Battery Pack",
    basicInfo: ["Li-ion", "85kWh", "8000 cycles"],
    sellerName: "Tesla Service Center",
    price: 450000000,
    isNew: true,
    isFavorite: false,
    batteryDetails: {
      batteryType: "Lithium-ion",
      serialNumber: "TSL-85-2023-001",
      originalCapacity: "85kWh",
      remainingCapacity: "82kWh",
      mileageCovered: "15000km",
      voltage: "400V",
      cycleCount: 245,
      warranty: "8 năm",
      weight: "540kg",
      lifeCycle: "8000 cycles",
    },
    description:
      "Pin lithium-ion chính hãng Tesla Model S với công nghệ tiên tiến và độ bền cao. Pin đã được kiểm tra và bảo dưỡng định kỳ, còn 96.5% dung lượng ban đầu.",
    features: [
      "Công nghệ lithium-ion tiên tiến",
      "Hệ thống quản lý nhiệt thông minh",
      "Sạc nhanh DC lên đến 250kW",
      "Tuổi thọ 8000+ chu kỳ sạc",
      "Bảo hành chính hãng 8 năm",
      "Khả năng tái chế 95%",
    ],
    specifications: {
      "Loại pin": "Lithium-ion NCR 18650",
      "Dung lượng danh định": "85 kWh",
      "Dung lượng còn lại": "82 kWh (96.5%)",
      "Điện áp": "400V DC",
      "Dòng sạc tối đa": "625A",
      "Công suất sạc": "250kW (DC)",
      "Số chu kỳ đã sử dụng": "245/8000",
      "Nhiệt độ vận hành": "-20°C đến +60°C",
      "Trọng lượng": "540kg",
      "Kích thước": "210 x 150 x 14 cm",
    },
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c6c8b1c0e?w=800",
      "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
    ],
    sellerInfo: {
      name: "Tesla Service Center",
      phone: "1900123456",
      address: "Quận 3, TP.HCM",
      rating: 4.9,
      totalSales: 150,
    },
  },
];

export default function ElectricDetail() {
  const { postID } = useParams();
  const navigate = useNavigate();
  const [battery, setBattery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchBattery = async () => {
      if (!postID) return;

      setLoading(true);
      console.log("� Fetching battery detail for postID:", postID);

      try {
        const response = await api.get(`/api/post/detail/${postID}`);
        const postData = response.data;

        // Kiểm tra xem post có chứa battery không
        if (!postData?.battery) {
          console.warn("Post không chứa thông tin battery");
          // Fallback to mock data in development
          if (process.env.NODE_ENV === "development") {
            const foundBattery = mockBatteriesData.find(
              (b) => b.postID === parseInt(postID)
            );
            if (foundBattery) {
              setBattery(foundBattery);
              setIsFavorite(foundBattery.isFavorite);
            } else {
              setBattery(null);
            }
          } else {
            setBattery(null);
          }
          return;
        }

        const mappedBattery = mapPostToDetail(postData);
        setBattery(mappedBattery);
        setIsFavorite(mappedBattery.isFavorite);

        console.log("✅ Battery detail loaded:", mappedBattery);
      } catch (error) {
        console.error("❌ Failed to fetch battery detail:", error);
        console.log("STATUS =", error?.response?.status);
        console.log("DATA   =", error?.response?.data);

        // Fallback to mock data in development
        if (process.env.NODE_ENV === "development") {
          console.log("🔄 Using mock data as fallback");
          const foundBattery = mockBatteriesData.find(
            (b) => b.postID === parseInt(postID)
          );
          if (foundBattery) {
            setBattery(foundBattery);
            setIsFavorite(foundBattery.isFavorite);
          } else {
            setBattery(null);
          }
        } else {
          setBattery(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBattery();
  }, [postID]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleContactSeller = () => {
    if (battery?.sellerInfo?.phone) {
      window.open(`tel:${battery.sellerInfo.phone}`);
    } else {
      alert("Contact information not available. Please check back later.");
    }
  };

  const handleCreateContract = () => {
    // Check if user is logged in
    const token = Cookies.get("accessToken");
    if (!token) {
      alert("Please log in to create a contract.");
      navigate("/login");
      return;
    }

    // Check if battery data is available
    if (!battery) {
      alert("Battery information has not been loaded. Please try again.");
      return;
    }

    // Debug: Log battery data
    console.log("🔍 Battery data:", battery);
    console.log("🔍 Battery name:", battery.productName);
    console.log("🔍 Battery price:", battery.price);

    // Navigate to contract page to create contract for battery
    navigate(`/contract?postId=${postID}&action=create&type=battery`);
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "Contact for Price";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateBatteryHealth = () => {
    if (
      !battery?.batteryDetails?.originalCapacity ||
      !battery?.batteryDetails?.remainingCapacity
    ) {
      return 95; // Default health percentage
    }
    const original = parseFloat(battery.batteryDetails.originalCapacity);
    const remaining = parseFloat(battery.batteryDetails.remainingCapacity);
    if (isNaN(original) || isNaN(remaining) || original === 0) return 95;
    return ((remaining / original) * 100).toFixed(1);
  };

  const getCycleStatus = () => {
    if (!battery?.batteryDetails?.cycleCount) return "excellent";
    const used = battery.batteryDetails.cycleCount;
    const totalLifeCycle = battery.batteryDetails.lifeCycle;
    const total = totalLifeCycle ? parseInt(totalLifeCycle) : 8000; // Default lifecycle
    const percentage = (used / total) * 100;

    if (percentage < 25) return "excellent";
    if (percentage < 50) return "good";
    return "fair";
  };

  if (loading) {
    return (
      <div className="electric-detail-page">
        <div className="detail-loading">
          <div className="detail-loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!battery) {
    return (
      <div className="electric-detail-page">
        <div className="detail-not-found">
          <h2>Battery Not Found</h2>
          <button
            onClick={() => navigate("/electrics")}
            className="detail-back-btn"
          >
            Back to Batteries
          </button>
        </div>
      </div>
    );
  }

  const batteryHealthPercentage = calculateBatteryHealth();

  return (
    <div className="electric-detail-page">
      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <span onClick={() => navigate("/")} className="breadcrumb-link">
          Home
        </span>
        <span className="breadcrumb-separator">/</span>
        <span
          onClick={() => navigate("/electrics")}
          className="breadcrumb-link"
        >
          Electric Batteries
        </span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">
          {battery.productName || battery.title}
        </span>
      </div>

      <div className="detail-main-container">
        {/* Left Column - Images */}
        <div className="detail-images-tabs">
          <div className="detail-main-image">
            <img
              src={
                battery.images?.[selectedImage] ||
                battery.image ||
                "/placeholder-battery.jpg"
              }
              alt={battery.productName || battery.title}
              onError={(e) => {
                e.target.src = "/placeholder-battery.jpg";
              }}
            />
            {battery.isNew && <div className="new-badge">New</div>}
            <div className="battery-health-badge">
              🔋 {batteryHealthPercentage}%
            </div>
          </div>

          {battery.images && battery.images.length > 1 && (
            <div className="detail-image-thumbnails">
              {battery.images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${
                    index === selectedImage ? "active" : ""
                  }`}
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
                    {battery.description ||
                      "High-quality battery with advanced technology and durability."}
                  </div>
                </div>

                {/* Features */}
                {battery.features && (
                  <div className="detail-content-section">
                    <h2>Features</h2>
                    <div className="detail-features-grid">
                      {battery.features.map((feature, index) => (
                        <div key={index} className="detail-feature-item">
                          <span className="detail-feature-icon">⚡</span>
                          <span className="detail-feature-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {battery.specifications && (
                  <div className="detail-content-section">
                    <h2>Specifications</h2>
                    <div className="detail-specifications-table">
                      {Object.entries(battery.specifications)
                        .filter(([key, value]) => value && value !== "N/A")
                        .map(([key, value]) => (
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
          <div className="detail-battery-header">
            <h1 className="detail-battery-title">
              {battery.productName || battery.title}
            </h1>
          </div>

          <div className="detail-price-section">
            <div className="detail-price">{formatPrice(battery.price)}</div>
            <div className="detail-price-note">Selling Price</div>
          </div>

          {/* Battery Health Section */}
          <div className="battery-health-section">
            <div className="battery-health-title">🔋 Battery Status</div>
            <div className="battery-health-bar">
              <div
                className="battery-health-fill"
                style={{ width: `${batteryHealthPercentage}%` }}
              ></div>
            </div>
            <div className="battery-health-text">
              Remaining Capacity: {batteryHealthPercentage}%
            </div>
            <div className="battery-cycle-indicator">
              <span>Charge Cycles:</span>
              <span className={`cycle-status ${getCycleStatus()}`}>
                {battery.batteryDetails?.cycleCount || 0}/
                {parseInt(battery.batteryDetails?.lifeCycle) || 8000}
              </span>
            </div>
          </div>

          {/* Key Information */}
          <div className="detail-key-info">
            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span className="detail-info-label">Battery Type:</span>
                <span className="detail-info-value">
                  {battery.batteryDetails?.batteryType}
                </span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Original Capacity:</span>
                <span className="detail-info-value">
                  {battery.batteryDetails?.originalCapacity}
                </span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Current Capacity:</span>
                <span className="detail-info-value">
                  {battery.batteryDetails?.remainingCapacity}
                </span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Voltage:</span>
                <span className="detail-info-value">
                  {battery.batteryDetails?.voltage}
                </span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Mileage Covered:</span>
                <span className="detail-info-value">
                  {battery.batteryDetails?.mileageCovered}
                </span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Charge Cycles:</span>
                <span className="detail-info-value">
                  {battery.batteryDetails?.cycleCount}
                </span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Warranty:</span>
                <span className="detail-info-value">
                  {battery.batteryDetails?.warranty}
                </span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Weight:</span>
                <span className="detail-info-value">
                  {battery.batteryDetails?.weight}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="detail-contact-section">
            <div className="detail-seller-info">
              <h3>Seller Information</h3>
              <div className="detail-seller-details">
                <div className="detail-seller-name">
                  {battery.sellerInfo?.name || battery.sellerName}
                </div>
                {battery.sellerInfo?.rating && (
                  <div className="detail-seller-rating">
                    <span className="detail-stars">★★★★★</span>
                    <span className="detail-rating-text">
                      ({battery.sellerInfo.rating}/5)
                    </span>
                  </div>
                )}
                {battery.sellerInfo?.address && (
                  <div className="detail-seller-location">
                    {battery.sellerInfo.address}
                  </div>
                )}
              </div>
            </div>

            <div className="detail-contact-buttons">
              <button
                className="detail-contact-btn secondary"
                onClick={handleContactSeller}
              >
                <span className="phone-icon">📞</span>
                Contact Seller
              </button>
              <button
                className="detail-contact-btn primary"
                onClick={handleCreateContract}
              >
                <span className="contract-icon">📋</span>
                Create Contract
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
