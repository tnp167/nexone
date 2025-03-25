"use client";

import React, { FC } from "react";
import PaypalWrapper from "../cards/payment/paypal/PaypalWrapper";
import StripeWrapper from "../cards/payment/stripe/StripeWrapper";
import PaypalPayment from "../cards/payment/paypal/PaypalPayment";
interface Props {
  orderId: string;
  amount: number;
}

const OrderPayment: FC<Props> = ({ orderId, amount }) => {
  return (
    <div className="h-full flex flex-col space-y-5">
      {/* Paypal */}
      <PaypalWrapper>
        <PaypalPayment orderId={orderId} />
      </PaypalWrapper>
      {/* Stripe */}
      <StripeWrapper amount={amount}>
        <div>Stripe</div>
      </StripeWrapper>
    </div>
  );
};

export default OrderPayment;
