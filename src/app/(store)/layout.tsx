import CategoriesHeader from "@/components/store/layout/categories-header/CategoriesHeader";
import Footer from "@/components/store/layout/footer/Footer";
import Header from "@/components/store/layout/header/Header";
import React from "react";
import { Toaster } from "react-hot-toast";
const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <CategoriesHeader />
      {children}
      <div className="h-96"></div>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};

export default StoreLayout;
