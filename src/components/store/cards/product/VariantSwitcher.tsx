import { Dispatch, FC, SetStateAction } from "react";
import { variantImageType, VariantSimplified } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface Props {
  images: variantImageType[];
  variants: VariantSimplified[];
  setVariant: Dispatch<SetStateAction<VariantSimplified>>;
  selectedVariant: VariantSimplified;
}

const VariantSwitcher: FC<Props> = ({
  images,
  variants,
  setVariant,
  selectedVariant,
}) => {
  return (
    <div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {images.map((img, idx) => (
            <Link
              key={idx}
              href={img.url}
              className={cn("p-0.5 rounded-full border-2 border-transparent", {
                "border-border": variants[idx] === selectedVariant,
              })}
              onMouseEnter={() => setVariant(variants[idx])}
            >
              <Image
                src={img.image}
                alt=""
                width={100}
                height={100}
                className="w-8 h-8 object-cover rounded-full"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantSwitcher;
