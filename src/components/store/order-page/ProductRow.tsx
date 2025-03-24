import { OrderItem } from "@prisma/client";
import Image from "next/image";
import React from "react";
import ProductStatusTag from "@/components/shared/product-status";
import { ProductStatus } from "@/lib/types";
const ProductRow = ({ product }: { product: OrderItem }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center py-6 gap-6 w-full">
      <div className="max-lg:w-full">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="w-42 h-40 rounded-xl object-cover aspect-square"
        />
      </div>
      <div className="flex items-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
          <div className="flex items-center">
            <div>
              <h2 className="text-sm font-medium leading-8 text-black mb-1 line-clamp-2">
                {product.name.split("-")[0]}
              </h2>
              <p className="font-normal text-lg mb-1 leading-8 text-gray-500">
                {product.name.split("-")[1]}
              </p>
              <p className="font-normal text-sm mb-1 leading-8 text-gray-500">
                #{product.sku}
              </p>
              <div className="flex items-center">
                <p className="font-medium text-base leading-7 text-black pr-4 mr-4 border-r">
                  Size: <span className="text-gray-500">{product.size}</span>
                </p>
                <p className="font-medium text-base leading-7 text-black pr-4 mr-4">
                  Qty: <span className="text-gray-500">{product.quantity}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="pl-5 grid grid-cols-4">
            <div className="col-span-4 lg:col-span-1 flex items-center">
              <div className="flex gap-3 lg:block">
                <p className="font-medium text-sm leading-7 text-black">
                  Price
                </p>
                <p className="lg:mt-4 font-medium text-sm leading-7 text-blue-primary">
                  £{product.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="col-span-4 lg:col-span-1 flex items-center">
              <div className="flex gap-3 lg:block">
                <p className="font-medium text-sm leading-7 text-black">
                  Status
                </p>
                <p className="leading-6 py-0.5 mt-3 flex">
                  <ProductStatusTag status={product.status as ProductStatus} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRow;
