import { getAllCategories } from "@/queries/category";
import React from "react";
import CategoriesHeaderContainer from "./Container";
import { getAllOfferTags } from "@/queries/offer-tag";

const CategoriesHeader = async () => {
  const categories = await getAllCategories();
  const offerTags = await getAllOfferTags();
  return (
    <div className="w-full pt-2 pb-3 px-0 bg-gradient-to-r from-slate-500 to-slate-500">
      <CategoriesHeaderContainer
        categories={categories}
        offerTags={offerTags}
      />
    </div>
  );
};

export default CategoriesHeader;
