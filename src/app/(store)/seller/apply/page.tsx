import React from "react";
import MinimalHeader from "@/components/store/layout/minimal-header/Header";
import ApplySellerMultiFormm from "@/components/store/forms/apply-seller/ApplySeller";
const SellerApplyPage = () => {
  return (
    <div className="bg-white h-screen overflow-y-hidden">
      <MinimalHeader />
      <ApplySellerMultiFormm />
    </div>
  );
};

export default SellerApplyPage;
