import { ProductType } from "@/lib/types";
import React from "react";
import ProductList from "../shared/ProductList";

const RelatedProducts = ({ products }: { products: ProductType[] }) => {
  return (
    <div className="mt-1 space-y-1">
      <ProductList products={products} title="Related Products" />
    </div>
  );
};

export default RelatedProducts;
