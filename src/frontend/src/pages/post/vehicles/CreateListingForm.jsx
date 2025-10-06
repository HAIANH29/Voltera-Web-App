import React, { useState } from "react";
import { Upload, X, Plus, Car, Battery, Camera, FileText, MapPin, DollarSign, Gauge } from "lucide-react";
import toast from "react-hot-toast";
import "./createListingForm.css";

// props gợi ý (nếu cần dùng lại cho "battery")
export default function CreateListingForm({ listingType = "vehicle", currentUser = null, onSubmit = () => {} }) {
  const [step, setStep] = useState(1);
  const totalSteps = listingType === "vehicle" ? 6 : 5;

  const [formData, setFormData] = useState({
    // Basic
    title: "",
    brand: "",
    model: "",
    year: "",
    condition: "",
    description: "",

    // Vehicle specific
    mileage: "",
    bodyType: "",
    color: "",
    fuelType: "electric",
    transmission: "automatic",
    drivetrain: "",

    // Battery
    batteryCapacity: "",
    batteryHealth: "",
    batteryBrand: "",
    batteryModel: "",
    chargingSpeed: "",
    warrantyRemaining: "",

    // Pricing & Listing
    listingType: "sale",
    price: "",
    reservePrice: "",
    auctionDuration: "7",
    acceptOffers: true,

    // Location & Contact
    location: "",
    deliveryOptions: [],

    // Features
    features: [],
    customFeatures: "",

    // Media
    images: [],
    documents: [],

    // Verification
    agreeTerms: false,
    confirmOwnership: false,
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const vehicleBrands = [
    "Tesla","BMW","Audi","Mercedes-Benz","Nissan","Chevrolet","Ford","Volkswagen","Hyundai","Kia",
    "Porsche","Jaguar","Volvo","Polestar","Rivian","Lucid","BYD","Genesis",
  ];
  const batteryBrands = ["Tesla","CATL","BYD","LG Energy Solution","Panasonic","Samsung SDI","SK Innovation","CALB"];
  const vehicleFeatures = [
    "Autopilot/Self-Driving","Premium Interior","Supercharger Access","Mobile Connectivity","Over-the-Air Updates",
    "Premium Sound System","All-Weather Capability","Advanced Safety Features","Heated Seats","Cooled Seats",
    "Panoramic Roof","Tow Package","Performance Package","FSD Computer",
  ];

  const updateFormData = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  // Fake upload (demo)
  const handleImageUpload = (files) => {
    if (!files) return;
    let p = 0;
    const timer = setInterval(() => {
      p += 12;
      setUploadProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(timer);
        setUploadProgress(0);
        const imgs = Array.from(files).map((_, i) =>
          `https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=400&h=300&fit=crop&q=80&sig=${Date.now() + i}`
        );
        setUploadedImages((prev) => [...prev, ...imgs]);
        toast.success(`${files.length} image(s) uploaded successfully`);
      }
    }, 180);
  };
  const removeImage = (idx) => setUploadedImages((prev) => prev.filter((_, i) => i !== idx));

  const nextStep = () => step < totalSteps && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  const submitForm = () => {
    if (!formData.agreeTerms || !formData.confirmOwnership) {
      toast.error("Please accept the terms and confirm ownership");
      return;
    }
    const listingData = {
      ...formData,
      images: uploadedImages,
      createdAt: new Date().toISOString(),
      seller: currentUser,
    };
    onSubmit(listingData);
    toast.success("Listing created successfully! It will be reviewed within 24 hours.");
  };

  // ==== UI blocks (Card / Row) ====
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
    <label htmlFor={htmlFor} className="v-label">{children}</label>
  );
  const Inp = (props) => <input {...props} className={`v-input ${props.className || ""}`} />;
  const Textarea = (props) => <textarea {...props} className={`v-textarea ${props.className || ""}`} />;

  // ==== Steps ====
  const Step1 = () => (
    <Card title="Basic Information" icon={listingType === "vehicle" ? <Car className="w-5 h-5" /> : <Battery className="w-5 h-5" />}>
      <div className="v-grid">
        <div>
          <L htmlFor="title">Listing Title *</L>
          <Inp id="title" placeholder={listingType==="vehicle" ? "2021 Tesla Model 3 Long Range" : "Tesla Model S Battery Pack 100kWh"}
               value={formData.title} onChange={(e)=>updateFormData("title", e.target.value)} />
        </div>

        <div>
          <L htmlFor="brand">Brand *</L>
          <select id="brand" className="v-select"
                  value={formData.brand} onChange={(e)=>updateFormData("brand", e.target.value)}>
            <option value="">Select brand</option>
            {(listingType==="vehicle" ? vehicleBrands : batteryBrands).map(b=><option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <L htmlFor="model">Model *</L>
          <Inp id="model" placeholder={listingType==="vehicle" ? "Model 3" : "Model S Battery"}
               value={formData.model} onChange={(e)=>updateFormData("model", e.target.value)} />
        </div>

        <div>
          <L htmlFor="year">Year *</L>
          <select id="year" className="v-select"
                  value={formData.year} onChange={(e)=>updateFormData("year", e.target.value)}>
            <option value="">Select year</option>
            {Array.from({length:15},(_,i)=>2024-i).map(y=><option key={y} value={String(y)}>{y}</option>)}
          </select>
        </div>

        <div>
          <L htmlFor="condition">Condition *</L>
          <select id="condition" className="v-select"
                  value={formData.condition} onChange={(e)=>updateFormData("condition", e.target.value)}>
            <option value="">Select condition</option>
            <option value="excellent">Excellent</option>
            <option value="very-good">Very Good</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        {listingType==="vehicle" && (
          <div>
            <L htmlFor="mileage">Mileage *</L>
            <div className="relative">
              <Gauge className="v-left-icon" />
              <Inp id="mileage" type="number" placeholder="25000"
                   value={formData.mileage} onChange={(e)=>updateFormData("mileage", e.target.value)}
                   className="pl-9" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-2">
        <L htmlFor="description">Description *</L>
        <Textarea id="description" rows={4}
                  placeholder="Provide a detailed description of the item, including its condition, features, and any relevant history..."
                  value={formData.description} onChange={(e)=>updateFormData("description", e.target.value)} />
      </div>
    </Card>
  );

  const Step2 = () => (
    <Card title="Battery Information" icon={<Battery className="w-5 h-5" />}>
      <div className="v-grid">
        <div>
          <L htmlFor="batteryCapacity">Battery Capacity (kWh) *</L>
          <Inp id="batteryCapacity" type="number" placeholder="75"
               value={formData.batteryCapacity} onChange={(e)=>updateFormData("batteryCapacity", e.target.value)} />
        </div>
        <div>
          <L htmlFor="batteryHealth">Battery Health (%) *</L>
          <Inp id="batteryHealth" type="number" placeholder="94" min="0" max="100"
               value={formData.batteryHealth} onChange={(e)=>updateFormData("batteryHealth", e.target.value)} />
        </div>

        {listingType==="battery" && (
          <>
            <div>
              <L htmlFor="batteryBrand">Battery Manufacturer</L>
              <select id="batteryBrand" className="v-select"
                      value={formData.batteryBrand} onChange={(e)=>updateFormData("batteryBrand", e.target.value)}>
                <option value="">Select manufacturer</option>
                {batteryBrands.map(b=><option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <L htmlFor="batteryModel">Battery Model</L>
              <Inp id="batteryModel" placeholder="2170 Cell"
                   value={formData.batteryModel} onChange={(e)=>updateFormData("batteryModel", e.target.value)} />
            </div>
          </>
        )}

        <div>
          <L htmlFor="chargingSpeed">Max Charging Speed (kW)</L>
          <Inp id="chargingSpeed" type="number" placeholder="250"
               value={formData.chargingSpeed} onChange={(e)=>updateFormData("chargingSpeed", e.target.value)} />
        </div>

        <div>
          <L htmlFor="warrantyRemaining">Warranty Remaining</L>
          <Inp id="warrantyRemaining" placeholder="18 months"
               value={formData.warrantyRemaining} onChange={(e)=>updateFormData("warrantyRemaining", e.target.value)} />
        </div>
      </div>

      <div className="v-callout">
        <div className="font-medium mb-1">Battery Health Certificate</div>
        <p className="text-sm text-blue-700">
          We recommend getting a professional battery health assessment to increase buyer confidence.
          Verified battery reports can increase your listing value by up to 15%.
        </p>
        <label className="v-btn v-btn-outline mt-3 inline-flex items-center gap-2 cursor-pointer">
          <FileText className="w-4 h-4" /> Upload Battery Report
          <input type="file" className="hidden" />
        </label>
      </div>
    </Card>
  );

  const Step3 = () => (
    <Card title="Photos & Documents" icon={<Camera className="w-5 h-5" />}>
      <div className="mb-6">
        <L>Upload Photos *</L>
        <div className="v-dropzone">
          <input id="image-upload" type="file" multiple accept="image/*" className="hidden"
                 onChange={(e)=>handleImageUpload(e.target.files)} />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-600">Click to upload images or drag and drop</p>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB each (max 20 images)</p>
          </label>
        </div>

        {uploadProgress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Uploading...</span><span>{uploadProgress}%</span>
            </div>
            <div className="v-progress"><div style={{width:`${uploadProgress}%`}}/></div>
          </div>
        )}

        {uploadedImages.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-3">Uploaded Images ({uploadedImages.length})</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedImages.map((src, i)=>(
                <div key={i} className="relative group">
                  <img src={src} alt={`Upload ${i+1}`} className="w-full h-24 object-cover rounded-md" />
                  <button onClick={()=>removeImage(i)} className="v-chip-remove">
                    <X className="w-3 h-3" />
                  </button>
                  {i===0 && <span className="v-badge">Main Photo</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <hr className="my-6"/>

      <div>
        <L>Additional Documents</L>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {["Vehicle Title","Service Records","Inspection Report","Warranty Info"].map(lbl=>(
            <label key={lbl} className="v-btn v-btn-outline h-20 flex flex-col items-center justify-center gap-2 cursor-pointer">
              <FileText className="w-6 h-6" /><span>{lbl}</span>
              <input type="file" className="hidden" />
            </label>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-md bg-amber-50 mt-6">
        <div className="font-medium text-amber-900 mb-1">Photography Tips</div>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Take photos in good lighting, preferably outdoors</li>
          <li>• Include exterior angles, interior, dashboard, and any damage</li>
          <li>• For batteries: show connection points, labels, and condition</li>
          <li>• The first image will be your main listing photo</li>
        </ul>
      </div>
    </Card>
  );

  const Step4 = () => (
    <Card title="Pricing & Listing Type" icon={<DollarSign className="w-5 h-5" />}>
      <div className="space-y-4">
        <L>Listing Type *</L>
        <div className="grid md:grid-cols-2 gap-3">
          <label className={`v-radio-card ${formData.listingType==="sale" ? "selected":""}`}>
            <input type="radio" name="ltype" className="hidden" checked={formData.listingType==="sale"}
                   onChange={()=>updateFormData("listingType","sale")} />
            <div>
              <div className="font-medium">Fixed Price Sale</div>
              <div className="text-sm text-muted-foreground">Set a fixed price for immediate purchase</div>
            </div>
          </label>
          <label className={`v-radio-card ${formData.listingType==="auction" ? "selected":""}`}>
            <input type="radio" name="ltype" className="hidden" checked={formData.listingType==="auction"}
                   onChange={()=>updateFormData("listingType","auction")} />
            <div>
              <div className="font-medium">Auction</div>
              <div className="text-sm text-muted-foreground">Let buyers bid on your item</div>
            </div>
          </label>
        </div>
      </div>

      <div className="v-grid mt-4">
        {formData.listingType === "sale" ? (
          <div>
            <L htmlFor="price">Price (USD) *</L>
            <div className="relative">
              <DollarSign className="v-left-icon" />
              <Inp id="price" type="number" placeholder="42000" value={formData.price}
                   onChange={(e)=>updateFormData("price", e.target.value)} className="pl-9" />
            </div>
          </div>
        ) : (
          <>
            <div>
              <L htmlFor="reservePrice">Reserve Price (USD)</L>
              <div className="relative">
                <DollarSign className="v-left-icon" />
                <Inp id="reservePrice" type="number" placeholder="35000" value={formData.reservePrice}
                     onChange={(e)=>updateFormData("reservePrice", e.target.value)} className="pl-9" />
              </div>
            </div>
            <div>
              <L htmlFor="auctionDuration">Auction Duration</L>
              <select id="auctionDuration" className="v-select"
                      value={formData.auctionDuration} onChange={(e)=>updateFormData("auctionDuration", e.target.value)}>
                <option value="3">3 days</option>
                <option value="5">5 days</option>
                <option value="7">7 days</option>
                <option value="10">10 days</option>
              </select>
            </div>
          </>
        )}
      </div>

      <label className="mt-3 inline-flex items-center gap-2">
        <input type="checkbox" checked={formData.acceptOffers}
               onChange={(e)=>updateFormData("acceptOffers", e.target.checked)} />
        <span>Accept offers from buyers</span>
      </label>

      <div className="p-4 rounded-md bg-green-50 mt-4">
        <div className="font-medium text-green-900 mb-1">Pricing Recommendations</div>
        <div className="text-sm text-green-700 space-y-1">
          <p>• Similar {listingType}s in your area: $38,000 - $45,000</p>
          <p>• Market trend: Prices stable over last 30 days</p>
          <p>• Suggested competitive price: $41,500 - $43,000</p>
        </div>
      </div>
    </Card>
  );

  const Step5 = () => (
    <Card title="Location & Delivery" icon={<MapPin className="w-5 h-5" />}>
      <div>
        <L htmlFor="location">Location *</L>
        <div className="relative">
          <MapPin className="v-left-icon" />
          <Inp id="location" placeholder="San Francisco, CA" className="pl-9"
               value={formData.location} onChange={(e)=>updateFormData("location", e.target.value)} />
        </div>
      </div>

      <div className="mt-4">
        <L>Delivery Options</L>
        {[
          { id: "pickup", label: "Local Pickup", desc: "Buyer picks up at your location" },
          { id: "delivery-local", label: "Local Delivery", desc: "Deliver within 50 miles" },
          { id: "delivery-regional", label: "Regional Delivery", desc: "Deliver within 200 miles" },
          { id: "shipping", label: "Nationwide Shipping", desc: "Ship anywhere in the US" },
        ].map((o) => (
          <label key={o.id} className="v-check-row">
            <input
              type="checkbox"
              checked={formData.deliveryOptions.includes(o.id)}
              onChange={(e) => {
                const checked = e.target.checked;
                updateFormData(
                  "deliveryOptions",
                  checked
                    ? [...formData.deliveryOptions, o.id]
                    : formData.deliveryOptions.filter((x) => x !== o.id)
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

      {listingType === "vehicle" && (
        <div className="mt-4">
          <L>Features & Options</L>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {vehicleFeatures.map((f) => (
              <label key={f} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.features.includes(f)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    updateFormData(
                      "features",
                      checked ? [...formData.features, f] : formData.features.filter((x) => x !== f)
                    );
                  }}
                />
                {f}
              </label>
            ))}
          </div>
          <div className="mt-3">
            <L htmlFor="customFeatures">Additional Features</L>
            <Textarea id="customFeatures" rows={3} placeholder="List any additional features..."
                      value={formData.customFeatures} onChange={(e)=>updateFormData("customFeatures", e.target.value)} />
          </div>
        </div>
      )}
    </Card>
  );

  const Step6 = () => (
    <Card title="Review & Submit">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="font-semibold mb-3">Listing Summary</div>
          <div className="space-y-2 text-sm">
            <div className="v-kv"><span>Title:</span><span>{formData.title || "—"}</span></div>
            <div className="v-kv"><span>Brand:</span><span>{formData.brand} {formData.model}</span></div>
            <div className="v-kv"><span>Year:</span><span>{formData.year || "—"}</span></div>
            <div className="v-kv"><span>Price:</span><span>${parseInt(formData.price || "0").toLocaleString()}</span></div>
            <div className="v-kv"><span>Location:</span><span>{formData.location || "—"}</span></div>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-3">Listing Preview</div>
          {uploadedImages[0] && (
            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden mb-2">
              <img src={uploadedImages[0]} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <p className="text-sm text-muted-foreground">{(formData.description || "").slice(0, 100)}...</p>
        </div>
      </div>

      <hr className="my-6"/>

      <div className="space-y-3">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={formData.confirmOwnership}
                 onChange={(e)=>updateFormData("confirmOwnership", e.target.checked)} />
          <span className="text-sm">
            I confirm that I am the legal owner of this {listingType} and have the right to sell it
          </span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={formData.agreeTerms}
                 onChange={(e)=>updateFormData("agreeTerms", e.target.checked)} />
          <span className="text-sm">
            I agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Seller Guidelines</a>
          </span>
        </label>
      </div>

      <div className="p-4 bg-blue-50 rounded-md mt-4 text-sm">
        <div className="font-medium text-blue-900 mb-1">What happens next?</div>
        <ul className="text-blue-700 space-y-1">
          <li>1. Your listing will be reviewed within 24 hours</li>
          <li>2. Once approved, it will be published on the marketplace</li>
          <li>3. You'll receive notifications about inquiries and bids</li>
          <li>4. Our team will guide you through the selling process</li>
        </ul>
      </div>
    </Card>
  );

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      case 5: return <Step5 />;
      case 6: return <Step6 />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step/totalSteps)*100)}% Complete</span>
        </div>
        <div className="v-progress h-2"><div style={{ width: `${(step/totalSteps)*100}%` }} /></div>
      </div>

      {renderStep()}

      {/* Navigation */}
      <div className="flex justify-between">
        <button className="v-btn v-btn-outline" onClick={prevStep} disabled={step===1}>Previous</button>
        {step===totalSteps ? (
          <button className="v-btn v-btn-primary"
                  onClick={submitForm}
                  disabled={!formData.agreeTerms || !formData.confirmOwnership}>
            Submit Listing
          </button>
        ) : (
          <button className="v-btn v-btn-primary" onClick={nextStep}>Next</button>
        )}
      </div>
    </div>
  );
}
