"use client";

import { FiltersQueryType } from "@/lib/types";
import { X } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const FiltersHeader = ({ queries }: { queries: FiltersQueryType }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [currentParams, setCurrentParams] = useState<string>(
    searchParams.toString()
  );

  useEffect(() => {
    setCurrentParams(searchParams.toString());
  }, [searchParams]);

  //Destructure queries into an array
  const queriesArray = Object.entries(queries);
  const queriesLength = queriesArray.reduce((count, [key, value]) => {
    if (key === "sort") return count;
    return count + (Array.isArray(value) ? value.length : 1);
  }, 0);

  const handleClearQuery = () => {
    const params = new URLSearchParams(searchParams);
    params.forEach((_, key) => {
      params.delete(key);
    });
    replace(`${pathname}?${params.toString()}`);
  };

  const handleRemoveQuery = (
    query: string,
    array?: string[],
    specificValue?: string
  ) => {
    const params = new URLSearchParams(searchParams);
    if (specificValue && array) {
      //Remove specific value from array
      const updatedArray = array.filter((v) => v !== specificValue);
      params.delete(query);
      updatedArray.forEach((v) => params.append(query, v));
    } else {
      //Remove entire query
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`);
    setCurrentParams(params.toString());
  };
  return (
    <div className="pt-3 pb-5">
      <div className="flex items-center justify-between h-4 leading-5">
        <div className="text-sm font-bold">Filter ({queriesLength})</div>
        {queriesLength > 0 && (
          <div
            className="text-xs text-orange-background cursor-pointer hover:underline"
            onClick={handleClearQuery}
          >
            Clear All
          </div>
        )}
      </div>

      {/* Display filters */}
      <div className="mt-3 flex flex-wrap gap-2">
        {queriesArray.map(([key, value]) => {
          if (key === "sort") return null;
          const isArrayQuery = Array.isArray(value);
          const queryValues = isArrayQuery ? value : [value];
          return (
            <div key={key} className="flex flex-wrap gap-2">
              {queryValues.map((v) => (
                <div
                  key={v}
                  className="border cursor-pointer py-1 px-2 rounded-sm text-sm w-fit text-center"
                >
                  <span className="text-main-secondary overflow-hidden text-ellipsis whitespace-nowrap mr-2">
                    {v}
                  </span>
                  <X
                    className="w-3 h-3 text-main-secondary hover:text-black cursor-pointer inline-block"
                    onClick={() =>
                      isArrayQuery
                        ? handleRemoveQuery(key, value, v)
                        : handleRemoveQuery(key, v)
                    }
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FiltersHeader;
