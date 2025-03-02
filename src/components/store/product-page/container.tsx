import { ProductPageDataType } from "@/lib/types";
import { FC } from "react";
import ProductSwiper from "./ProductSwiper";
import ProductInfo from "./product-info/ProductInfo";
import ShipTo from "./shipping/ShipTo";

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
  if (!productData) return null;
  const { images, shippingDetails } = productData;
  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        <ProductSwiper images={images} />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* Product main info */}
          <ProductInfo productData={productData} quantity={1} sizeId={sizeId} />
          {/* Shipping details */}
          <div className="w-[390px]">
            <div className="z-10">
              <div className="bg-white border rounded-md overflow-hidden overflow-y-auto p-4 pb-0">
                {/* Ship to */}
                {typeof shippingDetails !== "boolean" && (
                  <ShipTo
                    countryName={shippingDetails.countryName}
                    countryCode={shippingDetails.countryCode}
                    city={shippingDetails.city}
                  />
                )}
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
