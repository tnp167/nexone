import { SimpleProduct } from "@/lib/types";
import Link from "next/link";
import { FC } from "react";
import Image from "next/image";

interface Props {
  product: SimpleProduct;
}

const ProductSimpleCard: FC<Props> = ({ product }) => {
  console.log(product);
  return (
    <Link href={`/product/${product.slug}/${product.variantSlug}`}>
      <div className="w-[120px] h-[170px] relative flex flex-col rounded-md items-center justify-between p-2">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="min-h-[125px] max-h-[125px] object-cover rounded-lg align-middle shadow-lg"
        />
        <div className="absolute bottom-5 mnt-2 space-y-2">
          <div className="py-2 px-2 bg-red-500 text-whoter font-bold text-sm rounded-lg">
            £{product.price.toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductSimpleCard;
