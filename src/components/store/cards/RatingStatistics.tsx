"use client";

import { StatisticsCardType } from "@/lib/types";
import React from "react";
import ReactStars from "react-rating-stars-component";

const RatingStatisticsCard = ({
  statistics,
}: {
  statistics: StatisticsCardType;
}) => {
  return (
    <div className="h-44 flex-1">
      <div className="py-5 px-7 bg-[#f5f5f5] flex flex-col gap-y-3 h-full justify-center overflow-hidden rounded-lg">
        {statistics.reverse().map((stat) => (
          <div key={stat.rating} className="flex items-center h-4">
            <ReactStars
              count={5}
              value={stat.rating}
              color="#E2DFDF"
              activeColor="#FFD804"
              isHalf={true}
              edit={false}
              size={15}
              char="★"
            />
            <div className="relative w-full flex-1 h-1.5 mx-2.5 bg-[#E2DFDF] rounded-full">
              <div
                className="absolute left-0 h-full rounded-full bg-[#FFC50A]"
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
            <div className="text-xs w-12 leading-4">{stat.numReviews}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingStatisticsCard;
