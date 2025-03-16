"use client";
import Link from "next/link";
import React from "react";
import { CartIcon } from "@/components/store/icons";
import { useCartStore } from "@/cart-store/useCartStore";

const Cart = () => {
  const totalItems = useCartStore((state) => state.totalItems);
  return (
    <div className="relative flex h-11 items-center px-2 cursor-pointer">
      <Link href="/cart" className="flex items-center text-white">
        <span className="text-[32px] inline-block">
          <CartIcon />
        </span>
      </Link>
      <div className="ml-1">
        <div className="min-h-3 min-w-6 -mt-1.5">
          <span className="inline-block text-xs text-main-primary leading-4 bg-white rounded-lg text-center font-bold min-h-3 px-1 min-w-6">
            {totalItems}
          </span>
        </div>
        <div className="text-xs fontbold text-wrap leading-4">Cart</div>
      </div>
    </div>
  );
};

export default Cart;
