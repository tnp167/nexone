import ProductDetails from "@/components/dashboard/Forms/ProductDetails";
import { getAllCategories } from "@/queries/category";

export default async function SellerNewProductPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  const { storeUrl } = await params;
  const categories = await getAllCategories();

  return (
    <div className="w-full">
      <ProductDetails
        categories={categories}
        storeUrl={storeUrl}
        //offerTags={}
      />
    </div>
  );
}
