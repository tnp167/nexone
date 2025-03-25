import OrderInfo from "@/components/store/cards/order/Info";
import OrderTotalDetailsCard from "@/components/store/cards/order/Total";
import OrderUserDrtailsCard from "@/components/store/cards/order/User";
import Header from "@/components/store/layout/header/Header";
import OrderGroupsContainer from "@/components/store/order-page/GroupsContainer";
import OrderHeader from "@/components/store/order-page/Header";
import OrderPayment from "@/components/store/order-page/Payment";
import { Separator } from "@/components/ui/separator";
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
              <OrderTotalDetailsCard
                details={{
                  subTotal: order.subTotal,
                  shippingFees: order.shippingFees,
                  total: order.total,
                }}
              />
            )}
            {/* Order total details */}
          </div>
          {/* Col 2 - Order Groups */}
          <div className="h-[calc(100vh-137px)] overflow-auto scrollbar">
            <OrderGroupsContainer groups={order.groups} />
          </div>
          {/* Col 3 - Payment Gateways */}
          {(order.paymentStatus === "Pending" ||
            order.paymentStatus === "Failed") && (
            <div className="h-[calc(100vh-137px)] overflow-auto scrollbarborder-l py-4 px-2">
              <OrderTotalDetailsCard
                details={{
                  subTotal: order.subTotal,
                  shippingFees: order.shippingFees,
                  total: order.total,
                }}
              />
              <Separator />
              <OrderPayment orderId={order.id} amount={order.total} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
