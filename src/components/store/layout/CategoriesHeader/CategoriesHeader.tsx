import { getAllCategories } from "@/queries/category";
import React from "react";
import CategoriesHeaderContainer from "./Container";

const CategoriesHeader = async () => {
  const categories = await getAllCategories();
  return (
    <div className="w-full pt-2 pb-3 px-0 bg-gradient-to-r from-blue-500 to-purple-500">
      <CategoriesHeaderContainer categories={categories} />
    </div>
  );
};

export default CategoriesHeader;
