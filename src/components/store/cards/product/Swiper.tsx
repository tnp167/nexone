import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { ProductVariantImage } from "@prisma/client";
import Image from "next/image";

const ProductCardImageSwiper = ({
  images,
}: {
  images: ProductVariantImage[];
}) => {
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
    }
  }, [swiperRef]);
  return (
    <div
      className="relative mb-2 h-[200px] w-full bg-white contrast-[90%] rounded-2xl overflow-hidden"
      onMouseEnter={() => swiperRef.current.swiper.autoplay.start()}
      onMouseLeave={() => swiperRef.current.swiper.slideTo(0)}
    >
      <Swiper ref={swiperRef} modules={[Autoplay]} autoplay={{ delay: 300 }}>
        {images.map((img) => (
          <SwiperSlide key={img.id}>
            <Image
              src={img.url}
              alt=""
              width={400}
              height={400}
              className="block object-cover h-[200px] w-48 sm:w-52"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCardImageSwiper;
