"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import { OfferTag } from "@prisma/client";
import OfferLink from "./OfferLink";
const OfferFilter = ({ offers }: { offers: OfferTag[] }) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="pt-5 pb-4">
      {/* Header */}
      <div
        className="relative cursor-pointer flex items-center justify-between select-none"
        onClick={() => setShow((prev) => !prev)}
      >
        <h3 className="text-sm font-bold overflow-ellipsis capitalize line-clamp-1 text-main-primary">
          Offer
        </h3>
        <span className="absolute right-0">
          {show ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </div>
      {/* Filter */}
      <div
        className={cn("mt-3 flex flex-wrap gap-2", {
          hidden: !show,
        })}
      >
        {offers.map((offer) => (
          <OfferLink key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
};

export default OfferFilter;
