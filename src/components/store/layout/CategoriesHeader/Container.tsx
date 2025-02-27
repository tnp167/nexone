"use client";

import { Category } from "@prisma/client";
import { useState } from "react";
import CategoriesMenu from "./CategoriesMenu";

export default function CategoriesHeaderContainer({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="w-full px-4 flex items-center gap-x-1">
      <CategoriesMenu categories={categories} open={open} setOpen={setOpen} />
    </div>
  );
}
