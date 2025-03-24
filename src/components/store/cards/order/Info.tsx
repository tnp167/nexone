import { PaymentDetails } from "@prisma/client";
import React from "react";

type OrderInfoType = {
  totalItemsCount: number;
  deliveredItemsCount: number;
  paymentDetails: PaymentDetails | null;
};

const OrderInfo = ({
  totalItemsCount,
  deliveredItemsCount,
  paymentDetails,
}: OrderInfoType) => {
  return (
    <div>
      <div className="p-4 shadow-sm w-full">
        <div className="flex justify-between">
          <div className="space-y-4">
            <p className="text-main-secondary text-sm">Total Items</p>
            <p className="text-main-secondary text-sm">Delivered</p>
            <p className="text-main-secondary text-sm">Payment Status</p>
            <p className="text-main-secondary text-sm">Payment Method</p>
            <p className="text-main-secondary text-sm">Payment Reference</p>
            <p className="text-main-secondary text-sm">Paid at</p>
          </div>
          <div className="text-right space-y-4">
            <p className="mt-0.5 text-neutral-500 text-sm">{totalItemsCount}</p>
            <p className="mt-0.5 text-neutral-500 text-sm">
              {deliveredItemsCount}
            </p>
            <p className="mt-0.5 text-neutral-500 text-sm">
              {paymentDetails ? paymentDetails.status : "Unpaid"}
            </p>
            <p className="mt-0.5 text-neutral-500 text-sm">
              {paymentDetails ? paymentDetails.paymentMethod : "-"}
            </p>
            <p className="mt-0.5 text-neutral-500 text-sm">
              {paymentDetails ? paymentDetails.paymentIntentId : "-"}
            </p>
            <p className="mt-0.5 text-neutral-500 text-sm">
              {paymentDetails &&
              (paymentDetails.status === "COMPLETED" ||
                paymentDetails.status === "succeeded")
                ? paymentDetails.updatedAt.toDateString()
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
