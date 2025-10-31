import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Battery, Camera, DollarSign, Zap, Settings, MapPin, Navigation, Map } from "lucide-react";
import toast from "react-hot-toast";
import { listingService } from "../../../services/listing.jsx";
import MapPicker from "../../../components/MapPicker/SimpleMapPicker.jsx";
import "./createElectricForm.css";

/** ===================== DATA & HELPERS ===================== */
const batteryBrands = ["Tesla","CATL","BYD","LG Energy Solution","Panasonic","Samsung SDI","SK Innovation","CALB"];
const batteryChemistry = ["NMC","LFP","NCA","NCM811","Other"];
const connectorTypes = ["NACS","CCS","CHAdeMO","Custom"];
const conditionOptions = ["excellent","very-good","good","fair","poor"];

const ELECTRIC_IMAGE_SLOTS = [
  { key: "battery-main",     label: "Battery Pack - Main View" },
  { key: "battery-side",     label: "Battery Pack - Side View" },
  { key: "battery-terminals", label: "Battery Terminals/Connections" },
  { key: "battery-label",    label: "Battery Label/Serial Number" },
  { key: "bms-system",       label: "BMS (Battery Management System)" },
  { key: "documentation",    label: "Certificates & Documentation" },
];

const Card = ({ title, icon, children }) => (
  <div className="e-card">
    {title && (
      <div className="e-card-header">
        <div className="flex items-center gap-2">{icon}<span>{title}</span></div>
      </div>
    )}
    <div className="e-card-content">{children}</div>
  </div>
);

const L = ({ htmlFor, children }) => <label htmlFor={htmlFor} className="e-label">{children}</label>;
const Inp = (props) => <input {...props} className={`e-input ${props.className || ""}`} />;
const Textarea = (props) => <textarea {...props} className={`e-textarea ${props.className || ""}`} />;

/** ===================== STEP COMPONENTS ===================== */
function Step1({ formData, updateFormData, setShowMapPicker, fieldErrors = {} }) {
  return (
    <Card title="Basic Information" icon={<Battery className="w-5 h-5" />}>
      <div className="e-grid">
        <div>
          <L htmlFor="title">Battery Pack Title *</L>
          <Inp id="title" placeholder="Tesla Model S 100kWh Battery Pack - Excellent Condition"
               value={formData.title ?? ""} onChange={(e)=>updateFormData("title", e.target.value)} 
               className={fieldErrors.title ? 'error' : ''} />
          {fieldErrors.title && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.title}</div>}
        </div>

        <div>
          <L htmlFor="brand">Battery Brand *</L>
          <select id="brand" className={`e-select ${fieldErrors.brand ? 'error' : ''}`}
                  value={formData.brand ?? ""} onChange={(e)=>updateFormData("brand", e.target.value)}>
            <option value="">Select battery brand</option>
            {batteryBrands.map(b=><option key={b} value={b}>{b}</option>)}
          </select>
          {fieldErrors.brand && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.brand}</div>}
        </div>

        <div>
          <L htmlFor="model">Battery Model *</L>
          <Inp id="model" placeholder="Model S Battery Pack"
               value={formData.model ?? ""} onChange={(e)=>updateFormData("model", e.target.value)} 
               className={fieldErrors.model ? 'error' : ''} />
          {fieldErrors.model && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.model}</div>}
        </div>

        <div>
          <L htmlFor="year">Manufacturing Year *</L>
          <select id="year" className="e-select"
                  value={formData.year ?? ""} onChange={(e)=>updateFormData("year", e.target.value)}>
            <option value="">Select year</option>
            {Array.from({length:15},(_,i)=>new Date().getFullYear()-i).map(y=><option key={y} value={String(y)}>{y}</option>)}
          </select>
        </div>

        <div>
          <L htmlFor="condition">Overall Condition *</L>
          <select id="condition" className="e-select"
                  value={formData.condition ?? ""} onChange={(e)=>updateFormData("condition", e.target.value)}>
            <option value="">Select condition</option>
            {conditionOptions.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>)}
          </select>
        </div>

        <div>
          <L htmlFor="serialNumber">Serial Number</L>
          <Inp id="serialNumber" placeholder="SN-ABC123XYZ"
               value={formData.serialNumber ?? ""} onChange={(e)=>updateFormData("serialNumber", e.target.value)} />
        </div>
      </div>

      <div className="mt-4">
        <L htmlFor="description">Description *</L>
        <Textarea id="description" rows={4}
                  placeholder="Describe battery condition, usage history, any maintenance, compatibility, etc."
                  value={formData.description ?? ""} onChange={(e)=>updateFormData("description", e.target.value)} />
      </div>

      {/* Location Section */}
      <div className="mt-6">
        <L htmlFor="location">Location * <span className="text-sm text-gray-500">(Where buyers can inspect/collect the battery)</span></L>
        
        {!formData?.coords ? (
          <div className="location-picker-empty">
            <div className="empty-state">
              <div className="empty-icon">
                <MapPin size={32} />
              </div>
              <h4>Set Battery Location</h4>
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
                onClick={()=>{
                  if (!navigator.geolocation) return toast.error("Geolocation is not supported");
                  navigator.geolocation.getCurrentPosition(
                    (pos)=>{
                      const { latitude:lat, longitude:lng } = pos.coords;
                      updateFormData("coords", { lat, lng });
                      updateFormData("location", `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                      toast.success("Got current location! You can refine it on the map.");
                      setTimeout(() => setShowMapPicker(true), 1000);
                    },
                    ()=> toast.error("Unable to get location")
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
          <div className="location-selected">
            <div className="location-preview">
              <div className="location-header">
                <span className="location-icon">
                  <MapPin size={20} />
                </span>
                <div className="location-details">
                  <div className="location-address">{formData.location}</div>
                  <div className="location-coords">
                    {formData.coords.lat.toFixed(6)}, {formData.coords.lng.toFixed(6)}
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
    <Card title="Technical Specifications" icon={<Zap className="w-5 h-5" />}>
      <div className="e-grid">
        <div>
          <L htmlFor="originCapacity">Original Capacity (kWh) *</L>
          <Inp id="originCapacity" type="number" step="0.1" placeholder="100.0"
               value={formData.originCapacity ?? ""} onChange={(e)=>updateFormData("originCapacity", e.target.value)} />
          <div className="text-xs text-gray-500 mt-1">Factory specification capacity</div>
        </div>

        <div>
          <L htmlFor="remainingCapacity">Current Capacity (kWh) *</L>
          <Inp id="remainingCapacity" type="number" step="0.1" placeholder="94.2"
               value={formData.remainingCapacity ?? ""} onChange={(e)=>updateFormData("remainingCapacity", e.target.value)} />
          <div className="text-xs text-gray-500 mt-1">Current measured capacity</div>
        </div>

        <div>
          <L htmlFor="batteryHealth">Battery Health (%) *</L>
          <Inp id="batteryHealth" type="number" min="0" max="100" placeholder="94"
               value={formData.batteryHealth ?? ""} onChange={(e)=>updateFormData("batteryHealth", e.target.value)} />
          <div className="text-xs text-gray-500 mt-1">State of Health (SOH)</div>
        </div>

        <div>
          <L htmlFor="voltage">Nominal Voltage (V) *</L>
          <Inp id="voltage" type="number" step="0.1" placeholder="400.0"
               value={formData.voltage ?? ""} onChange={(e)=>updateFormData("voltage", e.target.value)} />
        </div>

        <div>
          <L htmlFor="chemistry">Cell Chemistry *</L>
          <select id="chemistry" className="e-select"
                  value={formData.chemistry ?? ""} onChange={(e)=>updateFormData("chemistry", e.target.value)}>
            <option value="">Select chemistry</option>
            {batteryChemistry.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <L htmlFor="cycleCount">Cycle Count</L>
          <Inp id="cycleCount" type="number" placeholder="450"
               value={formData.cycleCount ?? ""} onChange={(e)=>updateFormData("cycleCount", e.target.value)} />
          <div className="text-xs text-gray-500 mt-1">Estimated charge cycles</div>
        </div>

        <div>
          <L htmlFor="chargingSpeed">Max Charging Speed (kW)</L>
          <Inp id="chargingSpeed" type="number" step="0.1" placeholder="250.0"
               value={formData.chargingSpeed ?? ""} onChange={(e)=>updateFormData("chargingSpeed", e.target.value)} />
        </div>

        <div>
          <L htmlFor="connectorType">Connector Type</L>
          <select id="connectorType" className="e-select"
                  value={formData.connectorType ?? ""} onChange={(e)=>updateFormData("connectorType", e.target.value)}>
            <option value="">Select connector</option>
            {connectorTypes.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <L htmlFor="weight">Weight (kg)</L>
          <Inp id="weight" type="number" step="0.1" placeholder="625.0"
               value={formData.weight ?? ""} onChange={(e)=>updateFormData("weight", e.target.value)} />
        </div>

        <div>
          <L htmlFor="mileageCovered">Total Mileage (km)</L>
          <Inp id="mileageCovered" type="number" placeholder="85000"
               value={formData.mileageCovered ?? ""} onChange={(e)=>updateFormData("mileageCovered", e.target.value)} />
          <div className="text-xs text-gray-500 mt-1">Total distance covered</div>
        </div>

        <div>
          <L htmlFor="warranty">Warranty Status</L>
          <Inp id="warranty" placeholder="18 months remaining"
               value={formData.warranty ?? ""} onChange={(e)=>updateFormData("warranty", e.target.value)} />
        </div>

        <div>
          <L htmlFor="bmsStatus">BMS Status</L>
          <select id="bmsStatus" className="e-select"
                  value={formData.bmsStatus ?? ""} onChange={(e)=>updateFormData("bmsStatus", e.target.value)}>
            <option value="">Select BMS status</option>
            <option value="OK">OK - Working Properly</option>
            <option value="Replaced">Replaced Recently</option>
            <option value="Needs Service">Needs Service</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <L htmlFor="dimensions">Physical Dimensions</L>
        <Inp id="dimensions" placeholder="e.g., 1080 x 1500 x 120 mm"
             value={formData.dimensions ?? ""} onChange={(e)=>updateFormData("dimensions", e.target.value)} />
      </div>

      <div className="mt-4">
        <L htmlFor="compatibility">Vehicle Compatibility</L>
        <Textarea id="compatibility" rows={3}
                  placeholder="e.g., Tesla Model S 2016-2020 (all variants), Model X 2016-2019..."
                  value={formData.compatibility ?? ""} onChange={(e)=>updateFormData("compatibility", e.target.value)} />
      </div>

      {/* Safety Notice */}
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-yellow-600 text-lg">⚠️</span>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">Safety & Transport Notice</h4>
            <p className="text-sm text-yellow-700 mb-3">
              High-voltage battery packs require special handling and may be classified as hazardous materials for shipping.
            </p>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={!!formData.hazmatAck}
                     onChange={(e)=>updateFormData("hazmatAck", e.target.checked)} />
              <span className="text-sm text-yellow-800">I acknowledge hazardous material transport requirements and safety protocols</span>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Step 3 - Enhanced Photo Upload (same concept as vehicle form)
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
    <Card title="Battery Photos" icon={<Camera className="w-5 h-5" />}>
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Camera className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">📸 Battery Photography Tips</h4>
            <p className="text-sm text-blue-700 mb-2">High-quality photos increase buyer confidence and sale price!</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• <strong>First photo will be your main thumbnail</strong></li>
              <li>• Show battery pack, BMS, terminals, and serial numbers clearly</li>
              <li>• Include any certificates or documentation</li>
              <li>• Good lighting prevents safety concerns</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="photos-grid">
        {ELECTRIC_IMAGE_SLOTS.map(({ key, label }, index) => {
          const it = getImg(key) || { title: label, url: "" };

          return (
            <div key={key} className="photo-slot">
              <div className="flex items-center justify-between mb-3">
                <L className="font-medium text-gray-700">{label}</L>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {index === 0 ? 'Main Photo' : `Photo ${index + 1}`}
                </span>
              </div>

              <input
                id={`up-${key}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageForSlot(key, { title: label });
                    handleUploadForSlot(key, file);
                  }
                }}
              />

              <div className="e-dropzone improved">
                {it.url ? (
                  <>
                    <img
                      src={it.url}
                      alt={label}
                      onClick={() => document.getElementById(`up-${key}`)?.click()}
                      className="uploaded-image"
                    />

                    <div className="e-overlay-actions">
                      <button
                        type="button"
                        className="e-btn-mini primary"
                        onClick={() => document.getElementById(`up-${key}`)?.click()}
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        className="e-btn-mini danger"
                        onClick={() => removeImageForSlot(key)}
                      >
                        Remove
                      </button>
                    </div>

                    <button
                      type="button"
                      className="e-chip-remove"
                      onClick={() => removeImageForSlot(key)}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="upload-success-badge">
                      ✓ Uploaded
                    </div>
                  </>
                ) : (
                  <label htmlFor={`up-${key}`} className="e-empty-upload enhanced">
                    <div className="upload-icon-container">
                      <Upload className="h-12 w-12" />
                    </div>
                    <div className="upload-text">
                      <span className="upload-main">Click to add {label.toLowerCase()}</span>
                      <span className="upload-sub">JPG, PNG up to 10MB</span>
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
                      <div className="e-progress">
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

      {formData.images?.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-semibold">{formData.images.length}</span>
              </div>
              <span className="text-green-800 font-medium">
                {formData.images.length} photo{formData.images.length !== 1 ? 's' : ''} uploaded
              </span>
            </div>
            <span className="text-xs text-green-600 font-medium">
              {formData.images.length >= 3 ? '✅ Excellent coverage!' : 
               formData.images.length >= 1 ? '👍 Add more for better results' : ''}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

function Step4({ formData, updateFormData }) {
  const totalPhotos = formData.images?.length || 0;
  const hasMainPhoto = formData.images?.[0]?.url;
  
  return (
    <Card title="Pricing & Final Review" icon={<DollarSign className="w-5 h-5" />}>
      {/* Pricing Section */}
      <div className="pricing-section mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Information</h3>
        
        <div className="e-grid">
          <div>
            <L htmlFor="price">Price (USD) *</L>
            <div className="relative">
              <DollarSign className="e-left-icon" />
              <Inp id="price" type="number" placeholder="15000" 
                   value={formData.price ?? ""} onChange={(e)=>updateFormData("price", e.target.value)}
                   className="pl-9" />
            </div>
          </div>
        </div>

        <label className="mt-3 inline-flex items-center gap-2">
          <input type="checkbox" checked={!!formData.acceptOffers}
                 onChange={(e)=>updateFormData("acceptOffers", e.target.checked)} />
          <span>Accept offers from buyers</span>
        </label>
      </div>

      {/* Review Section */}
      <div className="review-summary">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="battery-summary">
            <div className="summary-header">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Battery Summary</h3>
            </div>
            
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Title</span>
                <span className="summary-value">{formData.title || "—"}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Battery</span>
                <span className="summary-value">{formData.brand} {formData.model}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Year</span>
                <span className="summary-value">{formData.year || "—"}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Capacity</span>
                <span className="summary-value">{formData.originCapacity ? `${formData.originCapacity} kWh` : "—"}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Health</span>
                <span className="summary-value">{formData.batteryHealth ? `${formData.batteryHealth}%` : "—"}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Price</span>
                <span className="summary-value price">${parseInt(formData.price || "0").toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="listing-preview">
            <div className="preview-header">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Preview</h3>
            </div>
            
            {hasMainPhoto ? (
              <div className="preview-card">
                <div className="preview-image">
                  <img src={formData.images[0].url} alt="Main preview" className="w-full h-48 object-cover rounded-lg" />
                  <div className="photo-count-badge">
                    📸 {totalPhotos} photo{totalPhotos !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="preview-content">
                  <div className="preview-title">{formData.title}</div>
                  <div className="preview-price">${parseInt(formData.price || "0").toLocaleString()}</div>
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

      {/* Confirmation Section */}
      <div className="confirmation-divider">
        <div className="divider-line"></div>
        <span className="divider-text">Final Confirmation</span>
        <div className="divider-line"></div>
      </div>

      <div className="confirmation-section">
        <div className="confirmation-intro">
          <h3 className="confirmation-title">Before You Submit</h3>
          <p className="confirmation-subtitle">
            Please review and confirm the following to complete your battery listing
          </p>
        </div>

        <div className="confirmation-checklist">
          <div className="confirmation-item">
            <label className="confirmation-checkbox">
              <input 
                type="checkbox" 
                checked={!!formData.confirmOwnership}
                onChange={(e) => updateFormData("confirmOwnership", e.target.checked)}
                className="checkbox-input"
              />
              <div className="checkbox-custom">
                <div className="checkbox-checkmark">✓</div>
              </div>
              <div className="checkbox-content">
                <div className="checkbox-title">Battery Pack Ownership Verification</div>
                <div className="checkbox-description">
                  I confirm that I am the legal owner of this battery pack and have the right to sell it
                </div>
              </div>
            </label>
          </div>

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
                <div className="checkbox-title">Terms & Guidelines Agreement</div>
                <div className="checkbox-description">
                  I agree to Voltera's <a href="/terms" className="terms-link">Terms of Service</a> and 
                  <a href="/guidelines" className="terms-link"> Listing Guidelines</a>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="submission-status">
          {formData.confirmOwnership && formData.agreeTerms ? (
            <div className="status-ready">
              <div className="status-icon ready">✓</div>
              <div className="status-text">
                <div className="status-title">Ready to Submit</div>
                <div className="status-description">Your battery listing will be reviewed within 24 hours</div>
              </div>
            </div>
          ) : (
            <div className="status-pending">
              <div className="status-icon pending">⏳</div>
              <div className="status-text">
                <div className="status-title">Complete Required Confirmations</div>
                <div className="status-description">Please check both boxes above to proceed</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/** ===================== MAIN COMPONENT ===================== */
export default function CreateElectricForm({ currentUser = null, onSubmit = () => {} }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const DRAFT_KEY = `voltera.draft.electric`;

  const initialDraft = useMemo(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      // Basic
      title:"", brand:"", model:"", year:"", condition:"", description:"", serialNumber:"",
      location:"", coords:null,
      // Technical
      originCapacity:"", remainingCapacity:"", batteryHealth:"", voltage:"", chemistry:"",
      cycleCount:"", chargingSpeed:"", connectorType:"", weight:"", mileageCovered:"",
      warranty:"", bmsStatus:"", dimensions:"", compatibility:"",
      // Safety
      hazmatAck:false,
      // Pricing
      price:"", acceptOffers:true,
      // Media
      images:[],
      // Legal
      agreeTerms:false, confirmOwnership:false,
    };
  }, []);

  const [formData, setFormData] = useState(initialDraft);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showMapPicker, setShowMapPicker] = useState(false);

  const saveTimer = useRef(null);
  useEffect(() => {
    if (step <= 3) {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        try { localStorage.setItem(DRAFT_KEY, JSON.stringify(formData)); } catch {}
      }, 300);
    }
    return () => clearTimeout(saveTimer.current);
  }, [formData, step, DRAFT_KEY]);

  const updateFormData = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value ?? "" }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateCurrentStep = () => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.title?.trim()) errors.title = "Title is required";
      if (!formData.brand?.trim()) errors.brand = "Brand is required";  
      if (!formData.model?.trim()) errors.model = "Model is required";
    }
    
    return errors;
  };

  // Image handling (same as vehicle form)
  const setImageForSlot = (slotKey, patch) => {
    const imgs = [...(formData.images || [])];
    const idx = imgs.findIndex((i) => i.slot === slotKey);
    if (idx === -1) imgs.push({ slot: slotKey, title: "", url: "", ...patch });
    else imgs[idx] = { ...imgs[idx], ...patch };
    updateFormData("images", imgs);
  };

  const removeImageForSlot = (slotKey) => updateFormData("images", (formData.images || []).filter((i) => i.slot !== slotKey));
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingSlot, setUploadingSlot] = useState(null);

  const handleUploadForSlot = async (slotKey, file) => {
    if (!file) return;
    setUploadingSlot(slotKey);
    try {
      const url = await listingService.uploadImageOne(file, "electric", setUploadProgress);
      setImageForSlot(slotKey, { url });
      toast.success("Image uploaded");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed");
    } finally {
      setUploadingSlot(null);
      setUploadProgress(0);
    }
  };

  const handleLocationSelect = (locationData) => {
    updateFormData("coords", locationData.coords);
    updateFormData("location", locationData.address);
    toast.success("Location selected successfully!");
  };

  const submitForm = async () => {
    if (!formData.agreeTerms || !formData.confirmOwnership) {
      return toast.error("Please confirm ownership and accept the terms");
    }
    
    // Basic validation
    if (!formData.title || !formData.brand || !formData.model) {
      return toast.error("Please fill all required fields");
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      return toast.error("Please enter a valid price");
    }

    if (!formData.hazmatAck) {
      return toast.error("Please acknowledge hazmat transport requirements");
    }

    const imgs = formData.images || [];
    if (imgs.length === 0) {
      return toast.error("Please upload at least one photo of your battery pack");
    }

    if (imgs.some(i => !i.url)) {
      return toast.error("Please wait for all photos to finish uploading.");
    }

    // Create payload for electric post
    const payload = {
      title: formData.title,
      description: formData.description,
      price: formData.price ? formData.price.toString() : "0",
      status: "PENDING",
      vehicle: null,
      vehicleImages: [],
      battery: {
        serialNumber: formData.serialNumber || `EV-${Date.now()}`,
        originCapacity: formData.originCapacity ? parseFloat(formData.originCapacity) : 0,
        remainingCapacity: formData.remainingCapacity ? parseFloat(formData.remainingCapacity) : 0,
        mileageCovered: formData.mileageCovered ? parseInt(formData.mileageCovered) : 0,
        voltage: formData.voltage ? parseFloat(formData.voltage) : 0,
        cycleCount: formData.cycleCount ? parseInt(formData.cycleCount) : 0,
        warranty: formData.warranty || "",
        weight: formData.weight ? parseFloat(formData.weight) : 0,
        lifeCycle: formData.condition || "",
        // Extended fields
        brand: formData.brand || "",
        model: formData.model || "",
        condition: formData.condition || "",
        batteryHealth: formData.batteryHealth ? parseInt(formData.batteryHealth) : 0,
        chemistry: formData.chemistry || "",
        chargingSpeed: formData.chargingSpeed ? parseFloat(formData.chargingSpeed) : 0,
        warrantyRemaining: formData.warranty || "",
        bmsStatus: formData.bmsStatus || "",
        connectorType: formData.connectorType || "",
        compatibility: formData.compatibility || "",
        manufactureDate: formData.year ? `${formData.year}-01-01` : null,
        dimensions: formData.dimensions || "",
        year: formData.year || "",
        hazmatAck: !!formData.hazmatAck,
        batteryTypeId: null, // Will be handled by backend
      },
      batteryImages: imgs.map(i => i.url),
    };

    try {
      console.log("📤 Sending electric post payload:", JSON.stringify(payload, null, 2));
      
      const created = await listingService.createPost(payload);
      toast.success("Battery pack posted successfully! Your listing is pending admin approval.");
      
      // Clear draft
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      
      onSubmit(created || payload);
      
      setTimeout(() => {
        navigate("/", { 
          replace: true,
          state: { 
            message: "Your battery pack listing has been submitted for review. You'll be notified once it's approved." 
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error("❌ Submit error:", error);
      const errorData = error?.response?.data;
      let msg = "Failed to create battery listing";
      
      if (errorData) {
        if (typeof errorData === 'string') {
          msg = errorData;
        } else if (errorData.message) {
          msg = errorData.message;
        }
      }
      
      toast.error(msg);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 formData={formData} updateFormData={updateFormData} setShowMapPicker={setShowMapPicker} fieldErrors={fieldErrors} />;
      case 2: return <Step2 formData={formData} updateFormData={updateFormData} fieldErrors={fieldErrors} />;
      case 3: return (
        <Step3
          formData={formData}
          setImageForSlot={setImageForSlot}
          removeImageForSlot={removeImageForSlot}
          handleUploadForSlot={handleUploadForSlot}
          uploadingSlot={uploadingSlot}
          uploadProgress={uploadProgress}
        />
      );
      case 4: return <Step4 formData={formData} updateFormData={updateFormData} />;
      default: return null;
    }
  };

  return (
    <>
      <form onSubmit={(e)=>e.preventDefault()} className="electric-wizard space-y-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step/4)*100)}% Complete</span>
          </div>
          <div className="e-progress h-2"><div style={{ width: `${(step/4)*100}%` }} /></div>
        </div>

        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between">
          <button className="e-btn e-btn-outline" onClick={()=>setStep(s=>Math.max(1,s-1))} disabled={step===1}>Previous</button>
          {step===4 ? (
            <button className="e-btn e-btn-primary"
                    onClick={submitForm}
                    disabled={!formData.agreeTerms || !formData.confirmOwnership}>
              Submit Battery Listing
            </button>
          ) : (
            <button className="e-btn e-btn-primary" onClick={() => {
              const stepErrors = validateCurrentStep();
              if (Object.keys(stepErrors).length > 0) {
                setFieldErrors(prev => ({ ...prev, ...stepErrors }));
                toast.error("Please fix the errors before continuing");
                return;
              }
              setStep(s => Math.min(4, s + 1));
            }}>Next</button>
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