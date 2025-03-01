"use client";

import { ProductPageDataType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { CopyIcon } from "../../icons";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import ProductPrice from "./ProductPrice";
import Countdown from "../../shared/Countdown";
import { Separator } from "@/components/ui/separator";
import ColorWheel from "@/components/shared/color-wheel";
import ProductVariantSelector from "./VariantSelector";

interface ProductInfoProps {
  productData: ProductPageDataType;
  quantity: number;
  sizeId: string | undefined;
}

const ProductInfo: FC<ProductInfoProps> = ({
  productData,
  quantity,
  sizeId,
}) => {
  if (!productData) return null;
  const {
    productId,
    name,
    sku,
    colors,
    variantImages,
    sizes,
    isSale,
    saleEndDate,
    variantName,
    store,
    numReviews,
    rating,
  } = productData;

  const copySkuToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sku);
      toast.success("SKU copied to clipboard");
    } catch {
      toast.error("Failed to copy SKU");
    }
  };
  return (
    <div className="relative w-full xl:w-[540px]">
      {/* Title */}
      <div>
        <h1 className="text-main-primary inline font-bold leading-5">
          {name} · {variantName}
        </h1>
      </div>
      {/* Sku / Rating / Reviews */}
      <div className="flex items-center text-sm mt-2">
        {/* Store Details */}
        <Link
          href={`/store/${store.url}`}
          className="hidden sm:inline-block md:hidden lg:inline-block mr-2 hover:underline"
        >
          <div className="flex items-center gap-x-1 w-full">
            <Image
              src={store.logo}
              alt={store.name}
              width={100}
              height={100}
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="text-gray-500">{store.name}</p>
          </div>
        </Link>
        {/* Sku */}
        <div className="whitespace-nowrap">
          <span className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
            SKU: {sku}
          </span>
          <span
            onClick={copySkuToClipboard}
            className="inline-block align-middle text-[#2e46fb] mx-1 cursor-pointer"
          >
            <CopyIcon />
          </span>
        </div>
        <div className="ml-4 flex items-center gap-x-2 flex-1 wihitespace-nowrap">
          <ReactStars
            count={5}
            size={16}
            value={rating}
            edit={false}
            isHalf={true}
            activeColor="#ffd700"
            char="★"
          />
          <Link href="#reviews" className="text-[#ffd700] hover:underline">
            {numReviews === 0
              ? "No review yet"
              : numReviews === 1
              ? "1 review"
              : `${numReviews} reviews`}
          </Link>
        </div>
      </div>
      <div className="my-2 relative flex flex-col sm:flex-row justify-between">
        <ProductPrice sizeId={sizeId} sizes={sizes} isCard={false} />
        {isSale && saleEndDate && (
          <div className="mt-4 pb-2">
            <Countdown targetDate={saleEndDate} />
          </div>
        )}
      </div>
      <Separator className="my-3" />
      {/* Color wheel and variant selector */}
      <div className="mt-4 space-y-2">
        <div className="relative flex items-center justify-between text-main-primary font-bold">
          <span className="flex items-center gap-x-2">
            {colors.length > 1 ? "Colors" : "Color"}
            <ColorWheel colors={colors} size={25} />
          </span>
        </div>
        {variantImages.length > 0 && (
          <ProductVariantSelector
            variants={variantImages}
            slug={productData.variantSlug}
          />
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
