import React, { useState, useEffect } from "react";
import api from "../../config/api";
import "./ComparisonPage.css";

export default function ComparisonPage() {
  const [comparisonType, setComparisonType] = useState("vehicles"); // 'vehicles' or 'batteries'
  const [selectedItems, setSelectedItems] = useState([null, null, null]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(null);

  // Load available items based on comparison type
  useEffect(() => {
    loadAvailableItems();
  }, [comparisonType]);

  const loadAvailableItems = async () => {
    setLoading(true);
    try {
      const endpoint =
        comparisonType === "vehicles"
          ? "/api/post/public/vehicles"
          : "/api/post/public/batteries";

      const response = await api.get(endpoint);
      setAvailableItems(response.data || []);
    } catch (error) {
      console.error("Error loading items:", error);
      setAvailableItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (index) => {
    setCurrentSlotIndex(index);
    setShowSelector(true);
  };

  const handleItemSelect = (item) => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems[currentSlotIndex] = item;
    setSelectedItems(newSelectedItems);
    setShowSelector(false);
  };

  const handleRemoveItem = (index) => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index] = null;
    setSelectedItems(newSelectedItems);
  };

  const handleTypeChange = (newType) => {
    setComparisonType(newType);
    setSelectedItems([null, null, null]); // Clear selections when changing type
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderComparisonSlot = (index) => {
    const item = selectedItems[index];

    if (!item) {
      return (
        <div
          className="comparison-slot empty"
          onClick={() => handleSlotClick(index)}
        >
          <div className="plus-icon">+</div>
          <div className="slot-label">
            {comparisonType === "vehicles"
              ? "Choose Vehicle"
              : "Choose Battery"}
          </div>
        </div>
      );
    }

    return (
      <div className="comparison-slot filled">
        <button className="remove-btn" onClick={() => handleRemoveItem(index)}>
          ×
        </button>
        <div className="item-image">
          <img
            src={item.imageUrls?.[0] || "https://via.placeholder.com/300x200"}
            alt={item.title}
          />
        </div>
        <div className="item-info">
          <h3>{item.title}</h3>
          <p className="price">{formatPrice(item.price)}</p>
          <div className="seller">By {item.sellerName || "Seller"}</div>
        </div>
      </div>
    );
  };

  const renderItemSelector = () => {
    if (!showSelector) return null;

    return (
      <div className="item-selector-overlay">
        <div className="item-selector">
          <div className="selector-header">
            <h3>
              Select {comparisonType === "vehicles" ? "Vehicle" : "Battery"}
            </h3>
            <button
              className="close-btn"
              onClick={() => setShowSelector(false)}
            >
              ×
            </button>
          </div>
          <div className="selector-content">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <div className="items-grid">
                {availableItems.map((item) => (
                  <div
                    key={item.postId}
                    className="item-card"
                    onClick={() => handleItemSelect(item)}
                  >
                    <img
                      src={
                        item.imageUrls?.[0] ||
                        "https://via.placeholder.com/200x150"
                      }
                      alt={item.title}
                    />
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p className="price">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderComparisonTable = () => {
    const hasSelectedItems = selectedItems.some((item) => item !== null);
    if (!hasSelectedItems) return null;

    const specifications =
      comparisonType === "vehicles"
        ? [
            { key: "brand", label: "Brand" },
            { key: "model", label: "Model" },
            { key: "year", label: "Year" },
            { key: "range", label: "Range (km)" },
            { key: "batteryCapacity", label: "Battery Capacity (kWh)" },
            { key: "chargingTime", label: "Charging Time (hours)" },
            { key: "topSpeed", label: "Top Speed (km/h)" },
            { key: "seatingCapacity", label: "Seating Capacity" },
            { key: "price", label: "Price" },
          ]
        : [
            { key: "brand", label: "Brand" },
            { key: "model", label: "Model" },
            { key: "capacity", label: "Capacity (kWh)" },
            { key: "voltage", label: "Voltage (V)" },
            { key: "chemistry", label: "Chemistry" },
            { key: "cycleLife", label: "Cycle Life" },
            { key: "warranty", label: "Warranty (years)" },
            { key: "weight", label: "Weight (kg)" },
            { key: "price", label: "Price" },
          ];

    return (
      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Specifications</th>
              {selectedItems.map((item, index) => (
                <th key={index}>{item ? item.title : `Slot ${index + 1}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specifications.map((spec) => (
              <tr key={spec.key}>
                <td className="spec-label">{spec.label}</td>
                {selectedItems.map((item, index) => (
                  <td key={index}>
                    {item
                      ? spec.key === "price"
                        ? formatPrice(item.price)
                        : item[spec.key] || "N/A"
                      : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="comparison-page">
      <div className="comparison-header">
        <h1>Vehicle Comparison</h1>
        <p>
          Compare the best electric vehicles and batteries. Select up to 3 items
          to compare.
        </p>

        {/* Type Filter */}
        <div className="filter-section">
          <label>Compare:</label>
          <select
            value={comparisonType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="type-selector"
          >
            <option value="vehicles">Vehicles</option>
            <option value="batteries">Electrics</option>
          </select>
        </div>
      </div>

      {/* Comparison Slots */}
      <div className="comparison-slots">
        {[0, 1, 2].map((index) => (
          <div key={index} className="slot-container">
            {renderComparisonSlot(index)}
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      {renderComparisonTable()}

      {/* Item Selector Modal */}
      {renderItemSelector()}
    </div>
  );
}
