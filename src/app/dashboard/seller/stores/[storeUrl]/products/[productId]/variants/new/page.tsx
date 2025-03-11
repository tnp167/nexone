import React from "react";
import ProductDetails from "@/components/dashboard/forms/ProductDetails";
import { getAllCategories } from "@/queries/category";
import { getProductMainInfo } from "@/queries/product";
import { db } from "@/lib/db";
import { getAllOfferTags } from "@/queries/offer-tag";

const SellerNewProductVariantPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string; productId: string }>;
}) => {
  const { storeUrl, productId } = await params;
  const categories = await getAllCategories();
  const offerTags = await getAllOfferTags();
  const countries = await db.country.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const product = await getProductMainInfo(productId);
  if (!product) return null;

  return (
    <div>
      <ProductDetails
        categories={categories}
        storeUrl={storeUrl}
        data={product}
        offerTags={offerTags}
        countries={countries}
      />
    </div>
  );
};

export default SellerNewProductVariantPage;
