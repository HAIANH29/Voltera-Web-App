import React from "react";
import CreateListingForm from "./CreateListingForm";

export default function PostVehicleWizard() {
  return (
    <div className="vehicle-container">
      <h1 className="pv-title">Create Vehicle Post</h1>
      <p className="pv-sub">
        Post your electric vehicle for sale. Provide detailed information to attract serious buyers.
      </p>

      <CreateListingForm
        listingType="vehicle"
        onSubmit={(data) => console.log("SUBMIT LISTING:", data)}
      />
    </div>
  );
}
