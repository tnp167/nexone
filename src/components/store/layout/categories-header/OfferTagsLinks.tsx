"use client";

import { cn } from "@/lib/utils";
import { OfferTag } from "@prisma/client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive";

const breakpoints = [
  { name: "isPhoneScreen", query: "(max-width: 640px)", value: 2 }, // mobile devices
  { name: "isSmallScreen", query: "(min-width: 640px)", value: 3 }, // sm
  { name: "isMediumScreen", query: "(min-width: 768px)", value: 4 }, // md
  { name: "isLargeScreen", query: "(min-width: 1024px)", value: 6 }, // lg
  { name: "is2XLargeScreen", query: "(min-width: 1536px)", value: 7 }, // 2xl
];

const OfferTagsLinks = ({
  offerTags,
  open,
}: {
  offerTags: OfferTag[];
  open: boolean;
}) => {
  const useBreakpoints = () => {
    const splitPoint = breakpoints.reduce((acc, bp) => {
      const matches = useMediaQuery({ query: bp.query });
      return matches ? bp.value : acc;
    }, 1);
    return splitPoint;
  };

  const splitPoint = useBreakpoints();
  return (
    <div className="relative w-fit">
      <div
        className={cn(
          "flex items-center flex-wrap xl:-translate-x-6 transition-all duration-300 ease-in-out",
          {
            "xl:!translate-x-0 !translate-x-52": open,
          }
        )}
      >
        {offerTags.slice(0, splitPoint).map((offerTag, idx) => (
          <Link
            href={`/browse?offer=${offerTag.url}`}
            key={offerTag.id}
            className={cn(
              "font-bold text-center text-white px-4 leading-10 inline rounded-md hover:bg-[#FFFFFF]",
              {
                "text-orange-background": idx === 0,
              }
            )}
          >
            {offerTag.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OfferTagsLinks;
