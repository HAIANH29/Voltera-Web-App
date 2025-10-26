import React, { useState } from "react";
import { X, Navigation, MapPin, Search } from "lucide-react";
import "./MapPicker.css";

export default function SimpleMapPicker({ isOpen, onClose, onLocationSelect, initialCoords }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [customLocation, setCustomLocation] = useState("");
  
  const presetLocations = [
    { name: "Ho Chi Minh City", lat: 10.762622, lng: 106.660172 },
    { name: "Hanoi", lat: 21.028511, lng: 105.804817 },
    { name: "Da Nang", lat: 16.047079, lng: 108.206230 },
    { name: "Can Tho", lat: 10.045162, lng: 105.746857 },
    { name: "Hai Phong", lat: 20.844912, lng: 106.688004 }
  ];

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect({
        coords: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        address: selectedLocation.name
      });
      onClose();
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSelectedLocation({
          name: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          lat,
          lng
        });
      },
      (error) => {
        alert("Unable to get current location");
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="map-picker-overlay">
      <div className="map-picker-modal">
        <div className="map-picker-header">
          <h3>
            <MapPin size={20} />
            Select Vehicle Location
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="map-picker-content">
          {/* Current Location Button */}
          <div className="location-controls">
            <button 
              className="current-location-btn" 
              onClick={handleCurrentLocation}
            >
              <Navigation size={16} />
              Use Current Location
            </button>
          </div>

          {/* Preset Locations */}
          <div className="preset-section">
            <h4>Select a city:</h4>
            <div className="preset-grid">
              {presetLocations.map((location, index) => (
                <button
                  key={index}
                  className={`preset-location-btn ${
                    selectedLocation?.name === location.name ? 'selected' : ''
                  }`}
                  onClick={() => handleLocationSelect(location)}
                >
                  <MapPin size={16} />
                  <span>{location.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Location Display */}
          {selectedLocation && (
            <div className="selected-location">
              <div className="location-info">
                <h4>
                  <MapPin size={16} />
                  Selected Location:
                </h4>
                <div className="location-details">
                  <div className="location-name">{selectedLocation.name}</div>
                  <div className="coordinates">
                    Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="map-picker-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="confirm-btn" 
              onClick={handleConfirm}
              disabled={!selectedLocation}
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}