import OrderStatusTag from "@/components/shared/order-status";
import PaymentStatusTag from "@/components/shared/payment-status";
import { OrderFullType, OrderStatus, PaymentStatus } from "@/lib/types";
import { ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

const OrderHeader = ({ order }: { order: OrderFullType }) => {
  if (!order) return null;
  return (
    <div>
      <div className="w-full border-b flex items-center justify-between p-2">
        <div className="flex items-center gap-x-3">
          <div className="border-r pr-4">
            <button className="w-full border rounded-full grid place-items-center">
              <ChevronLeft className="stroke-main-secondary" />
            </button>
          </div>
          <h1 className="text-main-secondary">Order Details</h1>
          <ChevronRight className="stroke-main-secondary" />
          <h2>Order #{order.id}</h2>
          <OrderStatusTag status={order.orderStatus as OrderStatus} />
          <PaymentStatusTag status={order.paymentStatus as PaymentStatus} />
        </div>
        <div className="flex items-center gap-x-2">
          <Button variant="outline">
            <Download className="size-4 me-2" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="size-4 me-2" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
