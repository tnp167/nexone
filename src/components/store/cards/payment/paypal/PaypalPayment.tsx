"use client";

import React, { useRef } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { capturePaypalPayment, createPayPalPayment } from "@/queries/paypal";
import { useRouter } from "next/navigation";

const PaypalPayment = ({ orderId }: { orderId: string }) => {
  const paymentIdRef = useRef("");
  const router = useRouter();

  const createOrder = async (data: any, actions: any) => {
    const response = await createPayPalPayment(orderId);
    paymentIdRef.current = response.id;

    return response.id;
  };

  const onApprove = async () => {
    const captureResponse = await capturePaypalPayment(
      orderId,
      paymentIdRef.current
    );

    if (captureResponse.id) router.refresh();
  };
  return (
    <div>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(error) => {
          console.error("Error creating PayPal payment:", error);
        }}
      />
    </div>
  );
};

export default PaypalPayment;
