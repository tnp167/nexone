import Header from "@/components/store/layout/header/Header";
import OrderHeader from "@/components/store/order-page/Header";
import { getOrder } from "@/queries/order";
import { redirect } from "next/navigation";
import React from "react";

const OrderPage = async ({ params }: { params: { orderId: string } }) => {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  if (!order) return redirect("/");
  // Get the total count of items across all groups
  const totalItemsCount = order?.groups.reduce(
    (total, group) => total + group._count.items,
    0
  );

  //Calculate the total number of delivered items
  const deliveredItemsCount = order?.groups.reduce((total, group) => {
    if (group.status === "Delivered") {
      return total + group.items.length;
    }
    return total;
  }, 0);

  return (
    <div>
      <Header />
      <div className="p-2">
        <OrderHeader order={order} />
      </div>
    </div>
  );
};

export default OrderPage;
