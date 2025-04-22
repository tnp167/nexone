import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { getStoreCoupons } from "@/queries/coupon";
import CouponDetails from "@/components/dashboard/forms/CouponDetails";
import { getStoreOrders } from "@/queries/store";

const SellerOrdersPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const { storeUrl } = await params;
  const orders = await getStoreOrders(storeUrl);
  return (
    <div>
      <DataTable
        filterValue="id"
        data={orders}
        columns={columns}
        searchPlaceholder="Search order id"
      />
    </div>
  );
};

export default SellerOrdersPage;
