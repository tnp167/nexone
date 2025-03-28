import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  useElements,
  useStripe,
  PaymentElement,
} from "@stripe/react-stripe-js";
import {
  creataStripePayment,
  createStripePaymentIntent,
} from "@/queries/stripe";
const StripePayment = ({ orderId }: { orderId: string }) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getClientSecret();
  }, [orderId]);

  const getClientSecret = async () => {
    const response = await createStripePaymentIntent(orderId);
    if (response.clientSecret) setClientSecret(response.clientSecret);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setIsLoading(false);
      return;
    }

    if (clientSecret) {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `http://localhost:3000`,
        },
        redirect: "if_required",
      });

      if (!error && paymentIntent) {
        try {
          const response = await creataStripePayment(paymentIntent, orderId);
          if (!response.paymentDetails?.paymentIntentId)
            throw new Error("Failed");
          router.refresh();
        } catch (error: any) {
          setErrorMessage(error.message);
        }
      }
    }
    setIsLoading(false);
  };

  if (!clientSecret || !stripe || !elements)
    return (
      <div className="flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}
      {errorMessage && (
        <div className="text-sm text-red-500">{errorMessage}</div>
      )}
      <button
        disabled={!stripe || isLoading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default StripePayment;
