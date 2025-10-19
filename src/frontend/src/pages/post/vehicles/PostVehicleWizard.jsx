// src/pages/post/vehicles/PostVehicleWizard.jsx
import React from "react";
import CreateListingForm from "./CreateListingForm";

export default function PostVehicleWizard() {
  return (
    <div className="vehicle-container">
      <h1 className="pv-title">Create Vehicle Post</h1>
      <p className="pv-sub">Post your electric vehicle for sale.</p>
      {/* KHÔNG dùng key ở đây */}
      <CreateListingForm listingType="vehicle" />
    </div>
  );
}
