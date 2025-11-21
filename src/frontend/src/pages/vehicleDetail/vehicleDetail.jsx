import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import Cookies from "../../utils/cookies";
import { routes } from "../../routes";
import "./vehicleDetail.css";

/**
 * Map PostResponse (backend) -> detail view model
 * Keep the returned shape minimal and defensive (fields may be null)
 */
const mapPostToDetail = (p) => {
  const v = p?.vehicle || {};
  const priceNumber = p?.price != null ? Number(p.price) : 0;

  const images =
    Array.isArray(p?.imageUrls) && p.imageUrls.length > 0
      ? p.imageUrls
      : p?.thumbnail
      ? [p.thumbnail]
      : [];

  return {
    postID: String(p?.postId ?? ""),
    title:
      p?.title ||
      `${v?.brand || ""} ${v?.model || ""} ${v?.version || ""}`.trim(),
    description:
      p?.description || "Modern electric vehicle with up-to-date features.",
    price: priceNumber,
    status: (p?.status || "").toLowerCase(),

    // vehicle specific - matching VehicleDTO field names (camelCase from backend)
    brand: v?.brand || "Electric Vehicle",
    model: v?.model || "Premium Model",
    version: v?.version || "Standard",
    style: v?.style || "SUV",
    color: v?.color || "Silver",
    numberOfSeat: Number(v?.numberOfSeat ?? 5) || 5, // camelCase from backend
    odo: Number(v?.odo ?? 0),
    year: Number(v?.yearManufacture ?? 0) || new Date().getFullYear(), // camelCase
    batteryCapacityRaw: v?.batteryCapacity ?? null, // camelCase from backend
    batteryCapacity:
      v?.batteryCapacity != null ? `${v.batteryCapacity} kWh` : null,
    rangeRaw: v?.range ?? null,
    range: v?.range != null ? `${v.range} km` : null,
    chargingTimeRaw: v?.chargingTime ?? null, // camelCase from backend
    chargingTime: v?.chargingTime != null ? `${v.chargingTime} hours` : null,
    licensePlate: v?.licensePlate || null, // camelCase
    origin: v?.origin || "International",
    bodyInsurance: Boolean(v?.bodyInsurance),
    vehicleInspection: Boolean(v?.vehicleInspection),

    // images
    images,
    image: images[0] || "/placeholder-car.jpg",

    // seller/location (backend only sets location string currently)
    seller: {
      address: p?.location || null,
    },

    // specifications (English labels) - using correct camelCase field names
    specifications: {
      Year: v?.yearManufacture || "N/A",
      Seats: v?.numberOfSeat || "N/A",
      "Body type": v?.style || "N/A",
      Color: v?.color || "N/A",
      Odometer:
        v?.odo !== null && v?.odo !== undefined
          ? v.odo === 0
            ? "New (0 km)"
            : `${v.odo.toLocaleString()} km`
          : "N/A",
      Battery: v?.batteryCapacity ? `${v.batteryCapacity} kWh` : "N/A",
      Range: v?.range ? `${v.range} km` : "N/A",
      "Charging time": v?.chargingTime ? `${v.chargingTime} h` : "N/A",
      Origin: v?.origin || "N/A",
      "License plate": v?.licensePlate || "N/A",
      "Body insurance":
        v?.bodyInsurance !== null && v?.bodyInsurance !== undefined
          ? v.bodyInsurance
            ? "Yes"
            : "No"
          : "N/A",
      "Vehicle inspection":
        v?.vehicleInspection !== null && v?.vehicleInspection !== undefined
          ? v.vehicleInspection
            ? "Yes"
            : "No"
          : "N/A",
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

      try {
        const response = await api.get(`/api/post/detail/${postID}`);
        const postData = response.data;

        // Kiểm tra xem post có chứa vehicle không
        if (!postData?.vehicle) {
          setVehicle(null);
          return;
        }

        const mappedVehicle = mapPostToDetail(postData);
        setVehicle(mappedVehicle);
        setIsFavorite(mappedVehicle.isFavorite);
      } catch (error) {
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
      const featureItems = document.querySelectorAll(".detail-feature-item");
      featureItems.forEach((item) => {
        item.style.background =
          "linear-gradient(135deg, rgba(232,33,39,0.08) 0%, rgba(232,33,39,0.05) 100%)";
        item.style.border = "2px solid rgba(232,33,39,0.2)";
        item.style.borderLeft = "4px solid #e82127";
        item.style.borderRadius = "12px";
        item.style.boxShadow = "0 2px 8px rgba(232,33,39,0.1)";

        const icon = item.querySelector(".detail-feature-icon");
        if (icon) {
          icon.style.color = "#e82127";
          icon.style.fontSize = "18px";
          icon.style.fontWeight = "700";
        }

        const text = item.querySelector(".detail-feature-text");
        if (text) {
          text.style.color = "#0b0f13";
          text.style.fontWeight = "600";
          text.style.fontSize = "15px";
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

  const handleCreateContract = () => {
    // Check if user is logged in
    const token = Cookies.get("accessToken");
    if (!token) {
      alert("Please log in to create a contract.");
      navigate("/login");
      return;
    }

    // Check user role - only buyers can create contracts
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userRole = currentUser?.role?.toUpperCase();

    if (userRole === "SELLER") {
      alert(
        "Sellers cannot create contracts for their own products. Only buyers can create contracts."
      );
      return;
    }

    if (userRole === "ADMIN") {
      alert(
        "Administrators cannot create contracts. Only buyers can create contracts."
      );
      return;
    }

    if (userRole !== "BUYER") {
      alert(
        "Only registered buyers can create contracts. Please ensure you have the correct account type."
      );
      return;
    }

    // Check if vehicle data is available
    if (!vehicle) {
      alert("Vehicle information has not been loaded. Please try again.");
      return;
    }

    // Navigate to contract page to create contract
    navigate(`/contract?postId=${postID}&action=create`);
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "Contact for Price";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
          <button
            onClick={() => navigate("/vehicles")}
            className="detail-back-btn"
          >
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
        <span onClick={() => navigate("/")} className="breadcrumb-link">
          Home
        </span>
        <span className="breadcrumb-separator">/</span>
        <span onClick={() => navigate("/vehicles")} className="breadcrumb-link">
          Electric Vehicles
        </span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">
          {vehicle.brand} {vehicle.model}
        </span>
      </div>

      <div className="detail-main-container">
        {/* Left Column - Images */}
        <div className="detail-images-tabs">
          <div className="detail-main-image">
            <img
              src={
                vehicle.images?.[selectedImage] ||
                vehicle.image ||
                "/placeholder-car.jpg"
              }
              alt={`${vehicle.brand} ${vehicle.model}`}
              onError={(e) => {
                e.target.src = "/placeholder-car.jpg";
              }}
            />
            {(vehicle.odo === 0 || vehicle.status === "new") && (
              <div className="new-badge">New</div>
            )}
          </div>

          {vehicle.images && vehicle.images.length > 1 && (
            <div className="detail-image-thumbnails">
              {vehicle.images.map((img, index) => (
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
                    {vehicle.description ||
                      "Modern electric car with advanced technology and beautiful design."}
                  </div>
                </div>

                {/* Vehicle Details under images */}
                <div className="detail-vehicle-info">
                  <h2>Vehicle Details</h2>
                  <div className="detail-info-grid">
                    <div className="detail-info-item">
                      <span className="detail-info-label">
                        Battery Capacity:
                      </span>
                      <span className="detail-info-value">
                        {vehicle.batteryCapacity || "N/A"}
                      </span>
                    </div>
                    <div className="detail-info-item">
                      <span className="detail-info-label">Range:</span>
                      <span className="detail-info-value">
                        {vehicle.range || "N/A"}
                      </span>
                    </div>
                    <div className="detail-info-item">
                      <span className="detail-info-label">Charging Time:</span>
                      <span className="detail-info-value">
                        {vehicle.chargingTime || "N/A"}
                      </span>
                    </div>
                    <div className="detail-info-item">
                      <span className="detail-info-label">
                        Number of Seats:
                      </span>
                      <span className="detail-info-value">
                        {vehicle.numberOfSeat || "N/A"}
                      </span>
                    </div>
                    <div className="detail-info-item">
                      <span className="detail-info-label">Style:</span>
                      <span className="detail-info-value">
                        {vehicle.style || "N/A"}
                      </span>
                    </div>
                    <div className="detail-info-item">
                      <span className="detail-info-label">Color:</span>
                      <span className="detail-info-value">
                        {vehicle.color || "N/A"}
                      </span>
                    </div>
                    <div className="detail-info-item">
                      <span className="detail-info-label">Mileage:</span>
                      <span className="detail-info-value">
                        {vehicle.odo > 0
                          ? `${vehicle.odo.toLocaleString()} km`
                          : vehicle.odo === 0
                          ? "Brand New (0 km)"
                          : "N/A"}
                      </span>
                    </div>
                    <div className="detail-info-item">
                      <span className="detail-info-label">Year:</span>
                      <span className="detail-info-value">
                        {vehicle.year || "N/A"}
                      </span>
                    </div>
                    <div className="detail-info-item">
                      <span className="detail-info-label">Origin:</span>
                      <span className="detail-info-value">
                        {vehicle.origin || "N/A"}
                      </span>
                    </div>
                    <div className="detail-info-item">
                      <span className="detail-info-label">License Plate:</span>
                      <span className="detail-info-value">
                        {vehicle.licensePlate || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
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
          </div>

          <div className="detail-price-section">
            <div className="detail-price">{formatPrice(vehicle.price)}</div>
            <div className="detail-price-note">Price</div>
          </div>

          {/* Contact Section */}
          <div className="detail-contact-section">
            <div className="detail-seller-info">
              <h3>Seller Information</h3>
              <div className="detail-seller-details">
                <div className="detail-seller-name">
                  {vehicle.seller?.address
                    ? `Seller in ${vehicle.seller.address}`
                    : "Private Seller"}
                </div>
                <div className="detail-seller-rating">
                  <span className="detail-stars">★★★★★</span>
                  <span className="detail-rating-text">(4.8/5)</span>
                </div>
                {vehicle.seller?.address && (
                  <div className="detail-seller-location">
                    <span className="voltera-icon location-icon"></span>
                    {vehicle.seller.address}
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
