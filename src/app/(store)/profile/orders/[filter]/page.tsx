import OrdersTable from "@/components/store/profile/orders/OrdersTable";
import { OrderTableFilter } from "@/lib/types";
import { getUserOrders } from "@/queries/profile";
import React from "react";
const ProfileFilteredOrdersPage = async ({
  params,
}: {
  params: Promise<{ filter: string }>;
}) => {
  const { filter } = await params;
  const parsedFilter = filter ? (filter as OrderTableFilter) : "";

  const { orders, totalPages } = await getUserOrders(parsedFilter);
  return (
    <div>
      <OrdersTable
        orders={orders}
        totalPages={totalPages}
        prev_filter={parsedFilter}
      />
    </div>
  );
};

export default ProfileFilteredOrdersPage;
