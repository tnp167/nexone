"use client";
import MainSwiper from "@/components/store/shared/Swiper";
import { SimpleProduct } from "@/lib/types";

export default function UserCardProducts({
  products,
}: {
  products: SimpleProduct[];
}) {
  return (
    <div className=" absolute bottom-0 left-0 w-[345px]">
      <MainSwiper
        products={products}
        type="simple"
        slidesPerView={3}
        spaceBetween={-5}
      />
    </div>
  );
}
