import { CartProductType } from "@/lib/types";
import { Size } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect } from "react";

interface Props {
  sizes: Size[];
  sizeId: string | undefined;
  handleChange: (property: keyof CartProductType, value: any) => void;
}
const SizeSelector: FC<Props> = ({ sizes, sizeId, handleChange }) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    if (sizeId) {
      const searchSize = sizes.find((s) => s.id === sizeId);
      if (searchSize) {
        handleCartProductToBeAdded(searchSize);
      }
    }
  }, []);

  const handleSizeClick = (size: Size) => {
    params.set("size", size.id);
    handleCartProductToBeAdded(size);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleCartProductToBeAdded = (size: Size) => {
    handleChange("size", size.size);
    handleChange("sizeId", size.id);
  };
  return (
    <div className="flex flex-wrap gap-4">
      {sizes.map((size) => (
        <span
          key={size.size}
          className="border rounded-full px-5 py-1 cursor-pointer hover:border-black"
          style={{ borderColor: size.id === sizeId ? "#000" : "" }}
          onClick={() => handleSizeClick(size.id)}
        >
          {size.size}
        </span>
      ))}
    </div>
  );
};

export default SizeSelector;
