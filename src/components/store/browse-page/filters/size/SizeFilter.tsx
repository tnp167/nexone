"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FiltersQueryType } from "@/lib/types";
import { getFilteredSizes } from "@/queries/size";
import SizeLink from "./SizeLink";
const SizeFilter = ({ queries }: { queries: FiltersQueryType }) => {
  const { category, subCategory, offer, search } = queries;
  const [show, setShow] = useState<boolean>(false);
  const [sizes, setSizes] = useState<{ size: string }[]>([]);
  const [total, setTotal] = useState<number>(10);
  const [take, setTake] = useState<number>(10);

  useEffect(() => {
    handleGetSizes();
  }, [category, subCategory, offer, take]);

  const handleGetSizes = async () => {
    const { sizes, count } = await getFilteredSizes(
      { category, subCategory, offer },
      take
    );
    setSizes(sizes);
    setTotal(count);
  };

  return (
    <div className="pt-5 pb-4">
      {/* Header */}
      <div
        className="relative cursor-pointer flex items-center justify-between select-none"
        onClick={() => setShow((prev) => !prev)}
      >
        <h3 className="text-sm font-bold overflow-ellipsis capitalize line-clamp-1 text-main-primary">
          Size
        </h3>
        <span className="absolute right-0">
          {show ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </div>
      {/* Filter */}
      <div
        className={cn("mt-3 space-y-2", {
          hidden: !show,
        })}
      >
        {sizes.map((size) => (
          <SizeLink key={size.size} size={size.size} />
        ))}
      </div>
    </div>
  );
};

export default SizeFilter;
