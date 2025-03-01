import CategoriesHeader from "@/components/store/layout/categories-header/CategoriesHeader";
import Footer from "@/components/store/layout/footer/Footer";
import Header from "@/components/store/layout/header/Header";
import React from "react";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <CategoriesHeader />
      {children}
      <Footer />
    </div>
  );
};

export default StoreLayout;
