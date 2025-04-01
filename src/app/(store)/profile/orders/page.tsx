import OrdersTable from "@/components/store/profile/orders/OrdersTable";
import { getUserOrders } from "@/queries/profile";
import React from "react";
const PaymentOrdersPage = async () => {
  const { orders, totalPages } = await getUserOrders();
  return (
    <div>
      <OrdersTable orders={orders} totalPages={totalPages} />
    </div>
  );
};

export default PaymentOrdersPage;
