import CategoriesHeader from "@/components/store/layout/categories-header/CategoriesHeader";
import Header from "@/components/store/layout/header/Header";
import { FiltersQueryType } from "@/lib/types";
import { getStorePageDetails } from "@/queries/store";
import React from "react";
import StoreDetails from "@/components/store/store-page/StoreDetails";
import ProductFilters from "@/components/store/browse-page/Filters";
import ProductSort from "@/components/store/browse-page/Sort";
const StorePage = async ({
  params,
  searchParams,
}: {
  params: { storeUrl: string };
  searchParams: FiltersQueryType;
}) => {
  const { storeUrl } = await params;
  const store = await getStorePageDetails(storeUrl);
  const searcParamsObj = await searchParams;

  return (
    <>
      <Header />
      <CategoriesHeader />
      <StoreDetails details={store} />
      <div className="max-w-[95%] mx-auto border-t">
        <div className="flex mt-5 gap-x-5">
          <ProductFilters queries={searcParamsObj} storeUrl={storeUrl} />
          <div className="p-4 space-y-5">
            <ProductSort />
          </div>
        </div>
      </div>
    </>
  );
};

export default StorePage;
