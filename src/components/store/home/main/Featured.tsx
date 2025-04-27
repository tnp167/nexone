"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MainSwiper from "../../shared/Swiper";
import { SimpleProduct } from "@/lib/types";
import { useMediaQuery } from "react-responsive";
const Featured = ({ products }: { products: SimpleProduct[] }) => {
  const is1170px = useMediaQuery({ query: "(min-width: 1170px)" });
  const is1700px = useMediaQuery({ query: "(min-width: 1700px)" });
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  console.log(screenWidth);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative rounded-md overflow-hidden">
      <div
        className="w-full flex items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/images/ads/featured.webp)" }}
      >
        {/* Coupon */}
        <Link href="/">
          <div className="w-52 px-3 float-left relative h-[190px]">
            <div className="flex flex-col justify-center items-center h-[100px]">
              <h3 className="leading-5 font-bold my-1 text-whte w-full">
                Welcome to NexOne
              </h3>
              <p className="text-sm w-full text-white">Enjoy shopping</p>
            </div>
            <div
              className="absolute w-[192px] h-[55px] pl-[14px] text-white overflow-hidden pr-[45px] bottom-[35px] 
              text-left bg-contain bg-no-repeat"
              style={{ backgroundImage: "url(/assets/images/ads/coupon.gif)" }}
            >
              <h3 className="text-[16px] leading-6 mt-[10px] text-white w-full">
                Use &quot;NEXONE10&quot;
              </h3>
              <p className="text-sm font-bold">Get 10% off</p>
            </div>
          </div>
        </Link>
        {/* Product swiper */}
        <div
          className={is1700px ? "ml-10" : ""}
          style={{
            width: !is1170px
              ? `${screenWidth - 300}px`
              : is1700px
              ? "750px"
              : `calc(500px + 5vw)`,
          }}
        >
          <MainSwiper
            products={products}
            type="simple"
            slidesPerView={1}
            spaceBetween={-10}
          />
        </div>
      </div>
    </div>
  );
};

export default Featured;
