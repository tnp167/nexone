import { ReactNode } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const PaypalWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
          currency: "GBP",
        }}
      >
        {children}
      </PayPalScriptProvider>
    </div>
  );
};

export default PaypalWrapper;
