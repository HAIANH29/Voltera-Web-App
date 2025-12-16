import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Navigation,
  MapPin,
  Search,
  Loader2,
  Map,
  Target,
} from "lucide-react";
import "./MapPicker.css";

// Lazy load Leaflet components
let MapContainer, TileLayer, Marker, useMapEvents, L;

const loadLeaflet = async () => {
  if (!MapContainer) {
    const leafletModule = await import("react-leaflet");
    const leafletCore = await import("leaflet");
    await import("leaflet/dist/leaflet.css");

    MapContainer = leafletModule.MapContainer;
    TileLayer = leafletModule.TileLayer;
    Marker = leafletModule.Marker;
    useMapEvents = leafletModule.useMapEvents;
    L = leafletCore.default;

    // Fix default markers in Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }
};

// Custom marker for selected location
const createCustomIcon = () =>
  L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-pin">
    <div class="marker-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>
  </div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
  });

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
    },
  });

  return position ? (
    <Marker position={position} icon={createCustomIcon()} />
  ) : null;
}

export default function MapPicker({
  isOpen,
  onClose,
  onLocationSelect,
  initialCoords,
}) {
  const [position, setPosition] = useState(
    initialCoords
      ? [initialCoords.lat, initialCoords.lng]
      : [10.762622, 106.660172]
  );
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef();
  const searchTimeoutRef = useRef();

  // Load Leaflet when component mounts
  useEffect(() => {
    if (isOpen && !mapLoaded) {
      loadLeaflet()
        .then(() => {
          setMapLoaded(true);
        })
        .catch((error) => {
          // Leaflet loading failed
        });
    }
  }, [isOpen, mapLoaded]);

  const coords = { lat: position[0], lng: position[1] };

  // Reverse geocoding to get address from coordinates
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi,en`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      // Reverse geocoding failed
    }
  };

  // Search for locations
  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&accept-language=vi,en&countrycodes=vn`
      );
      const data = await response.json();
      setSuggestions(data.slice(0, 5));
    } catch (error) {
      // Search failed
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounce search
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(query);
    }, 300);
  };

  // Select suggestion
  const selectSuggestion = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const newPos = [lat, lng];

    setPosition(newPos);
    setAddress(suggestion.display_name);
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);

    // Pan map to new location
    if (mapRef.current) {
      mapRef.current.setView(newPos, 15);
    }
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation không được hỗ trợ trên trình duyệt này");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const newPos = [lat, lng];

        setPosition(newPos);
        getAddressFromCoords(lat, lng);

        // Pan map to current location
        if (mapRef.current) {
          mapRef.current.setView(newPos, 15);
        }

        setIsGettingLocation(false);
      },
      (error) => {
        // Geolocation error
        alert("Cannot get current location. Please allow location access.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Handle position change
  useEffect(() => {
    if (position) {
      getAddressFromCoords(position[0], position[1]);
    }
  }, [position]);

  const handleConfirm = () => {
    onLocationSelect({
      coords: { lat: position[0], lng: position[1] },
      address:
        address || `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`,
    });
    onClose();
  };

  // Fallback for basic location selection without map
  const handleSimpleLocationSet = (lat, lng, addr) => {
    setPosition([lat, lng]);
    setAddress(addr);
  };

  if (!isOpen) return null;

  return (
    <div className="map-picker-overlay">
      <div className="map-picker-modal">
        <div className="map-picker-header">
          <h3>
            <MapPin size={20} />
            Choose your location
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="map-picker-content">
          {/* Search bar */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm địa điểm (ví dụ: Quận 1, TP.HCM)"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              {isSearching && <Loader2 className="search-loading" size={16} />}
            </div>

            {/* Search suggestions */}
            {suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-item"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    <MapPin size={14} />
                    <span>{suggestion.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location controls */}
          <div className="location-controls">
            <button
              className="current-location-btn"
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <>
                  <Loader2 className="spinning" size={16} />
                  Getting location...
                </>
              ) : (
                <>
                  <Navigation size={16} />
                  Sử dụng vị trí hiện tại
                </>
              )}
            </button>
          </div>

          {/* Interactive Map */}
          <div className="map-container">
            {mapLoaded && MapContainer ? (
              <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "400px", width: "100%" }}
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            ) : (
              <div className="map-loading">
                <Loader2 className="spinning" size={32} />
                <p>Loading interactive map...</p>

                {/* Fallback preset locations */}
                <div className="preset-locations">
                  <h4>Or choose a preset location:</h4>
                  <div className="preset-buttons">
                    <button
                      className="preset-btn"
                      onClick={() =>
                        handleSimpleLocationSet(
                          10.762622,
                          106.660172,
                          "Ho Chi Minh City"
                        )
                      }
                    >
                      <MapPin size={14} />
                      Ho Chi Minh City
                    </button>
                    <button
                      className="preset-btn"
                      onClick={() =>
                        handleSimpleLocationSet(21.028511, 105.804817, "Hanoi")
                      }
                    >
                      <MapPin size={14} />
                      Hanoi
                    </button>
                    <button
                      className="preset-btn"
                      onClick={() =>
                        handleSimpleLocationSet(16.047079, 108.20623, "Da Nang")
                      }
                    >
                      <MapPin size={14} />
                      Da Nang
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Map instructions overlay */}
            {mapLoaded && (
              <div className="map-instructions-overlay">
                <div className="instruction-bubble">
                  <Target size={16} />
                  Click trên bản đồ để chọn vị trí
                </div>
              </div>
            )}
          </div>

          {/* Selected location info */}
          <div className="selected-location">
            <div className="location-info">
              <h4>
                <MapPin size={16} />
                Vị trí đã chọn:
              </h4>
              <div className="coordinates">
                <span>
                  Tọa độ: {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </span>
              </div>
              {address && (
                <div className="address">
                  <span>Địa chỉ: {address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="map-picker-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="confirm-btn" onClick={handleConfirm}>
              Xác nhận vị trí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
