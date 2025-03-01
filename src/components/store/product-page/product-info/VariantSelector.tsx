import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface Variant {
  url: string;
  image: string;
  slug: string;
}

interface Props {
  variants: Variant[];
  slug: string;
}

const ProductVariantSelector: FC<Props> = ({ variants, slug }) => {
  console.log(slug);
  return (
    <div className="flex items-center flex-wrap gap-2">
      {variants.map((variant, i) => (
        <Link key={i} href={variant.url}>
          <div
            className={cn(
              "w-12 h-12 rounded-full grid place-items-center p-0.5 overflow-hidden border border-transparent transition-all duration-75 ease-in cursor-pointer hover:border-main-primary/85",
              {
                "border-main-primary": slug === variant.slug,
              }
            )}
          >
            <Image
              src={variant.image}
              alt={variant.url}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductVariantSelector;
