import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { getStoreCoupons } from "@/queries/coupon";
import CouponDetails from "@/components/dashboard/forms/CouponDetails";

const SellerCouponsPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const { storeUrl } = await params;
  const coupons = await getStoreCoupons(storeUrl);
  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create coupon
        </>
      }
      modalChildren={<CouponDetails storeUrl={storeUrl} />}
      newTabLink={`/dashboard/seller/stores/${storeUrl}/coupons/new`}
      filterValue="code"
      data={coupons}
      columns={columns}
      searchPlaceholder="Seach coupon code"
    />
  );
};

export default SellerCouponsPage;
