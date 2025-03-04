"use client";

import { FC, useEffect, useState } from "react";
import ProductList from "../shared/ProductList";
import { getProducts } from "@/queries/product";
import { ProductType } from "@/lib/types";

interface Props {
  storeUrl: string | undefined;
  storeName: string | undefined;
  count: number;
}

const StoreProducts: FC<Props> = ({ storeUrl, count, storeName }) => {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    getStoreProducts();
  }, []);

  const getStoreProducts = async () => {
    const response = await getProducts({ store: storeUrl }, "", 1, count);
    setProducts(response.products);
  };
  return (
    <div className="relative mt-6">
      <ProductList
        products={products}
        title={`Recommended from ${storeName}`}
        arrow={true}
      />
    </div>
  );
};

export default StoreProducts;
