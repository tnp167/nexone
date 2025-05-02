"use client";
import { StoreDetailsType } from "@/lib/types";
import React from "react";
import Image from "next/image";
import { CircleCheckBig } from "lucide-react";
import ReactStars from "react-rating-stars-component";

const StoreDetails = ({ details }: { details: StoreDetailsType }) => {
  const { averageRating, cover, description, logo, name, numReviews } = details;
  const numOfReviews = new Intl.NumberFormat().format(numReviews);
  return (
    <div className="relative w-full pb-30">
      <Image
        src={cover}
        alt={name}
        width={1000}
        height={1000}
        className="w-full h-96 object-cover"
      />
      <div className="absolute -bottom-[100px] left-10 flex items-end">
        <Image
          src={logo}
          alt={name}
          width={100}
          height={100}
          className="size-44 object-cover rounded-full shadow-2xl"
        />
        <div className="pl-1 mb-5">
          <div className="flex items-center gap-x-1">
            <h1 className="font-bold text-2xl capitalize leading-5">
              {name.toLowerCase()}
            </h1>
            <CircleCheckBig className="stroke-green-400 mt-1" />
          </div>
          <div className="flex items-center gap-x-1">
            <ReactStars
              count={5}
              value={averageRating}
              edit={false}
              isHalf
              char="★"
              activeColor="#ffd700"
            />
            <p className="text-sm text-main-secondary">
              {numOfReviews} reviews
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
