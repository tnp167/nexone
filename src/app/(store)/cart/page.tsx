"use client";

import { useCartStore } from "@/cart-store/useCartStore";
import CartProduct from "@/components/store/cards/CartProduct";
import FastDelivery from "@/components/store/cards/FastDelivery";
import CartHeader from "@/components/store/cart/CartHeader";
import { SecurityPrivacyCard } from "@/components/store/product-page/product-info/ReturnsPrivacySecurityCard";
import useFormStore from "@/hooks/useFormStore";
import { CartProductType } from "@/lib/types";
import { useState } from "react";

const CartPage = () => {
  const cartItems = useFormStore(useCartStore, (state) => state.cart);

  const [selectedItems, setSelectedItems] = useState<CartProductType[]>([]);
  const [totalShipping, setTotalShipping] = useState<number>(0);

  return (
    <div>
      {cartItems && cartItems?.length > 0 ? (
        <div className="bg-[#F5F5F5]">
          <div className="max-w-[1200px] mx-auto py-6 flex">
            <div className="min-w-0 flex-1">
              {/* Cart Header */}
              <CartHeader
                cartItems={cartItems}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
              <div className="h-auto overflow-x-hidden overflow-auto mt-2">
                {/* Cart items */}
                {cartItems.map((product) => (
                  <CartProduct
                    key={product.productId}
                    product={product}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    setTotalShipping={setTotalShipping}
                  />
                ))}
              </div>
            </div>
            {/* Cart side */}
            <div className="sticky top-4 ml-5 w-[380px] max-h-max">
              {/* Cart summary */}
              <div className="mt-2 bg-white px-5">
                <FastDelivery />
              </div>
              <div className="mt-2 bg-white px-5">
                <SecurityPrivacyCard />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div> No product </div>
      )}
    </div>
  );
};

export default CartPage;
