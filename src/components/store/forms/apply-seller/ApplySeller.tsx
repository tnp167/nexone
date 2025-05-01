"use client";
import { StoreType } from "@/lib/types";
import React, { useState } from "react";
import Instructions from "./Instructions";
import ProgressBar from "./ProgressBar";
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
    defaultShippingFeeForAdditionalItem: 0,
    defaultShippingFeePerItem: 0,
    defaultShippingFeePerKg: 0,
    returnPolicy: "",
  });
  return (
    <div className="grid grid-cols-[400px_1fr]">
      <Instructions />
      <div className="relative p-5 w-full">
        <ProgressBar step={step} />
        {/* Steps */}
      </div>
    </div>
  );
};

export default ApplySellerMultiFormm;
