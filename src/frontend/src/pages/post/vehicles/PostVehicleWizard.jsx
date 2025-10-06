import React from "react";
import CreateListingForm from "./CreateListingForm";


export default function PostVehicleWizard() {
  return (
    <div className="mx-auto max-w-6xl" style={{ padding: "24px 0" }}>
      <h1 className="text-2xl" style={{ fontWeight: 700, marginBottom: 4 }}>
        Create Vehicle Post
      </h1>
      <p className="text-gray-600" style={{ marginBottom: 24 }}>
        Post your electric vehicle for sale. Provide detailed information to attract serious buyers.
      </p>
      <CreateListingForm
        listingType="vehicle"
        onSubmit={(data) => console.log("SUBMIT LISTING:", data)}
      />
    </div>
  );
}
