import OrdersTable from "@/components/store/profile/orders/OrdersTable";
import { OrderTableFilter } from "@/lib/types";
import { getUserOrders } from "@/queries/profile";
import React from "react";
const ProfileFilteredOrdersPage = async ({
  params,
}: {
  params: { filter: string };
}) => {
  const filter = params.filter ? (params.filter as OrderTableFilter) : "";

  const { orders, totalPages } = await getUserOrders(filter);
  return (
    <div>
      <OrdersTable
        orders={orders}
        totalPages={totalPages}
        prev_filter={filter}
      />
    </div>
  );
};

export default ProfileFilteredOrdersPage;
