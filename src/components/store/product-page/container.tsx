import { ProductPageDataType } from "@/lib/types";
import { FC } from "react";
import ProductSwiper from "./ProductSwiper";

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
  const { images } = productData;
  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        <ProductSwiper images={images} />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* Product main info */}
          {/* Buy ctions card */}
        </div>
      </div>
      <div className="w-[calc(100%-400px) mt-6 pb-15">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
