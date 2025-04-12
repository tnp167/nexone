import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const SizeLink = ({ size }: { size: string }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const pathname = usePathname();

  const { replace } = useRouter();

  //Params
  const sizeQueryArray = searchParams.getAll("size");

  const existedSize = sizeQueryArray.find((s) => s === size);

  const handleSizeChange = (size: string) => {
    if (existedSize) {
      //Remove only the specific size from params
      const newSizes = sizeQueryArray.filter((s) => s !== size);
      params.delete("size");
      newSizes.forEach((size) => params.append("size", size));
    } else {
      params.append("size", size);
    }
    replaceParams();
  };

  const replaceParams = () => {
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <label
      className="flex items-center text-left cursor-pointer whitespace-nowrap select-none"
      onClick={() => handleSizeChange(size)}
    >
      <span
        className={cn(
          "mr-2 border border-[#ccc] w-3 h-3 relative flex items-center justify-center rrounded-full",
          {
            "bg-black text-white border-black": size === existedSize,
          }
        )}
      >
        {size === existedSize && <Check className="w-4 h-4" />}
      </span>
      <div className="flex-1 text-xs inline-block overflow-visible text-clip whitespace-normal">
        {size}
      </div>
    </label>
  );
};

export default SizeLink;
