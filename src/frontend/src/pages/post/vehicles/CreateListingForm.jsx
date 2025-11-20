import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Car,
  Battery,
  Camera,
  DollarSign,
  Gauge,
  MapPin,
  Map,
  Navigation,
} from "lucide-react";
import toast from "react-hot-toast";
import { listingService } from "../../../services/listing.jsx";
import MapPicker from "../../../components/MapPicker/SimpleMapPicker.jsx";
import "./createListingForm.css";

/** ===================== DATA & HELPERS (stable) ===================== */
const vehicleBrands = [
  "Tesla",
  "BMW",
  "Audi",
  "Mercedes-Benz",
  "Nissan",
  "Chevrolet",
  "Ford",
  "Volkswagen",
  "Hyundai",
  "Kia",
  "Porsche",
  "Jaguar",
  "Volvo",
  "Polestar",
  "Rivian",
  "Lucid",
  "BYD",
  "Genesis",
];
const batteryBrands = [
  "Tesla",
  "CATL",
  "BYD",
  "LG Energy Solution",
  "Panasonic",
  "Samsung SDI",
  "SK Innovation",
  "CALB",
];
const vehicleFeatures = [
  "Autopilot/Self-Driving",
  "Premium Interior",
  "Supercharger Access",
  "Mobile Connectivity",
  "Over-the-Air Updates",
  "Premium Sound System",
  "All-Weather Capability",
  "Advanced Safety Features",
  "Heated Seats",
  "Cooled Seats",
  "Panoramic Roof",
  "Tow Package",
  "Performance Package",
  "FSD Computer",
];
const IMAGE_SLOTS = [
  { key: "front", label: "Front view" },
  { key: "rear", label: "Rear view" },
  { key: "left", label: "Left side" },
  { key: "right", label: "Right side" },
  { key: "dashboard", label: "Dashboard / Interior" },
  { key: "paper", label: "Documents / Registration" },
];

const Card = ({ title, icon, children }) => (
  <div className="v-card">
    {title && (
      <div className="v-card-header">
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
      </div>
    )}
    <div className="v-card-content">{children}</div>
  </div>
);
const L = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="v-label">
    {children}
  </label>
);
const Inp = (props) => (
  <input {...props} className={`v-input ${props.className || ""}`} />
);
const Textarea = (props) => (
  <textarea {...props} className={`v-textarea ${props.className || ""}`} />
);

/** ===================== STEP COMPONENTS (stable, outside) ===================== */
function Step1({
  formData,
  updateFormData,
  setShowMapPicker,
  fieldErrors = {},
}) {
  return (
    <Card title="Basic Information" icon={<Car className="w-5 h-5" />}>
      <div className="v-grid">
        <div>
          <L htmlFor="title">Listing Title *</L>
          <Inp
            id="title"
            placeholder="2021 Tesla Model 3 Long Range"
            value={formData.title ?? ""}
            onChange={(e) => updateFormData("title", e.target.value)}
            className={fieldErrors.title ? "error" : ""}
          />
          {fieldErrors.title && (
            <div className="text-red-500 text-sm mt-1">
              ⚠️ {fieldErrors.title}
            </div>
          )}
        </div>

        <div>
          <L htmlFor="brand">Brand *</L>
          <select
            id="brand"
            className={`v-select ${fieldErrors.brand ? "error" : ""}`}
            value={formData.brand ?? ""}
            onChange={(e) => updateFormData("brand", e.target.value)}
          >
            <option value="">Select brand</option>
            {vehicleBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {fieldErrors.brand && (
            <div className="text-red-500 text-sm mt-1">
              ⚠️ {fieldErrors.brand}
            </div>
          )}
        </div>

        <div>
          <L htmlFor="model">Model *</L>
          <Inp
            id="model"
            placeholder="Model 3"
            value={formData.model ?? ""}
            onChange={(e) => updateFormData("model", e.target.value)}
            className={fieldErrors.model ? "error" : ""}
          />
          {fieldErrors.model && (
            <div className="text-red-500 text-sm mt-1">
              ⚠️ {fieldErrors.model}
            </div>
          )}
        </div>

        <div>
          <L htmlFor="version">Version</L>
          <Inp
            id="version"
            placeholder="Long Range"
            value={formData.version ?? ""}
            onChange={(e) => updateFormData("version", e.target.value)}
            className={fieldErrors.version ? "error" : ""}
          />
          {fieldErrors.version && (
            <div className="text-red-500 text-sm mt-1">
              ⚠️ {fieldErrors.version}
            </div>
          )}
        </div>

        <div>
          <L htmlFor="year">Year *</L>
          <select
            id="year"
            className="v-select"
            value={formData.year ?? ""}
            onChange={(e) => updateFormData("year", e.target.value)}
          >
            <option value="">Select year</option>
            {Array.from(
              { length: 15 },
              (_, i) => new Date().getFullYear() - i
            ).map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <L htmlFor="odo">ODO (km) *</L>
          <div className="relative">
            <Gauge className="v-left-icon" />
            <Inp
              id="odo"
              placeholder="26500"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.odo ?? ""}
              onChange={(e) => updateFormData("odo", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <L htmlFor="color">Color</L>
          <Inp
            id="color"
            placeholder="Pearl White"
            value={formData.color ?? ""}
            onChange={(e) => updateFormData("color", e.target.value)}
            className={fieldErrors.color ? "error" : ""}
          />
          {fieldErrors.color && (
            <div className="text-red-500 text-sm mt-1">
              ⚠️ {fieldErrors.color}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2">
        <L htmlFor="description">Description *</L>
        <Textarea
          id="description"
          rows={4}
          placeholder="Condition, features, service history, etc."
          value={formData.description ?? ""}
          onChange={(e) => updateFormData("description", e.target.value)}
        />
      </div>

      <div className="mt-4">
        <L htmlFor="location">
          Location *{" "}
          <span className="text-sm text-gray-500">
            (Where buyers can find your vehicle)
          </span>
        </L>

        {!formData?.coords ? (
          // No location selected - show picker buttons
          <div className="location-picker-empty">
            <div className="empty-state">
              <div className="empty-icon">
                <MapPin size={32} />
              </div>
              <h4>Choose your vehicle's location</h4>
              <p>Help buyers find you by selecting your location</p>
            </div>

            <div className="picker-buttons">
              <button
                type="button"
                className="location-btn primary"
                onClick={() => setShowMapPicker(true)}
              >
                <span className="btn-icon">
                  <Map size={20} />
                </span>
                <div>
                  <div className="btn-title">Pick on Interactive Map</div>
                  <div className="btn-subtitle">Search and click to select</div>
                </div>
              </button>

              <button
                type="button"
                className="location-btn secondary"
                onClick={() => {
                  if (!navigator.geolocation)
                    return toast.error("Geolocation is not supported");
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      const { latitude: lat, longitude: lng } = pos.coords;
                      updateFormData("coords", { lat, lng });
                      updateFormData(
                        "location",
                        `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                      );
                      toast.success(
                        "Got current location! You can refine it on the map."
                      );
                      // Auto-open map picker to let user refine
                      setTimeout(() => setShowMapPicker(true), 1000);
                    },
                    () => toast.error("Unable to get location")
                  );
                }}
              >
                <span className="btn-icon">
                  <Navigation size={20} />
                </span>
                <div>
                  <div className="btn-title">Use Current Location</div>
                  <div className="btn-subtitle">Auto-detect from GPS</div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          // Location selected - show preview
          <div className="location-selected">
            <div className="location-preview">
              <div className="location-header">
                <span className="location-icon">
                  <MapPin size={20} />
                </span>
                <div className="location-details">
                  <div className="location-address">{formData.location}</div>
                  <div className="location-coords">
                    {formData.coords.lat.toFixed(6)},{" "}
                    {formData.coords.lng.toFixed(6)}
                  </div>
                </div>
                <div className="location-status">
                  <span className="status-badge">✓ Selected</span>
                </div>
              </div>
            </div>

            <div className="location-actions">
              <button
                type="button"
                className="change-location-btn"
                onClick={() => setShowMapPicker(true)}
              >
                <Map size={16} />
                Change Location
              </button>
              <button
                type="button"
                className="clear-location-btn"
                onClick={() => {
                  updateFormData("coords", null);
                  updateFormData("location", "");
                  toast.success("Location cleared");
                }}
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function Step2({ formData, updateFormData, fieldErrors = {} }) {
  return (
    <Card title="Vehicle Details" icon={<Battery className="w-5 h-5" />}>
      <div className="v-grid">
        <div>
          <L htmlFor="style">Style</L>
          <select
            id="style"
            className={`v-select ${fieldErrors.style ? "error" : ""}`}
            value={formData.style ?? ""}
            onChange={(e) => updateFormData("style", e.target.value)}
          >
            <option value="">Select style</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Coupe">Coupe</option>
            <option value="Convertible">Convertible</option>
            <option value="Pickup">Pickup</option>
            <option value="Van">Van</option>
          </select>
          {fieldErrors.style && (
            <div className="text-red-500 text-sm mt-1">
              ⚠️ {fieldErrors.style}
            </div>
          )}
        </div>

        <div>
          <L htmlFor="numberOfSeats">Number of Seats</L>
          <select
            id="numberOfSeats"
            className="v-select"
            value={formData.numberOfSeats ?? ""}
            onChange={(e) => updateFormData("numberOfSeats", e.target.value)}
          >
            <option value="">Select seats</option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>

        <div>
          <L htmlFor="origin">Origin</L>
          <Inp
            id="origin"
            placeholder="Germany, USA, China..."
            value={formData.origin ?? ""}
            onChange={(e) => updateFormData("origin", e.target.value)}
          />
        </div>

        <div>
          <L htmlFor="licensePlate">License Plate</L>
          <Inp
            id="licensePlate"
            placeholder="30A-1234"
            value={formData.licensePlate ?? ""}
            onChange={(e) => updateFormData("licensePlate", e.target.value)}
            className={fieldErrors.licensePlate ? "error" : ""}
          />
          {fieldErrors.licensePlate && (
            <div className="text-red-500 text-sm mt-1">
              ⚠️ {fieldErrors.licensePlate}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            Vietnamese format: 30A-1234 or 51B-123 (max 8 chars)
          </div>
        </div>

        <div>
          <L htmlFor="batteryCapacity">Battery Capacity (kWh)</L>
          <Inp
            id="batteryCapacity"
            inputMode="numeric"
            step="0.1"
            placeholder="75.5"
            value={formData.batteryCapacity ?? ""}
            onChange={(e) => updateFormData("batteryCapacity", e.target.value)}
            className={fieldErrors.batteryCapacity ? "error" : ""}
          />
          {fieldErrors.batteryCapacity && (
            <div className="text-red-500 text-sm mt-1">
              ⚠️ {fieldErrors.batteryCapacity}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            Typical EV battery: 40-150 kWh
          </div>
        </div>

        <div>
          <L htmlFor="range">Range (km)</L>
          <Inp
            id="range"
            inputMode="numeric"
            placeholder="450"
            value={formData.range ?? ""}
            onChange={(e) => updateFormData("range", e.target.value)}
            className={fieldErrors.range ? "error" : ""}
          />
          {fieldErrors.range && (
            <div className="text-red-500 text-sm mt-1">
              ⚠️ {fieldErrors.range}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            Typical EV range: 200-600km
          </div>
        </div>

        <div>
          <L htmlFor="chargingTime">Charging Time (hours)</L>
          <Inp
            id="chargingTime"
            inputMode="numeric"
            placeholder="8"
            value={formData.chargingTime ?? ""}
            onChange={(e) => updateFormData("chargingTime", e.target.value)}
            className={fieldErrors.chargingTime ? "error" : ""}
          />
          {fieldErrors.chargingTime && (
            <div className="text-red-500 text-sm mt-1">
              ⚠️ {fieldErrors.chargingTime}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            Fast charge: 0.5-2h, Standard: 6-12h
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="v-grid">
          <div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!formData.bodyInsurance}
                onChange={(e) =>
                  updateFormData("bodyInsurance", e.target.checked)
                }
              />
              <span>Body Insurance</span>
            </label>
          </div>

          <div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!formData.vehicleInspection}
                onChange={(e) =>
                  updateFormData("vehicleInspection", e.target.checked)
                }
              />
              <span>Vehicle Inspection</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div>
          <L htmlFor="price">Price (USD) *</L>
          <div className="relative">
            <DollarSign className="v-left-icon" />
            <Inp
              id="price"
              placeholder="42000"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.price ?? ""}
              onChange={(e) => updateFormData("price", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <label className="mt-3 inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!formData.acceptOffers}
            onChange={(e) => updateFormData("acceptOffers", e.target.checked)}
          />
          <span>Accept offers from buyers</span>
        </label>
      </div>

      <div className="mt-6">
        <L>Delivery Options</L>
        {[
          {
            id: "pickup",
            label: "Local Pickup",
            desc: "Buyer picks up at your location",
          },
          {
            id: "delivery-local",
            label: "Local Delivery",
            desc: "Within ~12km",
          },
          {
            id: "shipping",
            label: "Nationwide Shipping",
            desc: "Across Vietnam",
          },
        ].map((o) => (
          <label key={o.id} className="v-check-row">
            <input
              type="checkbox"
              checked={(formData.deliveryOptions || []).includes(o.id)}
              onChange={(e) => {
                const checked = e.target.checked;
                const cur = formData.deliveryOptions || [];
                updateFormData(
                  "deliveryOptions",
                  checked ? [...cur, o.id] : cur.filter((x) => x !== o.id)
                );
              }}
            />
            <div className="flex-1">
              <div className="font-medium">{o.label}</div>
              <div className="text-sm text-muted-foreground">{o.desc}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4">
        <L>Features & Options</L>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {vehicleFeatures.map((f) => (
            <label key={f} className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={(formData.features || []).includes(f)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const cur = formData.features || [];
                  updateFormData(
                    "features",
                    checked ? [...cur, f] : cur.filter((x) => x !== f)
                  );
                }}
              />
              {f}
            </label>
          ))}
        </div>
        <div className="mt-3">
          <L htmlFor="customFeatures">Additional Features</L>
          <Textarea
            id="customFeatures"
            rows={3}
            placeholder="List any additional features…"
            value={formData.customFeatures ?? ""}
            onChange={(e) => updateFormData("customFeatures", e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}

// ==== STEP 3 - Optimized Photo Upload (Auto-titles, Better UX) ====
const Step3 = ({
  formData,
  setImageForSlot,
  removeImageForSlot,
  handleUploadForSlot,
  uploadingSlot,
  uploadProgress,
}) => {
  const getImg = (slot) => (formData.images || []).find((i) => i.slot === slot);

  return (
    <Card title="Vehicle Photos" icon={<Camera className="w-5 h-5" />}>
      {/* Helpful intro */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Camera className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              📸 Photo Tips for Better Sales
            </h4>
            <p className="text-sm text-blue-700 mb-2">
              Quality photos get 3x more interest! Each photo is automatically
              labeled for you.
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>
                • <strong>First photo will be your main thumbnail</strong> -
                make it count!
              </li>
              <li><strong>• Upload at least 3 photos (REQUIRED)</strong> for your listing to be accepted</li>
              <li>• Take photos in good lighting (daytime/well-lit garage)</li>
              <li>• Clean your vehicle before photographing</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="photos-grid">
        {IMAGE_SLOTS.map(({ key, label }, index) => {
          const it = getImg(key) || { title: label, url: "" }; // Auto-use predefined label as title

          return (
            <div key={key} className="photo-slot">
              {/* Auto-generated label */}
              <div className="flex items-center justify-between mb-3">
                <L className="font-medium text-gray-700">{label}</L>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {index === 0 ? "Main Photo" : `Photo ${index + 1}`}
                </span>
              </div>

              {/* Hidden file input */}
              <input
                id={`up-${key}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Auto-set title to predefined label when uploading
                    setImageForSlot(key, { title: label });
                    handleUploadForSlot(key, file);
                  }
                }}
              />

              <div className="v-dropzone improved">
                {it.url ? (
                  <>
                    <img
                      src={it.url}
                      alt={label}
                      onClick={() =>
                        document.getElementById(`up-${key}`)?.click()
                      }
                      className="uploaded-image"
                    />

                    <div className="v-overlay-actions">
                      <button
                        type="button"
                        className="v-btn-mini primary"
                        onClick={() =>
                          document.getElementById(`up-${key}`)?.click()
                        }
                        title="Replace this photo"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        className="v-btn-mini danger"
                        onClick={() => removeImageForSlot(key)}
                        title="Remove this photo"
                      >
                        Remove
                      </button>
                    </div>

                    <button
                      type="button"
                      className="v-chip-remove"
                      onClick={() => removeImageForSlot(key)}
                      title="Remove photo"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Success indicator */}
                    <div className="upload-success-badge">✓ Uploaded</div>
                  </>
                ) : (
                  <label
                    htmlFor={`up-${key}`}
                    className="v-empty-upload enhanced"
                  >
                    <div className="upload-icon-container">
                      <Upload className="h-12 w-12" />
                    </div>
                    <div className="upload-text">
                      <span className="upload-main">
                        Click to add {label.toLowerCase()}
                      </span>
                      <span className="upload-sub">JPG, PNG up to 10MB</span>
                    </div>
                    <div className="upload-hint">
                      {index === 0 && "🌟 Main thumbnail photo"}
                      {index === 1 && "📐 Show full rear view"}
                      {index === 2 && "📱 Profile/side angle"}
                      {index === 3 && "📱 Other side view"}
                      {index === 4 && "🏠 Interior & dashboard"}
                      {index === 5 && "📄 Papers & documents"}
                    </div>
                  </label>
                )}

                {uploadingSlot === key && (
                  <div className="upload-progress-overlay">
                    <div className="upload-progress-content">
                      <div className="upload-spinner"></div>
                      <div className="upload-progress-text">
                        <span>Uploading...</span>
                        <span className="font-semibold">{uploadProgress}%</span>
                      </div>
                      <div className="v-progress">
                        <div style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="mt-6">
        {formData.images?.length >= 3 ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-semibold">
                    {formData.images.length}
                  </span>
                </div>
                <span className="text-green-800 font-medium">
                  {formData.images.length} photo
                  {formData.images.length !== 1 ? "s" : ""} uploaded
                </span>
              </div>
              <span className="text-xs text-green-600 font-medium">
                ✅ Great coverage! Ready to proceed
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm font-semibold">
                    {formData.images?.length || 0}
                  </span>
                </div>
                <span className="text-orange-800 font-medium">
                  {formData.images?.length || 0} photo
                  {(formData.images?.length || 0) !== 1 ? "s" : ""} uploaded
                </span>
              </div>
              <span className="text-xs text-orange-600 font-medium">
                ⚠️ Need {3 - (formData.images?.length || 0)} more photos (minimum 3 required)
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

function Step4({ formData, updateFormData }) {
  const totalPhotos = formData.images?.length || 0;
  const hasMainPhoto = formData.images?.[0]?.url;

  return (
    <Card title="Final Review & Submit" icon={<Car className="w-5 h-5" />}>
      {/* Enhanced Review Section */}
      <div className="review-summary">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Vehicle Info */}
          <div className="vehicle-summary">
            <div className="summary-header">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vehicle Summary
              </h3>
            </div>

            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Title</span>
                <span className="summary-value">{formData.title || "—"}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Vehicle</span>
                <span className="summary-value">
                  {formData.brand} {formData.model} {formData.version}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Year</span>
                <span className="summary-value">{formData.year || "—"}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Mileage</span>
                <span className="summary-value">
                  {formData.odo
                    ? `${parseInt(formData.odo).toLocaleString()} km`
                    : "—"}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Price</span>
                <span className="summary-value price">
                  ${parseInt(formData.price || "0").toLocaleString()}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Location</span>
                <span className="summary-value">
                  {formData.location || "—"}
                </span>
              </div>
              {formData.batteryCapacity && (
                <div className="summary-item">
                  <span className="summary-label">Battery</span>
                  <span className="summary-value">
                    {formData.batteryCapacity} kWh
                  </span>
                </div>
              )}
              {formData.range && (
                <div className="summary-item">
                  <span className="summary-label">Range</span>
                  <span className="summary-value">{formData.range} km</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="listing-preview">
            <div className="preview-header">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Listing Preview
              </h3>
            </div>

            {hasMainPhoto ? (
              <div className="preview-card">
                <div className="preview-image">
                  <img
                    src={formData.images[0].url}
                    alt="Main preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="photo-count-badge">
                    📸 {totalPhotos} photo{totalPhotos !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className="preview-content">
                  <div className="preview-title">{formData.title}</div>
                  <div className="preview-price">
                    ${parseInt(formData.price || "0").toLocaleString()}
                  </div>
                  <p className="preview-description">
                    {(formData.description || "").slice(0, 100)}
                    {formData.description?.length > 100 ? "..." : ""}
                  </p>
                </div>
              </div>
            ) : (
              <div className="preview-placeholder">
                <Camera className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-gray-500">No photos uploaded</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacious Divider */}
      <div className="confirmation-divider">
        <div className="divider-line"></div>
        <span className="divider-text">Final Confirmation</span>
        <div className="divider-line"></div>
      </div>

      {/* Enhanced Confirmation Section */}
      <div className="confirmation-section">
        <div className="confirmation-intro">
          <h3 className="confirmation-title">Before You Submit</h3>
          <p className="confirmation-subtitle">
            Please review and confirm the following to complete your listing
          </p>
        </div>

        <div className="confirmation-checklist">
          {/* Ownership Confirmation */}
          <div className="confirmation-item">
            <label className="confirmation-checkbox">
              <input
                type="checkbox"
                checked={!!formData.confirmOwnership}
                onChange={(e) =>
                  updateFormData("confirmOwnership", e.target.checked)
                }
                className="checkbox-input"
              />
              <div className="checkbox-custom">
                <div className="checkbox-checkmark">✓</div>
              </div>
              <div className="checkbox-content">
                <div className="checkbox-title">
                  Vehicle Ownership Verification
                </div>
                <div className="checkbox-description">
                  I confirm that I am the legal owner of this vehicle and have
                  the right to sell it
                </div>
              </div>
            </label>
          </div>

          {/* Terms Agreement */}
          <div className="confirmation-item">
            <label className="confirmation-checkbox">
              <input
                type="checkbox"
                checked={!!formData.agreeTerms}
                onChange={(e) => updateFormData("agreeTerms", e.target.checked)}
                className="checkbox-input"
              />
              <div className="checkbox-custom">
                <div className="checkbox-checkmark">✓</div>
              </div>
              <div className="checkbox-content">
                <div className="checkbox-title">
                  Terms & Guidelines Agreement
                </div>
                <div className="checkbox-description">
                  I agree to Voltera's{" "}
                  <a href="/terms" className="terms-link">
                    Terms of Service
                  </a>{" "}
                  and
                  <a href="/guidelines" className="terms-link">
                    {" "}
                    Listing Guidelines
                  </a>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="submission-status">
          {formData.confirmOwnership && formData.agreeTerms ? (
            <div className="status-ready">
              <div className="status-icon ready">✓</div>
              <div className="status-text">
                <div className="status-title">Ready to Submit</div>
                <div className="status-description">
                  Your listing will be reviewed within 24 hours
                </div>
              </div>
            </div>
          ) : (
            <div className="status-pending">
              <div className="status-icon pending">⏳</div>
              <div className="status-text">
                <div className="status-title">
                  Complete Required Confirmations
                </div>
                <div className="status-description">
                  Please check both boxes above to proceed
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/** ===================== MAIN ===================== */
export default function CreateListingForm({
  listingType = "vehicle",
  currentUser = null,
  onSubmit = () => {},
}) {
  const navigate = useNavigate();
  useEffect(() => {
    console.info("[CreateListingForm] mounted", { listingType });
    return () => console.info("[CreateListingForm] unmounted", { listingType });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const DRAFT_KEY = `voltera.draft.${listingType}`;

  const initialDraft = useMemo(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      title: "",
      brand: "",
      model: "",
      version: "",
      year: "",
      description: "",
      location: "",
      coords: null,
      odo: "",
      color: "",
      style: "",
      numberOfSeats: "",
      origin: "",
      licensePlate: "",
      batteryCapacity: "",
      range: "",
      chargingTime: "",
      bodyInsurance: false,
      vehicleInspection: false,
      price: "",
      acceptOffers: true,
      deliveryOptions: [],
      features: [],
      customFeatures: "",
      images: [],
      documents: [],
      agreeTerms: false,
      confirmOwnership: false,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [formData, setFormData] = useState(initialDraft);
  const [fieldErrors, setFieldErrors] = useState({});

  const saveTimer = useRef(null);
  useEffect(() => {
    if (step <= 3) {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
        } catch {}
      }, 300);
    }
    return () => clearTimeout(saveTimer.current);
  }, [formData, step, DRAFT_KEY]);

  const updateFormData = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value ?? "" }));

    // Real-time validation
    const validation = validateField(field, value);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: validation.isValid ? null : validation.message,
    }));
  };

  // Validation helpers for real-time feedback
  const validateLicensePlate = (value) => {
    if (!value) return { isValid: true, message: "" };

    // Vietnamese license plate formats that fit in 8 characters max:
    // Format 1: 30A-1234 (8 chars) - 2 digits + 1 letter + dash + 4 digits
    // Format 2: 51B-123 (7 chars) - 2 digits + 1 letter + dash + 3 digits
    const pattern = /^[0-9]{2}[A-Z]{1}-[0-9]{3,4}$/;

    if (value.length > 8) {
      return {
        isValid: false,
        message: "Maximum 8 characters",
      };
    }

    if (!pattern.test(value)) {
      return {
        isValid: false,
        message: "Format: 30A-1234 or 51B-123",
      };
    }

    return { isValid: true, message: "" };
  };

  const validateField = (key, value) => {
    switch (key) {
      case "licensePlate":
        return validateLicensePlate(value);
      case "range":
        if (
          value &&
          (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 600)
        ) {
          return {
            isValid: false,
            message: "Range must be 0-600 km (realistic for EVs)",
          };
        }
        return { isValid: true, message: "" };
      case "batteryCapacity":
        if (
          value &&
          (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 200)
        ) {
          return {
            isValid: false,
            message: "Battery capacity must be 0-200 kWh",
          };
        }
        return { isValid: true, message: "" };
      case "chargingTime":
        if (
          value &&
          (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 24)
        ) {
          return {
            isValid: false,
            message: "Charging time must be 0-24 hours",
          };
        }
        return { isValid: true, message: "" };
      case "title":
        return value && value.length > 255
          ? { isValid: false, message: "Maximum 255 characters" }
          : { isValid: true, message: "" };
      case "brand":
      case "model":
        return value && value.length > 100
          ? { isValid: false, message: "Maximum 100 characters" }
          : { isValid: true, message: "" };
      case "version":
      case "color":
      case "style":
        return value && value.length > 50
          ? { isValid: false, message: "Maximum 50 characters" }
          : { isValid: true, message: "" };
      default:
        return { isValid: true, message: "" };
    }
  };

  const validateCurrentStep = () => {
    const errors = {};

    if (step === 1) {
      // Required fields for Step 1
      if (!formData.title?.trim()) errors.title = "Title is required";
      if (!formData.brand?.trim()) errors.brand = "Brand is required";
      if (!formData.model?.trim()) errors.model = "Model is required";

      // Length validations
      if (formData.title && formData.title.length > 255)
        errors.title = "Maximum 255 characters";
      if (formData.brand && formData.brand.length > 100)
        errors.brand = "Maximum 100 characters";
      if (formData.model && formData.model.length > 100)
        errors.model = "Maximum 100 characters";
      if (formData.version && formData.version.length > 50)
        errors.version = "Maximum 50 characters";
      if (formData.color && formData.color.length > 50)
        errors.color = "Maximum 50 characters";
    }

    if (step === 2) {
      // License plate validation
      if (formData.licensePlate) {
        const lpValidation = validateLicensePlate(formData.licensePlate);
        if (!lpValidation.isValid) errors.licensePlate = lpValidation.message;
      }

      // Numeric field validations
      if (
        formData.range &&
        (isNaN(formData.range) ||
          parseInt(formData.range) < 0 ||
          parseInt(formData.range) > 600)
      ) {
        errors.range = "Range must be 0-600 km (realistic for EVs)";
      }
      if (
        formData.batteryCapacity &&
        (isNaN(formData.batteryCapacity) ||
          parseFloat(formData.batteryCapacity) < 0 ||
          parseFloat(formData.batteryCapacity) > 200)
      ) {
        errors.batteryCapacity = "Battery capacity must be 0-200 kWh";
      }
      if (
        formData.chargingTime &&
        (isNaN(formData.chargingTime) ||
          parseInt(formData.chargingTime) < 0 ||
          parseInt(formData.chargingTime) > 24)
      ) {
        errors.chargingTime = "Charging time must be 0-24 hours";
      }

      if (formData.style && formData.style.length > 50)
        errors.style = "Maximum 50 characters";
    }

    return errors;
  };

  const setImageForSlot = (slotKey, patch) => {
    const imgs = [...(formData.images || [])];
    const idx = imgs.findIndex((i) => i.slot === slotKey);
    if (idx === -1) imgs.push({ slot: slotKey, title: "", url: "", ...patch });
    else imgs[idx] = { ...imgs[idx], ...patch };
    updateFormData("images", imgs);
  };
  const removeImageForSlot = (slotKey) =>
    updateFormData(
      "images",
      (formData.images || []).filter((i) => i.slot !== slotKey)
    );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleUploadForSlot = async (slotKey, file) => {
    if (!file) return;
    setUploadingSlot(slotKey);
    try {
      // debug: log target upload endpoint
      // eslint-disable-next-line no-console
      console.debug(
        "Uploading file to:",
        `${
          import.meta.env.VITE_BACK_END_BASE_URL
        }/api/upload/product?folder=product`
      );
      const url = await listingService.uploadImageOne(
        file,
        "product",
        setUploadProgress
      );
      setImageForSlot(slotKey, { url });
      toast.success("Image uploaded");
    } catch {
      // show more detailed error where possible
      // eslint-disable-next-line no-console
      console.error("Image upload error:", arguments[0] || "unknown");
      const err = arguments[0];
      const msg = err?.response?.data || err?.message || "Image upload failed";
      toast.error(String(msg));
    } finally {
      setUploadingSlot(null);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    console.info(`[CreateListingForm] step changed -> ${step}`);
  }, [step]);

  const submitForm = async () => {
    // Ngăn submit nhiều lần
    if (isSubmitting) return;
    
    if (!formData.agreeTerms || !formData.confirmOwnership)
      return toast.error("Please confirm ownership and accept the terms");
    if (!formData.title || !formData.brand || !formData.model || !formData.year)
      return toast.error("Please fill all required fields");
    if (!formData.price || Number(formData.price) <= 0)
      return toast.error("Please enter a valid price");

    // License plate format validation (Vietnamese format)
    if (formData.licensePlate) {
      if (formData.licensePlate.length > 8) {
        return toast.error("License plate must be 8 characters or less");
      }
      const licensePlatePattern = /^[0-9]{2}[A-Z]{1}-[0-9]{3,4}$/;
      if (!licensePlatePattern.test(formData.licensePlate)) {
        return toast.error(
          "License plate must follow Vietnamese format (e.g., 30A-1234 or 51B-123)"
        );
      }
    }

    // Field length validations
    if (formData.title && formData.title.length > 255)
      return toast.error("Title must be 255 characters or less");
    if (formData.brand && formData.brand.length > 100)
      return toast.error("Brand must be 100 characters or less");
    if (formData.model && formData.model.length > 100)
      return toast.error("Model must be 100 characters or less");
    if (formData.version && formData.version.length > 50)
      return toast.error("Version must be 50 characters or less");
    if (formData.color && formData.color.length > 50)
      return toast.error("Color must be 50 characters or less");
    if (formData.style && formData.style.length > 50)
      return toast.error("Style must be 50 characters or less");
    if (formData.origin && formData.origin.length > 255)
      return toast.error("Origin must be 255 characters or less");

    // Numeric validations
    if (
      formData.year &&
      (formData.year < 1900 || formData.year > new Date().getFullYear() + 2)
    ) {
      return toast.error(
        `Year must be between 1900 and ${new Date().getFullYear() + 2}`
      );
    }
    if (formData.odo && formData.odo < 0)
      return toast.error("Odometer reading cannot be negative");
    if (formData.range && (formData.range < 0 || formData.range > 600))
      return toast.error(
        "Range must be between 0 and 600 km (realistic for electric vehicles)"
      );
    if (
      formData.numberOfSeats &&
      (formData.numberOfSeats < 1 || formData.numberOfSeats > 7)
    )
      return toast.error("Number of seats must be between 1 and 7");

    const imgs = formData.images || [];
    if (imgs.length === 0)
      return toast.error("Please upload at least 3 photos of your vehicle");
    if (imgs.length < 3)
      return toast.error(`Please upload at least 3 photos of your vehicle. You currently have ${imgs.length} photo${imgs.length !== 1 ? 's' : ''}.`);
    if (imgs.some((i) => !i.url))
      return toast.error("Please wait for all photos to finish uploading.");

    // Bắt đầu submit
    setIsSubmitting(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      price: formData.price ? formData.price.toString() : "0",
      status: "PENDING",
      battery: null,
      batteryImages: [],
      vehicle: {
        brand: formData.brand || "",
        model: formData.model || "",
        version: formData.version || "",
        odo: formData.odo ? parseInt(formData.odo) : 0,
        batterycapacity: formData.batteryCapacity
          ? formData.batteryCapacity.toString()
          : "0",
        range: formData.range ? Math.min(parseInt(formData.range), 600) : 0,
        chargingtime: formData.chargingTime
          ? parseInt(formData.chargingTime)
          : 0,
        color: formData.color || "",
        numberofseat: formData.numberOfSeats
          ? Math.min(parseInt(formData.numberOfSeats), 7)
          : 4,
        style: formData.style || "",
        bodyinsurance: !!formData.bodyInsurance,
        vehicleinspection: !!formData.vehicleInspection,
        licenseplate:
          formData.licensePlate ||
          (() => {
            // Generate Vietnamese license plate format: 30A-1234 (8 chars max)
            const digits = Math.floor(Math.random() * 90) + 10; // 10-99
            const letter = String.fromCharCode(
              65 + Math.floor(Math.random() * 26)
            ); // A-Z
            const numbers = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
            return `${digits}${letter}-${numbers}`;
          })(),
        origin: formData.origin || "",
        yearmanufacture: formData.year
          ? parseInt(formData.year)
          : new Date().getFullYear(),
      },
      vehicleImages: imgs.map((i) => i.url),
    };

    try {
      // Debug payload structure
      console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

      // Check authentication
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
      };

      const token = getCookie("accessToken");
      console.log("🔐 Auth token present:", !!token);
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const created = await listingService.createPost(payload);
      toast.success(
        "Vehicle posted successfully! Your listing is pending admin approval."
      );

      // Đánh dấu submit thành công và disable nút 10 giây
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 10000);

      // Clear draft
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}

      // Call onSubmit callback
      onSubmit(created || payload);

      // Navigate to home after a short delay
      setTimeout(() => {
        navigate("/", {
          replace: true,
          state: {
            message:
              "Your vehicle listing has been submitted for review. You'll be notified once it's approved.",
          },
        });
      }, 2000);
    } catch (e) {
      console.error("❌ Submit error:", e);
      console.error("❌ Response data:", e?.response?.data);
      console.error("❌ Status:", e?.response?.status);
      console.error("❌ Headers:", e?.response?.headers);

      const errorData = e?.response?.data;
      let msg = "Failed to create listing";

      if (errorData) {
        if (typeof errorData === "string") {
          msg = errorData;
        } else if (errorData.message) {
          msg = errorData.message;
        } else if (errorData.error) {
          msg = errorData.error;
        } else {
          msg = `Server error: ${JSON.stringify(errorData)}`;
        }
      } else if (e?.message) {
        msg = e.message;
      }

      toast.error(msg);
    } finally {
      // Luôn reset trạng thái submit
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            formData={formData}
            updateFormData={updateFormData}
            setShowMapPicker={setShowMapPicker}
            fieldErrors={fieldErrors}
          />
        );
      case 2:
        return (
          <Step2
            formData={formData}
            updateFormData={updateFormData}
            fieldErrors={fieldErrors}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData}
            setImageForSlot={setImageForSlot}
            removeImageForSlot={removeImageForSlot}
            handleUploadForSlot={handleUploadForSlot}
            uploadingSlot={uploadingSlot}
            uploadProgress={uploadProgress}
          />
        );
      case 4:
        return <Step4 formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  const handleLocationSelect = (locationData) => {
    updateFormData("coords", locationData.coords);
    updateFormData("location", locationData.address);
    toast.success("Location selected successfully!");
  };

  // ✅ form wrapper ngăn submit ngầm (tránh remount)
  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="vehicle-wizard space-y-6"
      >
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="v-progress">
            <div
              className="progress-fill"
              style={{
                width: `${(step / 4) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #1877F2 0%, #166fe5 100%)",
                borderRadius: "999px",
                transition: "width 0.35s ease",
              }}
            />
          </div>
        </div>

        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            className="v-btn v-btn-outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Previous
          </button>
          {step === 4 ? (
            <button
              className={`v-btn v-btn-primary ${(isSubmitting || submitSuccess) ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={submitForm}
              disabled={!formData.agreeTerms || !formData.confirmOwnership || isSubmitting || submitSuccess}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Submitting...
                </>
              ) : submitSuccess ? (
                'Successfully Submitted!'
              ) : (
                'Submit Listing'
              )}
            </button>
          ) : (
            <button
              className="v-btn v-btn-primary"
              onClick={() => {
                const stepErrors = validateCurrentStep();
                if (Object.keys(stepErrors).length > 0) {
                  setFieldErrors((prev) => ({ ...prev, ...stepErrors }));
                  toast.error("Please fix the errors before continuing");
                  return;
                }
                
                // Kiểm tra yêu cầu tối thiểu 3 ảnh khi chuyển từ step 3 sang step 4
                if (step === 3) {
                  const imgCount = formData.images?.length || 0;
                  if (imgCount < 3) {
                    toast.error(`Please upload at least 3 photos to continue. You currently have ${imgCount} photo${imgCount !== 1 ? 's' : ''}.`);
                    return;
                  }
                }
                
                setStep((s) => Math.min(4, s + 1));
              }}
            >
              Next
            </button>
          )}
        </div>
      </form>

      {/* Map Picker Modal */}
      <MapPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onLocationSelect={handleLocationSelect}
        initialCoords={formData.coords}
      />
    </>
  );
}
