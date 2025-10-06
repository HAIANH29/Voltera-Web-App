import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import "./electrics.css";
import {
  ElectricsSteps,
  initialElectricsData,
  sanitizeElectricsPayload,
  validateElectrics,
} from "./ElectricsForm.jsx";

export default function PostElectricWizard({ currentUser = null, onSubmit = async (payload)=>{} }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [data, setData] = useState(() => ({ ...initialElectricsData }));
  const [uploadedImages, setUploadedImages] = useState([]);
  const total = ElectricsSteps.length;

  const setField = (k, v) => setData(d => ({ ...d, [k]: v }));
  const dataWithSetter = useMemo(() => ({ ...data, _set: setField }), [data]);

  // demo upload (mock)
  const handleImageUpload = (files) => {
    if (!files) return;
    const newImgs = Array.from(files).map((_, i) =>
      `https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=400&h=300&fit=crop&q=80&sig=${Date.now()+i}`
    );
    setUploadedImages(prev => [...prev, ...newImgs]);
    toast.success(`${files.length} image(s) uploaded`);
  };
  const removeImage = (i) => setUploadedImages(prev => prev.filter((_, idx)=>idx!==i));

  const next = () => setStepIdx(i => Math.min(i+1, total-1));
  const prev = () => setStepIdx(i => Math.max(i-1, 0));

  const handleSubmit = async () => {
    const errs = validateElectrics(data);
    if (Object.keys(errs).length) {
      toast.error(Object.values(errs)[0]);
      return;
    }
    if (!data.confirmOwnership || !data.agreeTerms) {
      toast.error("Please confirm ownership and agree to terms.");
      return;
    }
    const payload = sanitizeElectricsPayload(data, uploadedImages, currentUser);
    await onSubmit(payload);
    toast.success("Electrics listing created! Review within 24 hours.");
  };

  const Current = ElectricsSteps[stepIdx].component;

  return (
    <div className="electrics-theme">
      <div className="electrics-wrapper max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Step {stepIdx+1} of {total}</span>
            <span>{Math.round(((stepIdx+1)/total)*100)}% Complete</span>
          </div>
          <div className="v-progress h-2"><div style={{ width: `${((stepIdx+1)/total)*100}%` }} /></div>
        </div>

        <h2 className="electrics-title">Post Electrics (Battery Pack)</h2>
        <p className="electrics-subtle">List a high-voltage EV battery with clear specs & safe delivery options.</p>

        <Current
          data={dataWithSetter}
          set={setField}
          uploadedImages={uploadedImages}
          onUpload={handleImageUpload}
          onRemove={removeImage}
        />

        <div className="flex justify-between">
          <button className="v-btn v-btn-outline" onClick={prev} disabled={stepIdx===0}>Previous</button>
          {stepIdx === total-1 ? (
            <button className="v-btn v-btn-primary" onClick={handleSubmit}>
              Submit Listing
            </button>
          ) : (
            <button className="v-btn v-btn-primary" onClick={next}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
}
