import React from "react";
import { VehiclePostProvider, useVehiclePost } from "./useVehiclePost";
import ProgressBar from "../../../components/ui/ProgressBar";
import RightSidebar from "../../../components/ui/RightSidebar";
import PreviewCard from "../../../components/miniPost/PreviewCard";
import { PostingTips } from "../../../components/ui/RightSidebar";

import Step1BasicInfo from "../steps/Step1BasicInfo";
import Step2Battery from "./steps/Step2Battery";
import Step3PhotosDocs from "./steps/Step3PhotosDocs";
import Step4Pricing from "./steps/Step4Pricing";
import Step5Location from "./steps/Step5Location";
import Step6ReviewSubmit from "./steps/Step6ReviewSubmit";

function Content() {
  const { state, percent } = useVehiclePost();

  const renderStep = () => {
    switch (state.step) {
      case 1: return <Step1BasicInfo />;
      case 2: return <Step2Battery />;
      case 3: return <Step3PhotosDocs />;
      case 4: return <Step4Pricing />;
      case 5: return <Step5Location />;
      case 6: return <Step6ReviewSubmit />;
      default: return null;
    }
  };

  return (
    <div className="mx-auto max-w-6xl py-6">
      <h1 className="text-2xl font-bold mb-1">Create Vehicle Post</h1>
      <p className="text-gray-500 mb-6">
        Post your electric vehicle for sale. Provide detailed information to attract serious buyers.
      </p>

      <ProgressBar percent={percent} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
        <div>{renderStep()}</div>

        {/* Sidebar bên phải: 2 khối */}
        <RightSidebar>
          <PreviewCard data={state.data} />
          <PostingTips />
        </RightSidebar>
      </div>
    </div>
  );
}

export default function PostVehicleWizard() {
  return (
    <VehiclePostProvider>
      <Content />
    </VehiclePostProvider>
  );
}
