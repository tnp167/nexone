"use client";

import { CartWithCartItemsType, UserShippingAddressType } from "@/lib/types";
import { Country, ShippingAddress } from "@prisma/client";
import { FC, useState } from "react";
import UserShippingAddresses from "../shared/shipping-addresses/ShippingAddresses";
import CheckoutProductCard from "../cards/CheckoutProduct";
import PlaceOrderCard from "../cards/PlaceOrder";
interface Props {
  cart: CartWithCartItemsType;
  countries: Country[];
  addresses: UserShippingAddressType[];
}

const CheckoutContainer: FC<Props> = ({ cart, countries, addresses }) => {
  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddress | null>(null);
  return (
    <div className="flex">
      <div className="flex-1 my-3">
        <UserShippingAddresses
          countries={countries}
          addresses={addresses}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <div className="w-full py-4 px-4 bg-white my-3">
          <div className="relative">
            {cart.cartItems.map((product) => (
              <CheckoutProductCard key={product.variantId} product={product} />
            ))}
          </div>
        </div>
      </div>
      <PlaceOrderCard
        shippingFees={cart.shippingFees}
        subTotal={cart.subTotal}
        total={cart.total}
        shippingAddress={selectedAddress}
        cartId={cart.id}
      />
    </div>
  );
};

export default CheckoutContainer;
