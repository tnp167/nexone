"use client";
import { ProductType, SimpleProduct } from "@/lib/types";
import { FC, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "../cards/product/ProductCard";
import { Navigation, Pagination } from "swiper/modules";
import ProductSimpleCard from "../cards/product/SimpleCard";
interface Props {
  children?: ReactNode;
  products: SimpleProduct[] | ProductType[];
  type: "main" | "curved" | "simple";
  slidesPerView?: number;
  breakpoints?: any;
  spaceBetween?: number;
}

const MainSwiper: FC<Props> = ({
  children,
  products,
  type,
  slidesPerView = 1,
  breakpoints = {
    500: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
    1280: {
      slidesPerView: 5,
    },
  },
  spaceBetween = 20,
}) => {
  return (
    <div className="p-4 rounded-md cursor-pointer">
      <Swiper
        slidesPerView={slidesPerView}
        breakpoints={breakpoints}
        spaceBetween={spaceBetween}
        modules={[Pagination, Navigation]}
        navigation={true}
      >
        {products.map((product, index) => (
          <SwiperSlide key={index}>
            {type === "simple" ? (
              <ProductSimpleCard product={product as SimpleProduct} />
            ) : type === "curved" ? (
              <div>Curved card</div>
            ) : (
              <ProductCard product={product as ProductType} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default MainSwiper;
