import ProductDetails from "@/components/dashboard/forms/ProductDetails";
import { db } from "@/lib/db";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import CouponDetails from "@/components/dashboard/forms/CouponDetails";

export default async function SellerNewCouponPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  return (
    <div className="w-full">
      <CouponDetails />
    </div>
  );
}
