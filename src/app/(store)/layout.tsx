import React from "react";
import { Toaster } from "react-hot-toast";
const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div>{children}</div>
      <Toaster position="top-center" />
    </div>
  );
};

export default StoreLayout;
