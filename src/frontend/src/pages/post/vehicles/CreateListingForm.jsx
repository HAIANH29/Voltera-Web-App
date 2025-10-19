import React, { useEffect, useMemo, useRef, useState } from "react";
import { Upload, X, Car, Battery, Camera, DollarSign, Gauge } from "lucide-react";
import toast from "react-hot-toast";
import { listingService } from "../../../services/listing.jsx";
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
function Step1({ formData, updateFormData }) {
  return (
    <Card title="Basic Information" icon={<Car className="w-5 h-5" />}>
      <div className="v-grid">
        <div>
          <L htmlFor="title">Listing Title *</L>
          <Inp id="title" placeholder="2021 Tesla Model 3 Long Range"
               value={formData.title ?? ""} onChange={(e)=>updateFormData("title", e.target.value)} />
        </div>

        <div>
          <L htmlFor="brand">Brand *</L>
          <select id="brand" className="v-select"
                  value={formData.brand ?? ""} onChange={(e)=>updateFormData("brand", e.target.value)}>
            <option value="">Select brand</option>
            {vehicleBrands.map(b=><option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <L htmlFor="model">Model *</L>
          <Inp id="model" placeholder="Model 3"
               value={formData.model ?? ""} onChange={(e)=>updateFormData("model", e.target.value)} />
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
          <L htmlFor="condition">Condition *</L>
          <select id="condition" className="v-select"
                  value={formData.condition ?? ""} onChange={(e)=>updateFormData("condition", e.target.value)}>
            <option value="">Select condition</option>
            <option value="excellent">Excellent</option>
            <option value="very-good">Very Good</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div>
          <L htmlFor="mileage">Mileage *</L>
          <div className="relative">
            <Gauge className="v-left-icon" />
            <Inp id="mileage" placeholder="26500" inputMode="numeric" pattern="[0-9]*"
                 value={formData.mileage ?? ""} onChange={(e)=>updateFormData("mileage", e.target.value)}
                 className="pl-9" />
          </div>
        </div>
      </div>

      <div className="mt-2">
        <L htmlFor="description">Description *</L>
        <Textarea id="description" rows={4}
                  placeholder="Condition, features, service history, etc."
                  value={formData.description ?? ""} onChange={(e)=>updateFormData("description", e.target.value)} />
      </div>

      <div className="mt-4">
        <L htmlFor="location">Location *</L>
        <div className="flex gap-2">
          <Inp id="location" placeholder="e.g., District 1, HCMC"
               value={formData.location ?? ""} onChange={(e)=>updateFormData("location", e.target.value)} />
          <button
            type="button"
            className="v-btn v-btn-outline"
            onClick={()=>{
              if (!navigator.geolocation) return toast.error("Geolocation is not supported");
              navigator.geolocation.getCurrentPosition(
                (pos)=>{
                  const { latitude:lat, longitude:lng } = pos.coords;
                  updateFormData("coords", { lat, lng });
                  if (!formData.location) updateFormData("location", `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
                  toast.success("Got current location");
                },
                ()=> toast.error("Unable to get location")
              );
            }}
          >
            Use my location
          </button>
        </div>
        {formData?.coords && (
          <p className="text-xs text-muted-foreground mt-1">
            Coords: {formData.coords.lat.toFixed(5)}, {formData.coords.lng.toFixed(5)}
          </p>
        )}
      </div>
    </Card>
  );
}

function Step2({ formData, updateFormData }) {
  return (
    <Card title="Product Details" icon={<Battery className="w-5 h-5" />}>
      <div className="v-grid">
        <div><L htmlFor="bodyType">Body Type</L><Inp id="bodyType" placeholder="Sedan" value={formData.bodyType ?? ""} onChange={(e)=>updateFormData("bodyType", e.target.value)} /></div>
        <div><L htmlFor="color">Color</L><Inp id="color" placeholder="White" value={formData.color ?? ""} onChange={(e)=>updateFormData("color", e.target.value)} /></div>
        <div><L htmlFor="fuelType">Fuel</L><select id="fuelType" className="v-select" value={formData.fuelType ?? "electric"} onChange={(e)=>updateFormData("fuelType", e.target.value)}><option value="electric">Electric</option><option value="hybrid">Hybrid</option></select></div>
        <div><L htmlFor="transmission">Transmission</L><select id="transmission" className="v-select" value={formData.transmission ?? "automatic"} onChange={(e)=>updateFormData("transmission", e.target.value)}><option value="automatic">Automatic</option><option value="manual">Manual</option></select></div>
        <div><L htmlFor="drivetrain">Drivetrain</L><Inp id="drivetrain" placeholder="RWD / AWD" value={formData.drivetrain ?? ""} onChange={(e)=>updateFormData("drivetrain", e.target.value)} /></div>

        <div><L htmlFor="batteryCapacity">Battery Capacity (kWh)</L><Inp id="batteryCapacity" inputMode="numeric" pattern="[0-9]*" placeholder="75" value={formData.batteryCapacity ?? ""} onChange={(e)=>updateFormData("batteryCapacity", e.target.value)} /></div>
        <div><L htmlFor="batteryHealth">Battery Health (%)</L><Inp id="batteryHealth" inputMode="numeric" pattern="[0-9]*" placeholder="94" value={formData.batteryHealth ?? ""} onChange={(e)=>updateFormData("batteryHealth", e.target.value)} /></div>
        <div><L htmlFor="batteryBrand">Battery Brand</L><select id="batteryBrand" className="v-select" value={formData.batteryBrand ?? ""} onChange={(e)=>updateFormData("batteryBrand", e.target.value)}><option value="">Select brand</option>{batteryBrands.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
        <div><L htmlFor="batteryModel">Battery Model</L><Inp id="batteryModel" placeholder="2170 Cell" value={formData.batteryModel ?? ""} onChange={(e)=>updateFormData("batteryModel", e.target.value)} /></div>
        <div><L htmlFor="chargingSpeed">Max Charging (kW)</L><Inp id="chargingSpeed" inputMode="numeric" pattern="[0-9]*" placeholder="250" value={formData.chargingSpeed ?? ""} onChange={(e)=>updateFormData("chargingSpeed", e.target.value)} /></div>
        <div><L htmlFor="warrantyRemaining">Warranty Remaining</L><Inp id="warrantyRemaining" placeholder="18 months" value={formData.warrantyRemaining ?? ""} onChange={(e)=>updateFormData("warrantyRemaining", e.target.value)} /></div>
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

      <div className="p-4 rounded-md bg-amber-50 mt-6 text-sm text-amber-800">
        Tip: clear, specific titles help moderation (e.g., “Front view”, “Dashboard / Interior”, “Documents / Registration”).
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
      title:"", brand:"", model:"", year:"", condition:"", description:"",
      location:"", coords:null,
      mileage:"", bodyType:"", color:"",
      fuelType:"electric", transmission:"automatic", drivetrain:"",
      batteryCapacity:"", batteryHealth:"", batteryBrand:"", batteryModel:"",
      chargingSpeed:"", warrantyRemaining:"",
      price:"", acceptOffers:true,
      deliveryOptions:[], features:[], customFeatures:"",
      images:[], documents:[],
      agreeTerms:false, confirmOwnership:false,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [formData, setFormData] = useState(initialDraft);

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

  const updateFormData = (field, value) => setFormData((p) => ({ ...p, [field]: value ?? "" }));

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
    const imgs = formData.images || [];
    if (imgs.length === 0 || imgs.some(i => !i.url || !i.title?.trim())) return toast.error("Each photo must have a title and a URL.");

    const payload = {
      title: formData.title,
      description: formData.description,
      price: formData.price ? Number(formData.price) : null,
      status: "PENDING",
      battery: null,
      batteryImages: [],
      vehicle: {
        brand: formData.brand,
        model: formData.model,
        yearManufacture: formData.year ? Number(formData.year) : null,
        condition: formData.condition || null,
        mileage: formData.mileage ? Number(formData.mileage) : null,
        bodyType: formData.bodyType || null,
        color: formData.color || null,
        fuelType: formData.fuelType || null,
        transmission: formData.transmission || null,
        drivetrain: formData.drivetrain || null,
      },
      vehicleImages: imgs.map(i => i.url),
    };

    try {
      const created = await listingService.createPost(payload);
      toast.success("Listing created! Pending review.");
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      onSubmit(created || payload);
    } catch (e) {
      const msg = e?.response?.data || e?.response?.data?.message || "Submit failed";
      toast.error(String(msg));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 formData={formData} updateFormData={updateFormData} />;
      case 2: return <Step2 formData={formData} updateFormData={updateFormData} />;
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

  // ✅ form wrapper ngăn submit ngầm (tránh remount)
  return (
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
          <button className="v-btn v-btn-primary" onClick={()=>setStep(s=>Math.min(4,s+1))}>Next</button>
        )}
      </div>
    </form>
  );
}
