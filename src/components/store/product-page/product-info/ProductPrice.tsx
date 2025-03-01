"use client";

import { FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SimplifiedSize {
  id: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
}

interface Props {
  sizeId?: string | undefined;
  sizes: SimplifiedSize[];
  isCard?: boolean;
}

const ProductPrice: FC<Props> = ({ sizeId, sizes, isCard }) => {
  if (!sizes || sizes.length === 0) return;

  //Scenario 1: No sizeId passed, calculate range of prices and total quantity
  if (!sizeId) {
    const discountedPrices = sizes.map(
      (size) => size.price * (1 - size.discount / 100)
    );
    const totalQuantity = sizes.reduce(
      (total, size) => total + size.quantity,
      0
    );

    const minPrice = Math.min(...discountedPrices).toFixed(2);
    const maxPrice = Math.max(...discountedPrices).toFixed(2);

    //If all prices are the same, returns a single price. otherwise, return range
    const priceDisplay =
      minPrice === maxPrice ? `£${minPrice}` : `£${minPrice} - £${maxPrice}`;

    //If a discount exist when minPrice=maxPrice
    let discount = 0;
    if (minPrice === maxPrice) {
      const check_discount = sizes.find(
        (size) => size.price !== discountedPrices[0]
      );
      if (check_discount) {
        discount = check_discount.discount;
      }
    }
    return (
      <div>
        <div className="text-orange-primary inline-block font-bold leading-none mr-3">
          <span
            className={cn("inline-block text-4xl text-nowrap", {
              "text-lg": isCard,
            })}
          >
            {priceDisplay}
          </span>
        </div>
        {!sizeId && !isCard && (
          <div className="text-orange-background text-sm leading-4 mt-1">
            <span>Note: Select a size to see the exact price</span>
          </div>
        )}
        {sizeId && !isCard && (
          <p className="mt-2 text-xs">{totalQuantity} pieces available</p>
        )}
      </div>
    );
  }

  //Scenario 2: sizeId passed, calculate price of selected size
  const selectedSize = sizes.find((s) => s.id === sizeId);

  if (!selectedSize) {
    return <></>;
  }

  const discountedPrice =
    selectedSize.price * (1 - selectedSize.discount / 100);

  return (
    <div>
      <div className="text-orange-primary inline-block font-bold leading-none mr-3">
        <span className="inline-block text-4xl">
          £{discountedPrice.toFixed(2)}
        </span>
      </div>
      {selectedSize.price !== discountedPrice && (
        <span className="text-[#999] inline-block text-xl font-normal leading-6 line-through mr-2">
          £{selectedSize.price.toFixed(2)}
        </span>
      )}
      {selectedSize.discount > 0 && (
        <span className="inline-block text-orange-secondary text-xl leading-4">
          {selectedSize.discount}% off
        </span>
      )}
      <p className="mt-2 text-xs">{selectedSize.quantity} pieces available</p>
    </div>
  );
};

export default ProductPrice;
