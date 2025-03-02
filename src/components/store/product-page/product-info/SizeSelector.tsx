import { Size } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";

interface Props {
  sizes: Size[];
  sizeId: string | undefined;
}
const SizeSelector: FC<Props> = ({ sizes, sizeId }) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleSizeClick = (sizeId: string) => {
    params.set("size", sizeId);
    replace(`${pathname}?${params.toString()}`);
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
