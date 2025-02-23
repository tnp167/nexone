import React from "react";
import ProductDetails from "@/components/dashboard/Forms/ProductDetails";
import { getAllCategories } from "@/queries/category";
import { getProductMainInfo } from "@/queries/product";

const SellerNewProductVariantPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string; productId: string }>;
}) => {
  const { storeUrl, productId } = await params;
  const categories = await getAllCategories();

  const product = await getProductMainInfo(productId);
  if (!product) return null;

  return (
    <div>
      <ProductDetails
        categories={categories}
        storeUrl={storeUrl}
        data={product}
      />
    </div>
  );
};

export default SellerNewProductVariantPage;
