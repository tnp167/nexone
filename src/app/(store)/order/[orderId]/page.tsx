import OrderInfo from "@/components/store/cards/order/Info";
import OrderUserDrtailsCard from "@/components/store/cards/order/User";
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
        <div
          className="w-full grid"
          style={{
            gridTemplateColumns:
              order.paymentStatus === "Pending" ||
              order.paymentStatus === "Failed"
                ? "400px 3fr 1fr"
                : "1fr 4fr",
          }}
        >
          {/* Col 1 - User, Order Details */}
          <div className="h-[calc(100vh-137px)] overflow-auto flex flex-col gap-y-5 scrollbar">
            <OrderUserDrtailsCard details={order.shippingAddress} />
            <OrderInfo
              totalItemsCount={totalItemsCount}
              deliveredItemsCount={deliveredItemsCount}
              paymentDetails={order.paymentDetails}
            />
            {(order.paymentStatus === "Pending" ||
              order.paymentStatus === "Failed") && (
              <div>{/* Order total details */}</div>
            )}
            {/* Order total details */}
          </div>
          {/* Col 2 - Order Groups */}
          <div className="h-[calc(100vh-137px)] overflow-auto scrollbar bg-blue-500">
            {/* Order group details */}
          </div>
          {/* Col 3 - Payment Gateways */}
          {(order.paymentStatus === "Pending" ||
            order.paymentStatus === "Failed") && (
            <div className="h-[calc(100vh-137px)] overflow-auto scrollbarborder-l py-4 px-2 bg-yellow-500">
              {/* Order total details */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
