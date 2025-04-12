"use client";

import { CategoryWithSubsType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import CategoryLink from "./CategoryLink";
const CategoryFilter = ({
  categories,
}: {
  categories: CategoryWithSubsType[];
}) => {
  const [show, setShow] = useState<boolean>(true);
  return (
    <div className="pt-5 pb-4">
      {/* Header */}
      <div
        className="relative cursor-pointer flex items-center justify-between select-none"
        onClick={() => setShow((prev) => !prev)}
      >
        <h3 className="text-sm font-bold overflow-ellipsis capitalize line-clamp-1 text-main-primary">
          Category
        </h3>
        <span className="absolute right-0">
          {show ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </div>
      {/* Filter */}
      <div
        className={cn("mt-3", {
          hidden: !show,
        })}
      >
        {categories.map((category) => (
          <CategoryLink key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
