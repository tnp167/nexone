import React from "react";
import { FeaturedCategoryType } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
const CategoryCard = ({ category }: { category: FeaturedCategoryType }) => {
  return (
    <div className="size-full rounded-[10px] bg-white">
      <Link href={`/browse?category=${category.url}`}>
        <div className="px-5 pt-4 flex items-center justify-between">
          <span className="text-[20px] text-black font-extrabold line-clamp-1 overflow-hidden flex-1">
            {category.name}
          </span>
          <span className="block text-[14px] text-[#666] mr-3 hover:underline">
            View more
          </span>
        </div>
      </Link>
      <div className="flex gap-x-2 p-4">
        {category.subCategories.map((subCategory) => (
          <Link
            href={`/browse?category=${subCategory.url}`}
            key={subCategory.id}
          >
            <div className="cursor-pointer rounded-md overflow-hidden">
              <Image
                src={subCategory.image}
                alt={subCategory.name}
                width={100}
                height={100}
                className="w-[180px] h-[189px] object-cover rounded-md hover:opacity-80"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
