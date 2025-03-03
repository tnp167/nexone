"use client";

import { CartProductType, ProductPageDataType } from "@/lib/types";
import { cn, isProductValidToAdd } from "@/lib/utils";
import { FC, useEffect, useState } from "react";
import ProductSwiper from "./ProductSwiper";
import ProductInfo from "./product-info/ProductInfo";
import ShipTo from "./shipping/ShipTo";
import ShippingDetails from "./shipping/ShippingDetails";
import ReturnsPrivacySecurityCard from "./product-info/ReturnsPrivacySecurityCard";
import QuantitySelector from "./QuantitySelector";
import SocialShare from "../shared/SocialShare";

interface ProductPageContainerProps {
  productData: ProductPageDataType;
  sizeId: string | undefined;
  children: React.ReactNode;
}

const ProductPageContainer: FC<ProductPageContainerProps> = ({
  children,
  productData,
  sizeId,
}) => {
  if (!productData || typeof productData.shippingDetails === "boolean") {
    return null;
  }

  const { images, shippingDetails, sizes } = productData;

  const data: CartProductType = {
    productId: productData.productId || "",
    variantId: productData.variantId,
    productSlug: productData.productSlug || "",
    variantSlug: productData.variantSlug,
    name: productData.name || "",
    variantName: productData.variantName,
    image: images?.[0]?.url || "",
    variantImage: productData.variantImage,
    quantity: 1,
    price: 0,
    sizeId: sizeId || "",
    size: "",
    stock: 1,
    weight: productData.weight || 0,
    shippingMethod: shippingDetails?.shippingFeeMethod || "",
    shippingService: shippingDetails?.shippingService || "",
    shippingFee: shippingDetails?.shippingFee || 0,
    extraShippingFee: shippingDetails?.extraShippingFee || 0,
    deliveryTimeMin: shippingDetails?.deliveryTimeMin || 0,
    deliveryTimeMax: shippingDetails?.deliveryTimeMax || 0,
    isFreeShipping: shippingDetails?.isFreeShipping || false,
  };

  const [productToBeAddedToCart, setProductToBeAddedToCart] =
    useState<CartProductType>(data);

  const [isProductValid, setIsProductValid] = useState<boolean>(false);

  const handleChange = (property: keyof CartProductType, value: any) => {
    setProductToBeAddedToCart((prev) => ({ ...prev, [property]: value }));
  };

  useEffect(() => {
    const check = isProductValidToAdd(productToBeAddedToCart);
    setIsProductValid(check);
  }, [productToBeAddedToCart]);

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        <ProductSwiper images={images} />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* Product main info */}
          <ProductInfo
            productData={productData}
            quantity={1}
            sizeId={sizeId}
            handleChange={handleChange}
          />
          {/* Shipping details */}
          <div className="w-[390px]">
            <div className="z-10">
              <div className="bg-white border rounded-md overflow-hidden overflow-y-auto p-4 pb-0">
                {/* Ship to */}
                {typeof shippingDetails !== "boolean" && (
                  <>
                    <ShipTo
                      countryName={shippingDetails.countryName}
                      countryCode={shippingDetails.countryCode}
                      city={shippingDetails.city}
                    />
                    <div className="mt-3 space-y-3">
                      <ShippingDetails
                        shippingDetails={shippingDetails}
                        quantity={1}
                        weight={productData.weight}
                      />
                    </div>
                    <ReturnsPrivacySecurityCard
                      returnPolicy={shippingDetails.returnPolicy}
                    />
                  </>
                )}
                <div className="mt-5 bg-white bottom-0 pb-4 space-y-3 sticky">
                  {/* Qty Selector */}
                  {sizeId && (
                    <div className="w-full flex justify-end mt-4">
                      <QuantitySelector
                        productId={productToBeAddedToCart.productId}
                        variantId={productToBeAddedToCart.variantId}
                        sizeId={productToBeAddedToCart.sizeId}
                        sizes={sizes}
                        stock={productToBeAddedToCart.stock}
                        quantity={productToBeAddedToCart.quantity}
                        handleChange={handleChange}
                      />
                    </div>
                  )}
                  <button className="relative w-full py-2.5 min-w-20 bg-orange-background hover:bg-orange-hover text-white h-11 rounded-3xl leading-6 inline-block font-bold whitespace-nowrap border border-orange-border cursor-pointer select-none transition-all duration-300 ease-bezier-1 text-box">
                    <span>Buy now</span>
                  </button>
                  <button
                    disabled={!isProductValid}
                    className={cn(
                      "relative w-full py-2.5 min-w-20 bg-orange-border hover:bg-[#e4cdce] text-orange-hover h-11 rounded-3xl leading-6 inline-block font-bold whitespace-nowrap border border-orange-border cursor-pointer select-none transition-all duration-300 ease-bezier-1 text-box",
                      { "cursor-not-allowed": !isProductValid }
                    )}
                  >
                    <span>Add to cart</span>
                  </button>
                  <SocialShare
                    url={`/product/${productData.productSlug}/${productData.variantSlug}`}
                    quote={`${productData.name} - ${productData.variantName}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[calc(100%-400px) mt-6 pb-15">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
