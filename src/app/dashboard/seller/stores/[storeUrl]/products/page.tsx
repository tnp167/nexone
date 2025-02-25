import DataTable from "@/components/ui/data-table";
import { getAllStoreProducts } from "@/queries/product";
import React from "react";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import ProductDetails from "@/components/dashboard/Forms/ProductDetails";
import { getAllCategories } from "@/queries/category";

const SellerProductPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const { storeUrl } = await params;
  const categories = await getAllCategories();
  const products = await getAllStoreProducts(storeUrl);

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Product
        </>
      }
      modalChildren={
        <ProductDetails categories={categories} storeUrl={storeUrl} />
      }
      newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
      filterValue="name"
      data={products}
      columns={columns}
      searchPlaceholder="Seach product name"
    />
  );
};

export default SellerProductPage;
