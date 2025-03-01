"use client";

import { ProductType, VariantSimplified } from "@/lib/types";
import Link from "next/link";
import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import ProductCardImageSwiper from "./Swiper";
import VariantSwitcher from "./VariantSwitcher";
import { Button } from "@/components/store/ui/button";
import { HeartIcon } from "lucide-react";
import ProductPrice from "../../product-page/product-info/ProductPrice";
const ProductCard = ({ product }: { product: ProductType }) => {
  const { name, slug, rating, sales, variantImages, variants } = product;

  const [variant, setVariant] = useState<VariantSimplified>(variants[0]);
  const { variantSlug, variantName, images, sizes } = variant;
  return (
    <div>
      <div className="group w-48 sm:w-[220px] relative transition-all duration-75 p-4 rounded-t-3xl border border-transparent hover:shadow-xl hover:border-border bg-white ease-in-out">
        <div className="relative w-full h-full">
          <Link
            href={`/product/${slug}/${variantSlug}`}
            className="relative w-full inline-block overflow-hidden"
          >
            {/* Image Slider */}
            <ProductCardImageSwiper images={images} />
            {/* Title */}
            <div className="text-sm text-main-primary h-[18px] overflow-hidden overflow-ellipsis whitespace-nowrap">
              {name} - {variantName}
            </div>
            {/* Rating - Sales */}
            {product.rating > 0 && product.sales > 0 && (
              <div className="flex items-center gap-x-1 h-6">
                <ReactStars
                  count={5}
                  size={16}
                  color="#F5F5F5"
                  activeColor="#FFD804"
                  value={rating}
                  isHalf
                  edit={false}
                  char="★"
                />
                <div className="text-xs text-main-secondary">{sales} sold</div>
              </div>
            )}
          </Link>
          {/* Product Price */}
          <ProductPrice sizes={sizes} isCard={true} />
        </div>
        <div className="hidden group-hover:block absolute -left-[1px] bg-white border border-t-transparent w-[calc(100%+2px)] shadow-xl rounded-b-3xl px-4 pb-4 z-10 space-y-2">
          {/* Variant Switcher */}
          <VariantSwitcher
            images={variantImages}
            variants={variants}
            setVariant={setVariant}
            selectedVariant={variant}
          />
          {/* Actions */}
          <div className="flex gap-x-1">
            <Button>Add to cart</Button>
            <Button variant="black" size="icon">
              <HeartIcon className="w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
