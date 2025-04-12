import React from "react";
import Header from "@/components/store/layout/header/Header";
import { getProducts } from "@/queries/product";
import ProductList from "@/components/store/shared/ProductList";
import { FiltersQueryType } from "@/lib/types";
import ProductFilters from "@/components/store/browse-page/Filters";
const BrowsePage = async ({
  searchParams,
}: {
  searchParams: FiltersQueryType;
}) => {
  const { category, subCategory, search, offer, size, sort } =
    await searchParams;
  const productsData = await getProducts(
    {
      search,
      category,
      subCategory,
      offer,
      size: Array.isArray(size) ? size : size ? [size] : undefined,
    },
    sort
  );
  const { products } = productsData;
  return (
    <>
      <Header />
      <div className="max-w-[95%] mx-auto">
        <div className="flex mt-5 gap-x-5">
          <ProductFilters queries={searchParams} />
          <div className="p-4 space-y-5">
            {/* Product sort */}
            {/* Product list */}
            <ProductList products={products} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowsePage;
