import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Car, Battery, Camera, DollarSign, Gauge, MapPin, Map, Navigation } from "lucide-react";
import toast from "react-hot-toast";
import { listingService } from "../../../services/listing.jsx";
import MapPicker from "../../../components/MapPicker/SimpleMapPicker.jsx";
import "./createListingForm.css";

/** ===================== DATA & HELPERS (stable) ===================== */
const vehicleBrands = ["Tesla","BMW","Audi","Mercedes-Benz","Nissan","Chevrolet","Ford","Volkswagen","Hyundai","Kia","Porsche","Jaguar","Volvo","Polestar","Rivian","Lucid","BYD","Genesis"];
const batteryBrands = ["Tesla","CATL","BYD","LG Energy Solution","Panasonic","Samsung SDI","SK Innovation","CALB"];
const vehicleFeatures = ["Autopilot/Self-Driving","Premium Interior","Supercharger Access","Mobile Connectivity","Over-the-Air Updates","Premium Sound System","All-Weather Capability","Advanced Safety Features","Heated Seats","Cooled Seats","Panoramic Roof","Tow Package","Performance Package","FSD Computer"];
const IMAGE_SLOTS = [
  { key: "front",     label: "Front view" },
  { key: "rear",      label: "Rear view" },
  { key: "left",      label: "Left side" },
  { key: "right",     label: "Right side" },
  { key: "dashboard", label: "Dashboard / Interior" },
  { key: "paper",     label: "Documents / Registration" },
];

const Card = ({ title, icon, children }) => (
  <div className="v-card">
    {title && (
      <div className="v-card-header">
        <div className="flex items-center gap-2">{icon}<span>{title}</span></div>
      </div>
    )}
    <div className="v-card-content">{children}</div>
  </div>
);
const L = ({ htmlFor, children }) => <label htmlFor={htmlFor} className="v-label">{children}</label>;
const Inp = (props) => <input {...props} className={`v-input ${props.className || ""}`} />;
const Textarea = (props) => <textarea {...props} className={`v-textarea ${props.className || ""}`} />;

/** ===================== STEP COMPONENTS (stable, outside) ===================== */
function Step1({ formData, updateFormData, setShowMapPicker, fieldErrors = {} }) {
  return (
    <Card title="Basic Information" icon={<Car className="w-5 h-5" />}>
      <div className="v-grid">
        <div>
          <L htmlFor="title">Listing Title *</L>
          <Inp id="title" placeholder="2021 Tesla Model 3 Long Range"
               value={formData.title ?? ""} onChange={(e)=>updateFormData("title", e.target.value)} 
               className={fieldErrors.title ? 'error' : ''} />
          {fieldErrors.title && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.title}</div>}
        </div>

        <div>
          <L htmlFor="brand">Brand *</L>
          <select id="brand" className={`v-select ${fieldErrors.brand ? 'error' : ''}`}
                  value={formData.brand ?? ""} onChange={(e)=>updateFormData("brand", e.target.value)}>
            <option value="">Select brand</option>
            {vehicleBrands.map(b=><option key={b} value={b}>{b}</option>)}
          </select>
          {fieldErrors.brand && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.brand}</div>}
        </div>

        <div>
          <L htmlFor="model">Model *</L>
          <Inp id="model" placeholder="Model 3"
               value={formData.model ?? ""} onChange={(e)=>updateFormData("model", e.target.value)} 
               className={fieldErrors.model ? 'error' : ''} />
          {fieldErrors.model && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.model}</div>}
        </div>

        <div>
          <L htmlFor="version">Version</L>
          <Inp id="version" placeholder="Long Range"
               value={formData.version ?? ""} onChange={(e)=>updateFormData("version", e.target.value)} 
               className={fieldErrors.version ? 'error' : ''} />
          {fieldErrors.version && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.version}</div>}
        </div>

        <div>
          <L htmlFor="year">Year *</L>
          <select id="year" className="v-select"
                  value={formData.year ?? ""} onChange={(e)=>updateFormData("year", e.target.value)}>
            <option value="">Select year</option>
            {Array.from({length:15},(_,i)=>new Date().getFullYear()-i).map(y=><option key={y} value={String(y)}>{y}</option>)}
          </select>
        </div>

        <div>
          <L htmlFor="odo">ODO (km) *</L>
          <div className="relative">
            <Gauge className="v-left-icon" />
            <Inp id="odo" placeholder="26500" inputMode="numeric" pattern="[0-9]*"
                 value={formData.odo ?? ""} onChange={(e)=>updateFormData("odo", e.target.value)}
                 className="pl-9" />
          </div>
        </div>

        <div>
          <L htmlFor="color">Color</L>
          <Inp id="color" placeholder="Pearl White"
               value={formData.color ?? ""} onChange={(e)=>updateFormData("color", e.target.value)} 
               className={fieldErrors.color ? 'error' : ''} />
          {fieldErrors.color && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.color}</div>}
        </div>
      </div>

      <div className="mt-2">
        <L htmlFor="description">Description *</L>
        <Textarea id="description" rows={4}
                  placeholder="Condition, features, service history, etc."
                  value={formData.description ?? ""} onChange={(e)=>updateFormData("description", e.target.value)} />
      </div>

      <div className="mt-4">
        <L htmlFor="location">Location * <span className="text-sm text-gray-500">(Where buyers can find your vehicle)</span></L>
        
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
                onClick={()=>{
                  if (!navigator.geolocation) return toast.error("Geolocation is not supported");
                  navigator.geolocation.getCurrentPosition(
                    (pos)=>{
                      const { latitude:lat, longitude:lng } = pos.coords;
                      updateFormData("coords", { lat, lng });
                      updateFormData("location", `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                      toast.success("Got current location! You can refine it on the map.");
                      // Auto-open map picker to let user refine
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
    <Card title="Vehicle Details" icon={<Battery className="w-5 h-5" />}>
      <div className="v-grid">
        <div>
          <L htmlFor="style">Style</L>
          <select id="style" className={`v-select ${fieldErrors.style ? 'error' : ''}`} value={formData.style ?? ""} onChange={(e)=>updateFormData("style", e.target.value)}>
            <option value="">Select style</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Coupe">Coupe</option>
            <option value="Convertible">Convertible</option>
            <option value="Pickup">Pickup</option>
            <option value="Van">Van</option>
          </select>
          {fieldErrors.style && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.style}</div>}
        </div>

        <div>
          <L htmlFor="numberOfSeats">Number of Seats</L>
          <select id="numberOfSeats" className="v-select" value={formData.numberOfSeats ?? ""} onChange={(e)=>updateFormData("numberOfSeats", e.target.value)}>
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
          <Inp id="origin" placeholder="Germany, USA, China..." 
               value={formData.origin ?? ""} onChange={(e)=>updateFormData("origin", e.target.value)} />
        </div>

        <div>
          <L htmlFor="licensePlate">License Plate</L>
          <Inp id="licensePlate" placeholder="30A-1234" 
               value={formData.licensePlate ?? ""} onChange={(e)=>updateFormData("licensePlate", e.target.value)} 
               className={fieldErrors.licensePlate ? 'error' : ''} />
          {fieldErrors.licensePlate && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.licensePlate}</div>}
          <div className="text-xs text-gray-500 mt-1">Vietnamese format: 30A-1234 or 51B-123 (max 8 chars)</div>
        </div>

        <div>
          <L htmlFor="batteryCapacity">Battery Capacity (kWh)</L>
          <Inp id="batteryCapacity" inputMode="numeric" step="0.1" placeholder="75.5" 
               value={formData.batteryCapacity ?? ""} onChange={(e)=>updateFormData("batteryCapacity", e.target.value)} 
               className={fieldErrors.batteryCapacity ? 'error' : ''} />
          {fieldErrors.batteryCapacity && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.batteryCapacity}</div>}
          <div className="text-xs text-gray-500 mt-1">Typical EV battery: 40-150 kWh</div>
        </div>

        <div>
          <L htmlFor="range">Range (km)</L>
          <Inp id="range" inputMode="numeric" placeholder="450" 
               value={formData.range ?? ""} onChange={(e)=>updateFormData("range", e.target.value)} 
               className={fieldErrors.range ? 'error' : ''} />
          {fieldErrors.range && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.range}</div>}
          <div className="text-xs text-gray-500 mt-1">Typical EV range: 200-600km</div>
        </div>

        <div>
          <L htmlFor="chargingTime">Charging Time (hours)</L>
          <Inp id="chargingTime" inputMode="numeric" placeholder="8" 
               value={formData.chargingTime ?? ""} onChange={(e)=>updateFormData("chargingTime", e.target.value)} 
               className={fieldErrors.chargingTime ? 'error' : ''} />
          {fieldErrors.chargingTime && <div className="text-red-500 text-sm mt-1">⚠️ {fieldErrors.chargingTime}</div>}
          <div className="text-xs text-gray-500 mt-1">Fast charge: 0.5-2h, Standard: 6-12h</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="v-grid">
          <div>
            <label className="inline-flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={!!formData.bodyInsurance}
                onChange={(e)=>updateFormData("bodyInsurance", e.target.checked)} 
              />
              <span>Body Insurance</span>
            </label>
          </div>

          <div>
            <label className="inline-flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={!!formData.vehicleInspection}
                onChange={(e)=>updateFormData("vehicleInspection", e.target.checked)} 
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
            <Inp id="price" placeholder="42000" inputMode="numeric" pattern="[0-9]*"
                 value={formData.price ?? ""} onChange={(e)=>updateFormData("price", e.target.value)} className="pl-9" />
          </div>
        </div>
        <label className="mt-3 inline-flex items-center gap-2">
          <input type="checkbox" checked={!!formData.acceptOffers}
                 onChange={(e)=>updateFormData("acceptOffers", e.target.checked)} />
          <span>Accept offers from buyers</span>
        </label>
      </div>

      <div className="mt-6">
        <L>Delivery Options</L>
        {[
          { id: "pickup",          label: "Local Pickup",       desc: "Buyer picks up at your location" },
          { id: "delivery-local",  label: "Local Delivery",     desc: "Within ~12km" },
          { id: "shipping",        label: "Nationwide Shipping",desc: "Across Vietnam" },
        ].map((o) => (
          <label key={o.id} className="v-check-row">
            <input
              type="checkbox"
              checked={(formData.deliveryOptions || []).includes(o.id)}
              onChange={(e) => {
                const checked = e.target.checked;
                const cur = formData.deliveryOptions || [];
                updateFormData("deliveryOptions", checked ? [...cur, o.id] : cur.filter(x => x !== o.id));
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
                  updateFormData("features", checked ? [...cur, f] : cur.filter(x => x !== f));
                }}
              />
              {f}
            </label>
          ))}
        </div>
        <div className="mt-3">
          <L htmlFor="customFeatures">Additional Features</L>
          <Textarea id="customFeatures" rows={3} placeholder="List any additional features…"
                    value={formData.customFeatures ?? ""} onChange={(e)=>updateFormData("customFeatures", e.target.value)} />
        </div>
      </div>
    </Card>
  );
}

// ==== STEP 3 (REPLACE / THAY THẾ TOÀN BỘ) ====
// ==== STEP 3 (props version) ====
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
    <Card title="Photos" icon={<Camera className="w-5 h-5" />}>
      <div className="photos-grid">
        {IMAGE_SLOTS.map(({ key, label }) => {
          const it = getImg(key) || { title: label, url: "" };

          return (
            <div key={key}>
              <L>{label}</L>

              {/* Photo title (required) */}
              <input
                className="v-input mb-2"
                placeholder="Photo title (required)…"
                value={it.title ?? ""}
                onChange={(e) => setImageForSlot(key, { title: e.target.value })}
              />

              {/* Input file – luôn tồn tại để có thể Replace */}
              <input
                id={`up-${key}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUploadForSlot(key, e.target.files?.[0])}
              />

              <div className="v-dropzone">
                {it.url ? (
                  <>
                    <img
                      src={it.url}
                      alt={it.title || label}
                      onClick={() => document.getElementById(`up-${key}`)?.click()}
                      style={{ cursor: "pointer" }}
                    />

                    <div className="v-overlay-actions">
                      <button
                        type="button"
                        className="v-btn-mini"
                        onClick={() => document.getElementById(`up-${key}`)?.click()}
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        className="v-btn-mini danger"
                        onClick={() => removeImageForSlot(key)}
                      >
                        Remove
                      </button>
                    </div>

                    <button
                      type="button"
                      className="v-chip-remove"
                      onClick={() => removeImageForSlot(key)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <label htmlFor={`up-${key}`} className="v-empty-upload">
                    <Upload className="h-10 w-10" />
                    <span>Choose an image to upload</span>
                  </label>
                )}
              </div>

              {uploadingSlot === key && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uploading…</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="v-progress">
                    <div style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-md bg-blue-50 mt-6 text-sm text-blue-800">
        <div className="font-semibold mb-2">📸 Photo Guidelines:</div>
        <ul className="space-y-1">
          <li>• <strong>First photo will be your main thumbnail</strong> - choose your best front view</li>
          <li>• Upload at least 3 photos for better visibility</li>
          <li>• Clear, well-lit photos get more attention</li>
          <li>• Include interior, exterior, and any documents</li>
        </ul>
      </div>
    </Card>
  );
};



function Step4({ formData, updateFormData }) {
  return (
    <Card title="Review & Submit">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="font-semibold mb-3">Summary</div>
          <div className="space-y-2 text-sm">
            <div className="v-kv"><span>Title:</span><span>{formData.title || "—"}</span></div>
            <div className="v-kv"><span>Brand/Model:</span><span>{formData.brand} {formData.model}</span></div>
            <div className="v-kv"><span>Year:</span><span>{formData.year || "—"}</span></div>
            <div className="v-kv"><span>Price:</span><span>${parseInt(formData.price || "0").toLocaleString()}</span></div>
            <div className="v-kv"><span>Location:</span><span>{formData.location || "—"}</span></div>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-3">Preview</div>
          {(formData.images?.[0]?.url) && (
            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden mb-2">
              <img src={formData.images[0].url} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <p className="text-sm text-muted-foreground">{(formData.description || "").slice(0, 120)}...</p>
        </div>
      </div>

      <hr className="my-6"/>

      <div className="space-y-3">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={!!formData.confirmOwnership}
                 onChange={(e)=>updateFormData("confirmOwnership", e.target.checked)} />
          <span className="text-sm">I confirm I am the legal owner</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={!!formData.agreeTerms}
                 onChange={(e)=>updateFormData("agreeTerms", e.target.checked)} />
          <span className="text-sm">I agree to the Terms & Guidelines</span>
        </label>
      </div>
    </Card>
  );
}

/** ===================== MAIN ===================== */
export default function CreateListingForm({ listingType = "vehicle", currentUser = null, onSubmit = () => {} }) {
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
      title:"", brand:"", model:"", version:"", year:"", description:"",
      location:"", coords:null,
      odo:"", color:"", style:"", numberOfSeats:"", origin:"", licensePlate:"",
      batteryCapacity:"", range:"", chargingTime:"",
      bodyInsurance:false, vehicleInspection:false,
      price:"", acceptOffers:true,
      deliveryOptions:[], features:[], customFeatures:"",
      images:[], documents:[],
      agreeTerms:false, confirmOwnership:false,
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
        try { localStorage.setItem(DRAFT_KEY, JSON.stringify(formData)); } catch {}
      }, 300);
    }
    return () => clearTimeout(saveTimer.current);
  }, [formData, step, DRAFT_KEY]);

  const updateFormData = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value ?? "" }));
    
    // Real-time validation
    const validation = validateField(field, value);
    setFieldErrors(prev => ({
      ...prev,
      [field]: validation.isValid ? null : validation.message
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
        message: "Maximum 8 characters" 
      };
    }
    
    if (!pattern.test(value)) {
      return { 
        isValid: false, 
        message: "Format: 30A-1234 or 51B-123" 
      };
    }
    
    return { isValid: true, message: "" };
  };

  const validateField = (key, value) => {
    switch(key) {
      case 'licensePlate':
        return validateLicensePlate(value);
      case 'range':
        if (value && (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 600)) {
          return { isValid: false, message: "Range must be 0-600 km (realistic for EVs)" };
        }
        return { isValid: true, message: "" };
      case 'batteryCapacity':
        if (value && (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 200)) {
          return { isValid: false, message: "Battery capacity must be 0-200 kWh" };
        }
        return { isValid: true, message: "" };
      case 'chargingTime':
        if (value && (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 24)) {
          return { isValid: false, message: "Charging time must be 0-24 hours" };
        }
        return { isValid: true, message: "" };
      case 'title':
        return value && value.length > 255 ? { isValid: false, message: "Maximum 255 characters" } : { isValid: true, message: "" };
      case 'brand':
      case 'model':
        return value && value.length > 100 ? { isValid: false, message: "Maximum 100 characters" } : { isValid: true, message: "" };
      case 'version':
      case 'color':
      case 'style':
        return value && value.length > 50 ? { isValid: false, message: "Maximum 50 characters" } : { isValid: true, message: "" };
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
      if (formData.title && formData.title.length > 255) errors.title = "Maximum 255 characters";
      if (formData.brand && formData.brand.length > 100) errors.brand = "Maximum 100 characters";
      if (formData.model && formData.model.length > 100) errors.model = "Maximum 100 characters";
      if (formData.version && formData.version.length > 50) errors.version = "Maximum 50 characters";
      if (formData.color && formData.color.length > 50) errors.color = "Maximum 50 characters";
    }
    
    if (step === 2) {
      // License plate validation
      if (formData.licensePlate) {
        const lpValidation = validateLicensePlate(formData.licensePlate);
        if (!lpValidation.isValid) errors.licensePlate = lpValidation.message;
      }
      
      // Numeric field validations
      if (formData.range && (isNaN(formData.range) || parseInt(formData.range) < 0 || parseInt(formData.range) > 600)) {
        errors.range = "Range must be 0-600 km (realistic for EVs)";
      }
      if (formData.batteryCapacity && (isNaN(formData.batteryCapacity) || parseFloat(formData.batteryCapacity) < 0 || parseFloat(formData.batteryCapacity) > 200)) {
        errors.batteryCapacity = "Battery capacity must be 0-200 kWh";
      }
      if (formData.chargingTime && (isNaN(formData.chargingTime) || parseInt(formData.chargingTime) < 0 || parseInt(formData.chargingTime) > 24)) {
        errors.chargingTime = "Charging time must be 0-24 hours";
      }
      
      if (formData.style && formData.style.length > 50) errors.style = "Maximum 50 characters";
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
  const removeImageForSlot = (slotKey) => updateFormData("images", (formData.images || []).filter((i) => i.slot !== slotKey));
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const handleUploadForSlot = async (slotKey, file) => {
    if (!file) return;
    setUploadingSlot(slotKey);
    try {
      // debug: log target upload endpoint
      // eslint-disable-next-line no-console
      console.debug("Uploading file to:", `${import.meta.env.VITE_BACK_END_BASE_URL}/api/upload/product?folder=product`);
      const url = await listingService.uploadImageOne(file, "product", setUploadProgress);
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
    if (!formData.agreeTerms || !formData.confirmOwnership) return toast.error("Please confirm ownership and accept the terms");
    if (!formData.title || !formData.brand || !formData.model || !formData.year) return toast.error("Please fill all required fields");
    if (!formData.price || Number(formData.price) <= 0) return toast.error("Please enter a valid price");
    
    // License plate format validation (Vietnamese format)
    if (formData.licensePlate) {
      if (formData.licensePlate.length > 8) {
        return toast.error("License plate must be 8 characters or less");
      }
      const licensePlatePattern = /^[0-9]{2}[A-Z]{1}-[0-9]{3,4}$/;
      if (!licensePlatePattern.test(formData.licensePlate)) {
        return toast.error("License plate must follow Vietnamese format (e.g., 30A-1234 or 51B-123)");
      }
    }
    
    // Field length validations
    if (formData.title && formData.title.length > 255) return toast.error("Title must be 255 characters or less");
    if (formData.brand && formData.brand.length > 100) return toast.error("Brand must be 100 characters or less");
    if (formData.model && formData.model.length > 100) return toast.error("Model must be 100 characters or less");
    if (formData.version && formData.version.length > 50) return toast.error("Version must be 50 characters or less");
    if (formData.color && formData.color.length > 50) return toast.error("Color must be 50 characters or less");
    if (formData.style && formData.style.length > 50) return toast.error("Style must be 50 characters or less");
    if (formData.origin && formData.origin.length > 255) return toast.error("Origin must be 255 characters or less");
    
    // Numeric validations
    if (formData.year && (formData.year < 1900 || formData.year > new Date().getFullYear() + 2)) {
      return toast.error(`Year must be between 1900 and ${new Date().getFullYear() + 2}`);
    }
    if (formData.odo && formData.odo < 0) return toast.error("Odometer reading cannot be negative");
    if (formData.range && (formData.range < 0 || formData.range > 600)) return toast.error("Range must be between 0 and 600 km (realistic for electric vehicles)");
    if (formData.numberOfSeats && (formData.numberOfSeats < 1 || formData.numberOfSeats > 7)) return toast.error("Number of seats must be between 1 and 7");
    
    const imgs = formData.images || [];
    if (imgs.length === 0) return toast.error("Please upload at least one photo of your vehicle");
    if (imgs.some(i => !i.url || !i.title?.trim())) return toast.error("Each photo must have a title and a URL.");

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
        batterycapacity: formData.batteryCapacity ? formData.batteryCapacity.toString() : "0",
        range: formData.range ? Math.min(parseInt(formData.range), 600) : 0,
        chargingtime: formData.chargingTime ? parseInt(formData.chargingTime) : 0,
        color: formData.color || "",
        numberofseat: formData.numberOfSeats ? Math.min(parseInt(formData.numberOfSeats), 7) : 4,
        style: formData.style || "",
        bodyinsurance: !!formData.bodyInsurance,
        vehicleinspection: !!formData.vehicleInspection,
        licenseplate: formData.licensePlate || (() => {
          // Generate Vietnamese license plate format: 30A-1234 (8 chars max)
          const digits = Math.floor(Math.random() * 90) + 10; // 10-99
          const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
          const numbers = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
          return `${digits}${letter}-${numbers}`;
        })(),
        origin: formData.origin || "",
        yearmanufacture: formData.year ? parseInt(formData.year) : new Date().getFullYear(),
      },
      vehicleImages: imgs.map(i => i.url),
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
      toast.success("Vehicle posted successfully! Your listing is pending admin approval.");
      
      // Clear draft
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      
      // Call onSubmit callback
      onSubmit(created || payload);
      
      // Navigate to home after a short delay
      setTimeout(() => {
        navigate("/", { 
          replace: true,
          state: { 
            message: "Your vehicle listing has been submitted for review. You'll be notified once it's approved." 
          }
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
        if (typeof errorData === 'string') {
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

  const handleLocationSelect = (locationData) => {
    updateFormData("coords", locationData.coords);
    updateFormData("location", locationData.address);
    toast.success("Location selected successfully!");
  };

  // ✅ form wrapper ngăn submit ngầm (tránh remount)
  return (
    <>
      <form onSubmit={(e)=>e.preventDefault()} className="vehicle-wizard space-y-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step/4)*100)}% Complete</span>
          </div>
          <div className="v-progress h-2"><div style={{ width: `${(step/4)*100}%` }} /></div>
        </div>

        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between">
          <button className="v-btn v-btn-outline" onClick={()=>setStep(s=>Math.max(1,s-1))} disabled={step===1}>Previous</button>
          {step===4 ? (
            <button className="v-btn v-btn-primary"
                    onClick={submitForm}
                    disabled={!formData.agreeTerms || !formData.confirmOwnership}>
              Submit Listing
            </button>
          ) : (
            <button className="v-btn v-btn-primary" onClick={() => {
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
