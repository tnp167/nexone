"use client";

import { ProductShippingDetailsType } from "@/lib/types";
import { ChevronRight, Truck } from "lucide-react";
import { FC, useEffect, useState } from "react";
import ProductShippingFee from "./ShippingFee";

interface Props {
  shippingDetails: ProductShippingDetailsType;
  quantity: number;
  weight: number | null;
}

const ShippingDetails: FC<Props> = ({ shippingDetails, quantity, weight }) => {
  const [shippingTotal, setShippingTotal] = useState<number>();

  const {
    countryName,
    deliveryTimeMin,
    deliveryTimeMax,
    shippingFee,
    shippingFeeMethod,
    extraShippingFee,
    shippingService,
    returnPolicy,
  } = shippingDetails;

  useEffect(() => {
    switch (shippingFeeMethod) {
      case "ITEM":
        setShippingTotal(shippingFee + extraShippingFee * (quantity - 1));
        break;
      case "WEIGHT":
        setShippingTotal(shippingFee * quantity);
        break;
      case "FIXED":
        setShippingTotal(shippingFee);
        break;
      default:
        break;
    }
  }, [quantity]);

  if (typeof shippingDetails === "boolean") return null;
  return (
    <div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-1">
            <Truck className="w-4" />
            {shippingDetails.isFreeShipping ? (
              <span className="text-sm font-bold flex items-center">
                <span>
                  Free Shipping to &nbsp; <span>{countryName}</span>
                </span>
              </span>
            ) : (
              <span className="text-sm font-bold flex items-center">
                <span>
                  Shipping to &nbsp; <span>{countryName}</span>
                </span>
                <span>&nbsp; for £{shippingTotal}</span>
              </span>
            )}
          </div>
          <ChevronRight className="w-3" />
        </div>
        {/* Product shipping fee */}
        {!shippingDetails.isFreeShipping && (
          <ProductShippingFee
            fee={shippingFee}
            extraFee={extraShippingFee}
            method={shippingFeeMethod}
            quantity={5}
            weight={weight}
          />
        )}
      </div>
    </div>
  );
};

export default ShippingDetails;
