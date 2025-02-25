import Header from "@/components/store/layout/Header/Header";
import React from "react";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default StoreLayout;
