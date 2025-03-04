import ColorWheel from "@/components/shared/color-wheel";
import { ReviewWithImageType } from "@/lib/types";
import Image from "next/image";
import React from "react";
import ReactStars from "react-rating-stars-component";

const ReviewCard = ({ review }: { review: ReviewWithImageType }) => {
  const { images, user } = review;
  const colors = review.color
    .split(",")
    .filter((color) => color.trim() !== "")
    .map((color) => ({ name: color.trim() }));
  const { name } = user;
  const censoredName = `${name[0]}***${name[name.length - 1]}`;
  return (
    <div className="border border-[#d8d88] rounded-xl flex h-fit relative py-4 px-2">
      <div className="w-16 px-2 space-y-1">
        <Image
          src={user.picture}
          alt="Profile Image"
          width={100}
          height={100}
          className="w-11 h-11 rounded-full object-cover"
        />
        <span className="text-sm text-main-secondary">
          {censoredName.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between leading-5 overflow-hidden px-1.5">
        <div className="space-y-2">
          <ReactStars
            count={5}
            size={16}
            color="#F5F5F5"
            activeColor="#FFD804"
            value={review.rating}
            isHalf
            edit={false}
            char="★"
          />
          <div className="flex items-center gap-x-2">
            <ColorWheel colors={colors} size={25} />
            <div className="text-main-secondary text-sm">{review.variant}</div>
            <span>&nbsp;|</span>
            <div className="text-main-secondary text-sm">{review.size}</div>
            <span>&nbsp;| &nbsp;</span>
            <div className="text-main-secondary text-sm">
              {review.quantity} PC
            </div>
          </div>
          <p className="text-sm">{review.review}</p>
          {images.length > 0 && (
            <div className="flex fkex-wrap gap-2">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
