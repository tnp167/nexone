import { ReactNode } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const StripeWrapper = ({
  children,
  amount,
}: {
  children: ReactNode;
  amount: number;
}) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: Math.round(amount * 100),
        currency: "gbp",
      }}
    >
      {children}
    </Elements>
  );
};

export default StripeWrapper;
