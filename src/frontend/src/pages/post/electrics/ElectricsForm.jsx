import React from "react";
import { Battery, Camera, FileText, DollarSign, MapPin, Upload, X } from "lucide-react";

/* =========================
   State init / helpers
   ========================= */
export const initialElectricsData = {
  // Basic
  title: "", brand: "", model: "", year: "", condition: "", description: "",
  // Battery core
  batteryCapacity: "", batteryHealth: "", batteryBrand: "", batteryModel: "",
  chargingSpeed: "", warrantyRemaining: "",
  // Battery tech
  chemistry: "", voltage: "", cycleCount: "", bmsStatus: "",
  connectorType: "", compatibility: "", manufactureDate: "", serialNumber: "",
  dimensions: "", weightKg: "",
  // Listing
  listingType: "sale", price: "", reservePrice: "", auctionDuration: "7", acceptOffers: true,
  // Location
  location: "", deliveryOptions: [],
  // Media
  images: [], documents: [],
  // Legal/Safety
  hazmatAck: false, agreeTerms: false, confirmOwnership: false,
};

export const batteryBrands = ["Tesla","CATL","BYD","LG Energy Solution","Panasonic","Samsung SDI","SK Innovation","CALB"];
export const basicYears = Array.from({ length: 15 }, (_, i) => 2024 - i);

export const validateElectrics = (d) => {
  const errors = {};
  const need = ["title","brand","model","year","condition","batteryCapacity","batteryHealth","chemistry","voltage"];
  need.forEach(k => { if(!d[k]) errors[k] = "Required"; });
  if (!d.hazmatAck) errors.hazmatAck = "Acknowledge hazmat transport.";
  if (d.listingType === "sale" && !d.price) errors.price = "Price is required for sale listing.";
  return errors;
};

export const sanitizeElectricsPayload = (d, uploadedImages, currentUser) => ({
  // common
  title: d.title, brand: d.brand, model: d.model, year: d.year, condition: d.condition, description: d.description,
  listingType: d.listingType, price: d.price, reservePrice: d.reservePrice, auctionDuration: d.auctionDuration,
  acceptOffers: d.acceptOffers, location: d.location, deliveryOptions: d.deliveryOptions,
  images: uploadedImages, documents: d.documents,
  // battery
  batteryCapacity: d.batteryCapacity, batteryHealth: d.batteryHealth, batteryBrand: d.batteryBrand,
  batteryModel: d.batteryModel, chargingSpeed: d.chargingSpeed, warrantyRemaining: d.warrantyRemaining,
  chemistry: d.chemistry, voltage: d.voltage, cycleCount: d.cycleCount, bmsStatus: d.bmsStatus,
  connectorType: d.connectorType, compatibility: d.compatibility, manufactureDate: d.manufactureDate,
  serialNumber: d.serialNumber, dimensions: d.dimensions, weightKg: d.weightKg, hazmatAck: d.hazmatAck,
  // meta
  createdAt: new Date().toISOString(), seller: currentUser,
});

/* =========================
   Small atoms
   ========================= */
const L = ({ htmlFor, children }) => <label htmlFor={htmlFor} className="v-label">{children}</label>;
const Inp = (props) => <input {...props} className={`v-input ${props.className||""}`} />;
const Textarea = (props) => <textarea {...props} className={`v-textarea ${props.className||""}`} />;
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

/* =========================
   Steps
   ========================= */
export const StepBasic = ({ data, set }) => (
  <Card title="Basic Information" icon={<Battery className="w-5 h-5" />}>
    <div className="v-grid">
      <div>
        <L htmlFor="title">Listing Title *</L>
        <Inp id="title" placeholder="Tesla Model S Battery Pack 100kWh" value={data.title}
             onChange={(e)=>set("title", e.target.value)} />
      </div>
      <div>
        <L htmlFor="brand">Brand *</L>
        <select id="brand" className="v-select" value={data.brand} onChange={(e)=>set("brand", e.target.value)}>
          <option value="">Select brand</option>
          {batteryBrands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <L htmlFor="model">Model *</L>
        <Inp id="model" placeholder="Model S Battery" value={data.model} onChange={(e)=>set("model", e.target.value)} />
      </div>
      <div>
        <L htmlFor="year">Year *</L>
        <select id="year" className="v-select" value={data.year} onChange={(e)=>set("year", e.target.value)}>
          <option value="">Select year</option>
          {basicYears.map(y => <option key={y} value={String(y)}>{y}</option>)}
        </select>
      </div>
      <div>
        <L htmlFor="condition">Condition *</L>
        <select id="condition" className="v-select" value={data.condition} onChange={(e)=>set("condition", e.target.value)}>
          <option value="">Select condition</option>
          <option value="excellent">Excellent</option>
          <option value="very-good">Very Good</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>
    </div>

    <div className="mt-2">
      <L htmlFor="description">Description *</L>
      <Textarea id="description" rows={4}
        placeholder="State health, usage, provenance, any replacements or repairs..."
        value={data.description} onChange={(e)=>set("description", e.target.value)} />
    </div>
  </Card>
);

export const StepBattery = ({ data, set }) => (
  <Card title="Battery Technical Specs" icon={<Battery className="w-5 h-5" />}>
    <div className="v-grid">
      <div>
        <L htmlFor="batteryCapacity">Battery Capacity (kWh) *</L>
        <Inp id="batteryCapacity" type="number" placeholder="100" value={data.batteryCapacity}
             onChange={(e)=>set("batteryCapacity", e.target.value)} />
      </div>
      <div>
        <L htmlFor="batteryHealth">Battery Health (%) *</L>
        <Inp id="batteryHealth" type="number" min="0" max="100" placeholder="94" value={data.batteryHealth}
             onChange={(e)=>set("batteryHealth", e.target.value)} />
      </div>
      <div>
        <L htmlFor="chemistry">Chemistry *</L>
        <select id="chemistry" className="v-select" value={data.chemistry} onChange={(e)=>set("chemistry", e.target.value)}>
          <option value="">Select chemistry</option>
          <option value="NMC">NMC</option><option value="LFP">LFP</option><option value="NCA">NCA</option><option value="Other">Other</option>
        </select>
      </div>
      <div>
        <L htmlFor="voltage">Nominal Voltage (V) *</L>
        <Inp id="voltage" type="number" placeholder="350" value={data.voltage}
             onChange={(e)=>set("voltage", e.target.value)} />
      </div>
      <div>
        <L htmlFor="chargingSpeed">Max Charging Speed (kW)</L>
        <Inp id="chargingSpeed" type="number" placeholder="250" value={data.chargingSpeed}
             onChange={(e)=>set("chargingSpeed", e.target.value)} />
      </div>
      <div>
        <L htmlFor="warrantyRemaining">Warranty Remaining</L>
        <Inp id="warrantyRemaining" placeholder="18 months" value={data.warrantyRemaining}
             onChange={(e)=>set("warrantyRemaining", e.target.value)} />
      </div>
      <div>
        <L htmlFor="batteryBrand">Battery Manufacturer</L>
        <select id="batteryBrand" className="v-select" value={data.batteryBrand} onChange={(e)=>set("batteryBrand", e.target.value)}>
          <option value="">Select manufacturer</option>
          {batteryBrands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <L htmlFor="batteryModel">Battery Model</L>
        <Inp id="batteryModel" placeholder="2170 Cell" value={data.batteryModel}
             onChange={(e)=>set("batteryModel", e.target.value)} />
      </div>
      <div>
        <L htmlFor="cycleCount">Estimated Cycle Count</L>
        <Inp id="cycleCount" type="number" placeholder="800" value={data.cycleCount}
             onChange={(e)=>set("cycleCount", e.target.value)} />
      </div>
      <div>
        <L htmlFor="bmsStatus">BMS Status</L>
        <Inp id="bmsStatus" placeholder="OK / Replaced / Needs Service"
             value={data.bmsStatus} onChange={(e)=>set("bmsStatus", e.target.value)} />
      </div>
      <div>
        <L htmlFor="connectorType">Connector / Interface</L>
        <select id="connectorType" className="v-select" value={data.connectorType}
                onChange={(e)=>set("connectorType", e.target.value)}>
          <option value="">Select connector</option>
          <option value="NACS">NACS</option><option value="CCS">CCS</option><option value="CHAdeMO">CHAdeMO</option><option value="Custom">Custom</option>
        </select>
      </div>
    </div>

    <div className="v-grid mt-2">
      <div>
        <L htmlFor="manufactureDate">Manufacture Date</L>
        <Inp id="manufactureDate" type="date" value={data.manufactureDate}
             onChange={(e)=>set("manufactureDate", e.target.value)} />
      </div>
      <div>
        <L htmlFor="serialNumber">Serial Number</L>
        <Inp id="serialNumber" placeholder="SN-XXXX" value={data.serialNumber}
             onChange={(e)=>set("serialNumber", e.target.value)} />
      </div>
      <div>
        <L htmlFor="dimensions">Dimensions</L>
        <Inp id="dimensions" placeholder="1080 x 1500 x 120 mm"
             value={data.dimensions} onChange={(e)=>set("dimensions", e.target.value)} />
      </div>
      <div>
        <L htmlFor="weightKg">Weight (kg)</L>
        <Inp id="weightKg" type="number" placeholder="480"
             value={data.weightKg} onChange={(e)=>set("weightKg", e.target.value)} />
      </div>
    </div>

    <div className="mt-3">
      <L htmlFor="compatibility">Compatibility</L>
      <Textarea id="compatibility" rows={3} placeholder="e.g., Model S 2016–2020 (Long Range)…"
                value={data.compatibility} onChange={(e)=>set("compatibility", e.target.value)} />
    </div>

    <div className="v-callout mt-3">
      <div className="font-medium mb-1">Safety & Transport Notice</div>
      <p className="text-sm text-blue-700">
        Large-format lithium batteries may be classified as hazardous materials. Ensure compliant packaging and carriers.
      </p>
      <label className="mt-2 inline-flex items-center gap-2">
        <input type="checkbox" checked={data.hazmatAck}
               onChange={(e)=>set("hazmatAck", e.target.checked)} />
        <span className="text-sm">I acknowledge hazardous-material transport requirements.</span>
      </label>
    </div>

    <div className="v-callout mt-3">
      <div className="font-medium mb-1">Battery Health Certificate</div>
      <p className="text-sm text-blue-700">
        Uploading an official report can increase listing value by up to 15%.
      </p>
      <label className="v-btn v-btn-outline mt-3 inline-flex items-center gap-2 cursor-pointer">
        <FileText className="w-4 h-4" /> Upload Battery Report
        <input type="file" className="hidden" />
      </label>
    </div>
  </Card>
);

export const StepMedia = ({ uploadedImages, onUpload, onRemove }) => (
  <Card title="Photos & Documents" icon={<Camera className="w-5 h-5" />}>
    <div className="mb-6">
      <L>Upload Photos *</L>
      <div className="v-dropzone">
        <input id="image-upload" type="file" multiple accept="image/*" className="hidden"
               onChange={(e)=>onUpload(e.target.files)} />
        <label htmlFor="image-upload" className="cursor-pointer block">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600">Click to upload images or drag and drop</p>
          <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB each (max 20 images)</p>
        </label>
      </div>
    </div>

    {uploadedImages?.length > 0 && (
      <div className="mt-2">
        <p className="text-sm font-medium mb-3">Uploaded Images ({uploadedImages.length})</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedImages.map((src, i)=>(
            <div key={i} className="relative group">
              <img src={src} alt={`Upload ${i+1}`} className="w-full h-24 object-cover rounded-md" />
              <button onClick={()=>onRemove(i)} className="v-chip-remove"><X className="w-3 h-3" /></button>
              {i===0 && <span className="v-badge">Main Photo</span>}
            </div>
          ))}
        </div>
      </div>
    )}

    <hr className="my-6"/>

    <div>
      <L>Additional Documents</L>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {["Battery Health Report","BMS Log / Diagnostic","Proof of Purchase","Warranty Info"].map(lbl=>(
          <label key={lbl} className="v-btn v-btn-outline h-20 flex flex-col items-center justify-center gap-2 cursor-pointer">
            <FileText className="w-6 h-6" /><span>{lbl}</span>
            <input type="file" className="hidden" />
          </label>
        ))}
      </div>
    </div>
  </Card>
);

export const StepPricing = ({ data, set }) => (
  <Card title="Pricing & Listing Type" icon={<DollarSign className="w-5 h-5" />}>
    <div className="grid md:grid-cols-2 gap-3">
      <label className={`v-radio-card ${data.listingType==="sale" ? "selected":""}`}>
        <input type="radio" name="ltype" className="hidden" checked={data.listingType==="sale"}
               onChange={()=>set("listingType","sale")} />
        <div>
          <div className="font-medium">Fixed Price Sale</div>
          <div className="text-sm text-muted-foreground">Set a fixed price for immediate purchase</div>
        </div>
      </label>
      <label className={`v-radio-card ${data.listingType==="auction" ? "selected":""}`}>
        <input type="radio" name="ltype" className="hidden" checked={data.listingType==="auction"}
               onChange={()=>set("listingType","auction")} />
        <div>
          <div className="font-medium">Auction</div>
          <div className="text-sm text-muted-foreground">Let buyers bid on your item</div>
        </div>
      </label>
    </div>

    <div className="v-grid mt-4">
      {data.listingType === "sale" ? (
        <div>
          <L htmlFor="price">Price (USD) *</L>
          <div className="relative">
            <DollarSign className="v-left-icon" />
            <Inp id="price" type="number" placeholder="12000" value={data.price}
                 onChange={(e)=>set("price", e.target.value)} className="pl-9" />
          </div>
        </div>
      ) : (
        <>
          <div>
            <L htmlFor="reservePrice">Reserve Price (USD)</L>
            <div className="relative">
              <DollarSign className="v-left-icon" />
              <Inp id="reservePrice" type="number" placeholder="9000" value={data.reservePrice}
                   onChange={(e)=>set("reservePrice", e.target.value)} className="pl-9" />
            </div>
          </div>
          <div>
            <L htmlFor="auctionDuration">Auction Duration</L>
            <select id="auctionDuration" className="v-select" value={data.auctionDuration}
                    onChange={(e)=>set("auctionDuration", e.target.value)}>
              <option value="3">3 days</option><option value="5">5 days</option>
              <option value="7">7 days</option><option value="10">10 days</option>
            </select>
          </div>
        </>
      )}
    </div>

    <label className="mt-3 inline-flex items-center gap-2">
      <input type="checkbox" checked={data.acceptOffers} onChange={(e)=>set("acceptOffers", e.target.checked)} />
      <span>Accept offers from buyers</span>
    </label>

    <div className="v-callout mt-4">
      <div className="font-medium">Pricing Tip</div>
      <div className="text-sm text-muted-foreground">Verified health report tends to increase close rate and price.</div>
    </div>
  </Card>
);

export const StepDelivery = ({ data, set }) => {
  const options = [
    { id: "pickup", label: "Local Pickup", desc: "Buyer picks up at your location" },
    { id: "delivery-local", label: "Local Delivery", desc: "Deliver within 50 miles" },
    { id: "delivery-regional", label: "Regional Freight", desc: "Heavy item via regional freight" },
  ];
  const toggle = (id, checked) => set("deliveryOptions",
    checked ? [...data.deliveryOptions, id] : data.deliveryOptions.filter(x=>x!==id)
  );

  return (
    <Card title="Location & Delivery" icon={<MapPin className="w-5 h-5" />}>
      <div>
        <L htmlFor="location">Location *</L>
        <div className="relative">
          <MapPin className="v-left-icon" />
          <Inp id="location" placeholder="San Francisco, CA" className="pl-9"
               value={data.location} onChange={(e)=>set("location", e.target.value)} />
        </div>
      </div>

      <div className="mt-4">
        <L>Delivery Options</L>
        {options.map(o=>(
          <label key={o.id} className="v-check-row">
            <input type="checkbox"
                   checked={data.deliveryOptions.includes(o.id)}
                   onChange={(e)=>toggle(o.id, e.target.checked)} />
            <div className="flex-1">
              <div className="font-medium">{o.label}</div>
              <div className="text-sm text-muted-foreground">{o.desc}</div>
            </div>
          </label>
        ))}
      </div>
    </Card>
  );
};

export const StepReview = ({ data, images }) => (
  <Card title="Review & Submit">
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <div className="font-semibold mb-3">Listing Summary</div>
        <div className="space-y-2 text-sm">
          <div className="v-kv"><span>Title:</span><span>{data.title || "—"}</span></div>
          <div className="v-kv"><span>Brand / Model:</span><span>{data.brand} {data.model}</span></div>
          <div className="v-kv"><span>Year:</span><span>{data.year || "—"}</span></div>
          <div className="v-kv"><span>Chemistry:</span><span>{data.chemistry || "—"}</span></div>
          <div className="v-kv"><span>Voltage:</span><span>{data.voltage || "—"} V</span></div>
          <div className="v-kv"><span>Price:</span><span>${parseInt(data.price || "0").toLocaleString()}</span></div>
          <div className="v-kv"><span>Location:</span><span>{data.location || "—"}</span></div>
        </div>
      </div>
      <div>
        <div className="font-semibold mb-3">Listing Preview</div>
        {images?.[0] && (
          <div className="v-aspect-video mb-2">
            <img src={images[0]} alt="Preview" />
          </div>
        )}
        <p className="text-sm text-muted-foreground">{(data.description || "").slice(0, 120)}...</p>
      </div>
    </div>

    <hr className="my-6"/>

    <div className="space-y-3">
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={data.confirmOwnership}
               onChange={(e)=>data._set && data._set("confirmOwnership", e.target.checked)} />
        <span className="text-sm">I confirm that I am the legal owner of this battery pack and have the right to sell it</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={data.agreeTerms}
               onChange={(e)=>data._set && data._set("agreeTerms", e.target.checked)} />
        <span className="text-sm">
          I agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Seller Guidelines</a>
        </span>
      </label>
    </div>
  </Card>
);

/* Register steps for Wizard */
export const ElectricsSteps = [
  { key: "basic",    title: "Basic",    component: StepBasic },
  { key: "battery",  title: "Battery",  component: StepBattery },
  { key: "media",    title: "Media",    component: StepMedia },
  { key: "pricing",  title: "Pricing",  component: StepPricing },
  { key: "delivery", title: "Delivery", component: StepDelivery },
  { key: "review",   title: "Review",   component: StepReview },
];
