import CouponDetails from "@/components/dashboard/forms/CouponDetails";

export default async function SellerNewCouponPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  const { storeUrl } = await params;
  return (
    <div className="w-full">
      <CouponDetails storeUrl={storeUrl} />
    </div>
  );
}
