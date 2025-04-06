"use client";

import { ProductWishlistType } from "@/lib/types";
import ProductList from "../../shared/ProductList";
import Pagination from "../../shared/Pagination";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const WishlistContainer = ({
  products,
  page,
  totalPages,
}: {
  products: ProductWishlistType[];
  page: number;
  totalPages: number;
}) => {
  const router = useRouter();
  const [currentPage, setPage] = useState<number>(page);

  useEffect(() => {
    if (currentPage !== page) {
      router.push(`/profile/wishlist/${currentPage}`);
    }
  }, [currentPage, page]);
  return (
    <div>
      <div className="flex flex-wrap pb-16">
        <ProductList products={products} />
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default WishlistContainer;
