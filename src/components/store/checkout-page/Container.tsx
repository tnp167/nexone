"use client";

import { CartWithCartItemsType, UserShippingAddressType } from "@/lib/types";
import { Country, ShippingAddress } from "@prisma/client";
import { FC, useState } from "react";
import UserShippingAddresses from "../shared/shipping-addresses/ShippingAddresses";
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
          selectedAddres={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <div className="w-full py-4 px-4 bg-white my-3">
          <div className="relative">
            {cart.cartItems.map((product) => (
              //   CheckoutProductCard
              <div key={product.id}>{product.name}</div>
            ))}
          </div>
        </div>
      </div>
      {/* Cart side */}
      {/* PlaceOrderCard */}
    </div>
  );
};

export default CheckoutContainer;
