"use client";

import { useCartStore } from "@/cart-store/useCartStore";
import useFromStore from "@/hooks/useFromStore";
import { CartProductType, Country } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { SecurityPrivacyCard } from "../product-page/product-info/ReturnsPrivacySecurityCard";
import CartProduct from "../cards/CartProduct";
import CartHeader from "./CartHeader";
import CartSummary from "./Summary";
import FastDelivery from "../cards/FastDelivery";
import EmptyCart from "./EmptyCart";
import { updateCartWithLatest } from "@/queries/user";
import CountryNote from "./CountryNote";

const CartContainer = ({ userCountry }: { userCountry: Country }) => {
  const cartItems = useFromStore(useCartStore, (state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  const [loading, setLoading] = useState<boolean>(false);
  const [isCartLoaded, setIsCartLoaded] = useState<boolean>(false);

  const [selectedItems, setSelectedItems] = useState<CartProductType[]>([]);
  const [totalShipping, setTotalShipping] = useState<number>(0);

  useEffect(() => {
    if (cartItems !== undefined) {
      setIsCartLoaded(true); // Set the cart as loaded when the cart items are fetched
    }
  }, [cartItems]);

  useEffect(() => {
    const loadAndSyncCart = async () => {
      if (cartItems?.length) {
        try {
          const updatedCart = await updateCartWithLatest(cartItems);
          console.log("updatedCart", updatedCart);
          setCart(updatedCart);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error loading and syncing cart:", error);
        }
      }
    };

    loadAndSyncCart();
  }, [isCartLoaded, userCountry]);

  return (
    <div>
      {cartItems && cartItems?.length > 0 ? (
        <>
          {loading && <div>Loading...</div>}
          <div className="bg-[#F5F5F5] min-h-[calc(100vh-100px)]">
            <div className="max-w-[1200px] mx-auto py-6 flex">
              <div className="min-w-0 flex-1">
                {/* Cart Header */}
                <CartHeader
                  cartItems={cartItems}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
                <div className="my-2">
                  <CountryNote country={userCountry.name} />
                </div>
                <div className="h-auto overflow-x-hidden overflow-auto mt-2">
                  {/* Cart items */}
                  {cartItems.map((product) => (
                    <CartProduct
                      key={product.productId}
                      product={product}
                      selectedItems={selectedItems}
                      setSelectedItems={setSelectedItems}
                      setTotalShipping={setTotalShipping}
                      userCountry={userCountry}
                    />
                  ))}
                </div>
              </div>
              {/* Cart side */}
              <div className="sticky top-4 ml-5 w-[380px] max-h-max">
                {/* Cart summary */}
                <CartSummary
                  cartItems={cartItems}
                  shippingFees={totalShipping}
                />
                <div className="mt-2 py-4 bg-white px-5">
                  <FastDelivery />
                </div>
                <div className="mt-2 py-4 bg-white px-5">
                  <SecurityPrivacyCard />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default CartContainer;
