"use client";
import React from "react";
import { SimpleProduct } from "@/lib/types";
import AnimatedImg from "@/public/assets/images/ads/animated-deals.gif";
import TopSellerImg from "@/public/assets/images/featured/most-popular.avif";
import TopRatedImg from "@/public/assets/images/featured/top-rated.jpg";
import Image from "next/image";
import Link from "next/link";
import MainSwiper from "../shared/Swiper";
import Countdown from "../shared/Countdown";
const AnimatedDeals = ({ products }: { products: SimpleProduct[] }) => {
  return (
    <div className="bg-[#ED3835] w-full rounded-md overflow-hidden relative">
      <span className="inline-block w-full font-semibold text-center text-4xl text-white outline-none absolute top-[53%]">
        Up to 70% off
      </span>
      <Image
        src={AnimatedImg}
        alt="Animated Deals"
        width={200}
        height={340}
        className="w-full h-[340px]"
      />
      <Link
        href="/browse"
        className=" bg-[#ffaf00] absolute top-[25%] left-[7%] min-[1070px]:left-[10%] rounded-[24px] w-[140px] h-[181px] z-10 flex justify-center"
      >
        <Image
          src={TopSellerImg}
          alt=""
          width={150}
          height={200}
          className="w-[80%] h-[78%] object-cover rounded-[24px] -mt-[3px] align-middle"
        />
        <span className="text-[20px] font-semibold mt-8 inline-block text-center text-white absolute top-[60%]">
          Top Sellers
        </span>
      </Link>
      <Link
        href="/browse"
        className=" bg-[#ffaf00] absolute top-[25%] right-[7%] min-[1070px]:left-[10%] rounded-[24px] w-[140px] h-[181px] z-10 flex justify-center"
      >
        <Image
          src={TopRatedImg}
          alt=""
          width={150}
          height={200}
          className="w-[80%] h-[78%] object-cover rounded-[24px] -mt-[3px] align-middle"
        />
        <span className="text-[20px] font-semibold mt-8 inline-block text-center text-white absolute top-[60%]">
          Top Rated
        </span>
      </Link>
      <div className="absolute top-[82%] left-1/2 -translate-x-1/2 flex justify-center items-center">
        <Countdown targetDate="2025-08-12T00:00:00.769Z" homeStyle />
      </div>
      <div className="gap-3 w-[300px] min-[1100px]:w-[400px] min-[1400px]:w-[510px] absolute top-[3%] left-1/2 -translate-x-1/2">
        <MainSwiper
          products={products}
          type="simple"
          spaceBetween={-5}
          slidesPerView={3}
          breakpoints={{
            1100: { slidesPerView: 4 },
            1400: { slidesPerView: 5 },
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedDeals;
