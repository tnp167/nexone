import DataTable from "@/components/ui/data-table";
import { getAllStoreProducts } from "@/queries/product";
import React from "react";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import ProductDetails from "@/components/dashboard/forms/ProductDetails";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import { db } from "@/lib/db";

const SellerProductPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const { storeUrl } = await params;
  const categories = await getAllCategories();
  const products = await getAllStoreProducts(storeUrl);
  const offerTags = await getAllOfferTags();
  const countries = await db.country.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Product
        </>
      }
      modalChildren={
        <ProductDetails
          categories={categories}
          storeUrl={storeUrl}
          offerTags={offerTags}
          countries={countries}
        />
      }
      newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
      filterValue="image"
      data={products || []}
      columns={columns}
      searchPlaceholder="Seach product name"
    />
  );
};

export default SellerProductPage;
