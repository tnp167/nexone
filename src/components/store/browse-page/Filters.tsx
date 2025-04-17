import { FiltersQueryType } from "@/lib/types";
import React from "react";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import CategoryFilter from "./filters/category/CategoryFilter";
import OfferFilter from "./filters/offer/OfferFilter";
import SizeFilter from "./filters/size/SizeFilter";
import FiltersHeader from "./filters/Header";
const ProductFilters = async ({ queries }: { queries: FiltersQueryType }) => {
  const { category, subCategory, offer } = await queries;
  const categories = await getAllCategories();
  const offers = await getAllOfferTags();
  return (
    <div className="h-[840px] transition-transform overflow-auto pr-6 pb-3 flex-none basis-[200px] sticky to-0 overflow-x-hidden scrollbar">
      <FiltersHeader queries={queries} />
      {/* Filters*/}
      <div className="border-t w-44">
        <CategoryFilter categories={categories} />
        <OfferFilter offers={offers} />
        <SizeFilter queries={queries} />
      </div>
    </div>
  );
};

export default ProductFilters;
