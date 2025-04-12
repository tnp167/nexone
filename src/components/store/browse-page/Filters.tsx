import { FiltersQueryType } from "@/lib/types";
import React from "react";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import CategoryFilter from "./filters/category/CategoryFilter";
const ProductFilters = async ({ queries }: { queries: FiltersQueryType }) => {
  const { category, subCategory, offer } = await queries;
  const categories = await getAllCategories();
  const offers = await getAllOfferTags();
  return (
    <div className="h-[840px] transition-transform overflow-auto pr-6 pb-3 flex-none basis-[200px] sticky to-0 overflow-x-hidden scrollbar">
      {/* Headers */}
      {/* Filters*/}
      <div className="border-t w-44">
        <CategoryFilter categories={categories} />
        {/* Category Filter */}
        {/* Category Filter */}
      </div>
    </div>
  );
};

export default ProductFilters;
