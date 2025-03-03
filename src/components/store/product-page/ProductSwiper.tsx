"use client";

import { cn } from "@/lib/utils";
import { ProductVariantImage } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import ImageZoom from "react-image-zooom";

const ProductSwiper = ({ images }: { images: ProductVariantImage[] }) => {
  const [activeImage, setActiveImage] = useState<ProductVariantImage>(
    images[0]
  );
  if (!images) return null;
  return (
    <div className="relative">
      <div className="relative w-full flex flex-col-reverse xl:flex-row gap-2">
        {/* Thumbnails */}
        <div className="flex flex-wrap xl:flex-col gap-3">
          {images.map((img) => (
            <div
              key={img.url}
              className={cn(
                "w-16 h-16 rounded-md grid place-items-center overflow-hidden border-gray-100 cursor-pointer transition-all duration-75 ease-in",
                { "border-main-primary": activeImage.id === img.id }
              )}
              onMouseEnter={() => setActiveImage(img)}
            >
              <Image
                src={img.url}
                alt={img.alt}
                width={80}
                height={80}
                className="object-cover rounded-md"
              />
            </div>
          ))}
        </div>
        <div className="relative roundeed-lg overflow-hidden w-full 2xl:h-[600px] 2xl:w-[600px]">
          <ImageZoom
            src={activeImage.url}
            zoom={200}
            className="!w-full rounded-lg"
          />
        </div>
      </div>
      {/* Image view*/}
    </div>
  );
};

export default ProductSwiper;
