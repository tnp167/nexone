"use client";
import { StoreType } from "@/lib/types";
import React, { useState } from "react";
import Instructions from "./Instructions";
import ProgressBar from "./ProgressBar";
import Step1 from "./steps/step-1/Step-1";
import Step2 from "./steps/step-2/Step-2";
import Step3 from "./steps/step-3/Step-3";
import Step4 from "./steps/step-4/Step-4";
const ApplySellerMultiFormm = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<StoreType>({
    name: "",
    description: "",
    email: "",
    phone: "",
    logo: "",
    cover: "",
    url: "",
    defaultShippingService: "",
    defaultDeliveryTimeMax: 0,
    defaultDeliveryTimeMin: 0,
    defaultShippingFeeFixed: 0,
    defaultShippingFeesForAdditionalItem: 0,
    defaultShippingFeesPerItem: 0,
    defaultShippingFeePerKg: 0,
    returnPolicy: "",
  });
  return (
    <div className="grid grid-cols-[400px_1fr]">
      <Instructions />
      <div className="relative p-5 w-full">
        <ProgressBar step={step} />
        {/* Steps */}
        {step === 1 && <Step1 step={step} setStep={setStep} />}
        {step === 2 && (
          <Step2
            formData={formData}
            setFormData={setFormData}
            step={step}
            setStep={setStep}
          />
        )}
        {step === 3 && (
          <Step3
            formData={formData}
            setFormData={setFormData}
            step={step}
            setStep={setStep}
          />
        )}
        {step === 4 && <Step4 />}
      </div>
    </div>
  );
};

export default ApplySellerMultiFormm;
