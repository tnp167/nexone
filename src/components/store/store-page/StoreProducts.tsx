"use client";

import React, { useEffect, useState } from "react";
import { FiltersQueryType, ProductType } from "@/lib/types";
import { getProducts } from "@/queries/product";
import ProductCard from "../cards/product/ProductCard";
const StoreProducts = ({
  searchParams,
  storeUrl,
}: {
  searchParams: FiltersQueryType;
  storeUrl: string;
}) => {
  const [data, setData] = useState<ProductType[]>([]);
  const { category, offer, search, size, sort, subCategory } = searchParams;

  useEffect(() => {
    const getFilteredProducts = async () => {
      const { products } = await getProducts(
        {
          category,
          offer,
          search,
          size: Array.isArray(size) ? size : size ? [size] : undefined,
          subCategory,
          storeUrl,
        },
        sort,
        1,
        100
      );
      setData(products);
    };
    getFilteredProducts();
  }, [searchParams]);
  return (
    <div className="bg-white justify-center md:justify-start flex flex-wrap p-2 pb-16 rounded-md">
      {data.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
};

export default StoreProducts;
