import { CategoryWithSubsType } from "@/lib/types";
import { Minus, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const CategoryLink = ({ category }: { category: CategoryWithSubsType }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const pathname = usePathname();

  const { replace } = useRouter();

  //Params
  const categoryQuery = searchParams.get("category");

  const subCategoryQuery = searchParams.get("subCategory");

  const [expand, setExpand] = useState<boolean>(false);

  const handleCategoryChange = (category: string) => {
    if (category === categoryQuery) return;
    params.delete("subCategory");
    params.set("category", category);
    replaceParams();
  };

  const handleSubCategoryChange = (sub: string) => {
    if (category.url !== categoryQuery) params.set("category", category.url);
    if (sub === subCategoryQuery) {
      params.delete("subCategory");
    } else {
      params.set("subCategory", sub);
    }

    replaceParams();
  };

  const replaceParams = () => {
    replace(`${pathname}?${params.toString()}`);
    setExpand(true);
  };
  return (
    <div>
      <section>
        <div className="mt-2 leading-3 relatie w-full flex items-center justify-between">
          <label
            htmlFor={category.id}
            className="flex items-center text-left cursor-pointer whitespace-nowrap select-none"
            onClick={() => handleCategoryChange(category.url)}
          >
            <span className="mr-2 border border-[#ccc] size-3 rounded-full relative grid place-items-center">
              {category.url === categoryQuery && (
                <div className="size-2 inline-block bg-black rounded-full"></div>
              )}{" "}
            </span>
            <div className="flex-1 text-xs inline-block overflow-visible text-clip whitespace-normal">
              {category.name}
            </div>
          </label>
          <span
            className="cursor-pointer"
            onClick={() => setExpand((prev) => !prev)}
          >
            {expand ? <Minus className="w-3" /> : <Plus className="w-3" />}
          </span>
        </div>
        {expand && (
          <>
            {category.subCategories.map((subCategory) => (
              <section
                key={subCategory.id}
                className="pl-5 mt-2 leading-5 relative"
              >
                <label
                  htmlFor={subCategory.id}
                  className="w-full flex items-center text-left cursor-pointer whitespace-nowrap select-none"
                  onClick={() => handleSubCategoryChange(subCategory.url)}
                >
                  <span className="mr-2 border border-[#ccc] size-3 rounded-full relative grid place-items-center">
                    {subCategory.url === subCategoryQuery && (
                      <div className="size-2 inline-block bg-black rounded-full"></div>
                    )}
                  </span>
                  <div className="flex-1 text-xs inline-block overflow-visible text-clip whitespace-normal">
                    {subCategory.name}
                  </div>
                </label>
              </section>
            ))}
          </>
        )}
      </section>
    </div>
  );
};

export default CategoryLink;
