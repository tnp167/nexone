import CategoriesHeader from "@/components/store/layout/CategoriesHeader/CategoriesHeader";
import Footer from "@/components/store/layout/Footer/Footer";
import Header from "@/components/store/layout/Header/Header";
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
