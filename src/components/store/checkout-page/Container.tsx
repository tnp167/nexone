"use client";

import { CartWithCartItemsType, UserShippingAddressType } from "@/lib/types";
import { Country, ShippingAddress } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import UserShippingAddresses from "../shared/shipping-addresses/ShippingAddresses";
import CheckoutProductCard from "../cards/CheckoutProduct";
import PlaceOrderCard from "../cards/PlaceOrder";
import { Country as CountryType } from "@/lib/types";
import CountryNote from "../cart/CountryNote";
import { updateCheckoutProductsWithLatest } from "@/queries/user";

interface Props {
  cart: CartWithCartItemsType;
  countries: Country[];
  addresses: UserShippingAddressType[];
  userCountry: CountryType;
}

const CheckoutContainer: FC<Props> = ({
  cart,
  countries,
  addresses,
  userCountry,
}) => {
  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddress | null>(null);

  const [cartData, setCartData] = useState<CartWithCartItemsType>(cart);

  const { cartItems } = cart;

  const activeCountry = addresses.find(
    (add) => add.countryId === selectedAddress?.countryId
  )?.country;

  useEffect(() => {
    const hydrateCheckoutCart = async () => {
      const updatedCart = await updateCheckoutProductsWithLatest(
        cartItems,
        activeCountry
      );
      setCartData(updatedCart);
    };

    if (cartItems.length > 0) hydrateCheckoutCart();
  }, [activeCountry]);

  return (
    <div className="flex">
      <div className="flex-1 my-3">
        <UserShippingAddresses
          countries={countries}
          addresses={addresses}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <div className="my-2">
          <CountryNote
            country={activeCountry ? activeCountry.name : userCountry.name}
          />
        </div>
        <div className="w-full py-4 px-4 bg-white my-3">
          <div className="relative">
            {cartData.cartItems.map((product) => (
              <CheckoutProductCard key={product.variantId} product={product} />
            ))}
          </div>
        </div>
      </div>
      <PlaceOrderCard
        shippingFees={cartData.shippingFees}
        subTotal={cartData.subTotal}
        total={cartData.total}
        shippingAddress={selectedAddress}
        cartId={cartData.id}
        setCartData={setCartData}
        coupon={cartData.coupon}
        cartData={cartData}
      />
    </div>
  );
};

export default CheckoutContainer;
