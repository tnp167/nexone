import CategoriesHeader from "@/components/store/layout/categories-header/CategoriesHeader";
import Header from "@/components/store/layout/header/Header";
import { FiltersQueryType } from "@/lib/types";
import { getStorePageDetails } from "@/queries/store";
import React from "react";
import StoreDetails from "@/components/store/store-page/StoreDetails";
const StorePage = async ({
  params,
  searchParams,
}: {
  params: { storeUrl: string };
  searchParams: FiltersQueryType;
}) => {
  const store = await getStorePageDetails(params.storeUrl);
  return (
    <>
      <Header />
      <CategoriesHeader />
      <StoreDetails details={store} />
    </>
  );
};

export default StorePage;
