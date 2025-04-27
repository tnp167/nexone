import React from "react";
import { SimpleProduct } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import UserImage from "@/public/assets/images/default-user.avif";

import Link from "next/link";
import { Button } from "../../../ui/button";
import UserCardProducts from "./Product";
const HomeUserCard = async ({ products }: { products: SimpleProduct[] }) => {
  const user = await currentUser();
  const role = user?.privateMetadata.role;

  return (
    <div className="h-[600px] hidden min-[1170px]:block relative bg-white rounded-md shadow-sm overflow-hidden">
      <div
        className="h-full rounded-md bg-no-repeat pb-9"
        style={{
          backgroundImage: "url(/assets/images/user-card-bg.avif)",
          backgroundSize: "100% 100px",
        }}
      >
        {/* User info */}
        <div className="w-full h-[80px]">
          <div className="mx-auto cursor-pointer">
            <Image
              src={user ? user?.imageUrl : UserImage}
              alt={user?.fullName || "User"}
              width={50}
              height={50}
              className="rounded-full size-12 object-cover absolute left-1/2 -translate-x-1/2 top-2"
            />
          </div>
          <div className="absolute top-16 w-full h5 font-bold text-black text-center cursor-pointer capitalize">
            {user ? user.fullName?.toLowerCase() : "Welcome to NexOne"}
          </div>
        </div>
        {/* User links */}
        <div className="w-full h-[100px] flex items-center gap-x-3 justify-center mt-4">
          <Link href="/profile">
            <span
              className="block relative size-12 mx-auto bg-container bg-no-repeat"
              style={{
                backgroundImage: "url(/assets/images/user-card/user.webp)",
                backgroundSize: "100% 100%",
              }}
            />
            <span className="w-full max-h-7 text-xs text-main-primary text-center">
              Account
            </span>
          </Link>
          <Link href="/profile/orders">
            <span
              className="block relative size-12 mx-auto bg-container bg-no-repeat"
              style={{
                backgroundImage: "url(/assets/images/user-card/orders.webp)",
                backgroundSize: "100% 100%",
              }}
            />
            <span className="w-full max-h-7 text-xs text-main-primary text-center">
              Orders
            </span>
          </Link>
          <Link href="/profile/wishlist">
            <span
              className="block relative size-12 mx-auto bg-container bg-no-repeat"
              style={{
                backgroundImage: "url(/assets/images/user-card/orders.webp)",
                backgroundSize: "100% 100%",
              }}
            />
            <span className="w-full max-h-7 text-xs text-main-primary text-center">
              Wishlist
            </span>
          </Link>
        </div>
        {/* Action btn */}
        <div className="w-full px-2">
          {user ? (
            <div className="w-full">
              {role === "ADMIN" ? (
                <Button variant="orange-gradient" className="rounded-md">
                  <Link href={"/dashboard/admin"}>Admin Dashboard</Link>
                </Button>
              ) : role === "SELLER" ? (
                <Button variant="orange-gradient" className="rounded-md">
                  <Link href={"/dashboard/seller"}>Seller Dashboard</Link>
                </Button>
              ) : (
                <Button variant="orange-gradient" className="rounded-md">
                  <Link href={"/seller/apply"}>Become a Seller</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="w-full flex justify-between gap-x-4">
              <Button variant="orange-gradient" className="w-full">
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="gray" className="w-full">
                <Link href="/sign-in">Register</Link>
              </Button>
            </div>
          )}
        </div>
        {/* Ad swiper */}
        <div className="w-full h-full flex-1 px-2 min-h-[300px] max-h-[400px] pb-[100px] mt-2">
          <div
            className="w-full h-full px-3 bg-[#f5f5f5] bg-cover rounded-md overflow-hidden"
            style={{
              backgroundImage: "url(/assets/images/ads/user-card-ad.avif)",
              backgroundSize: "100% 100%",
            }}
          >
            <Link href="">
              <div className="h-24">
                <div className="mt-3 text-white leading-[20px] text-[13px] overflow-hidden">
                  Your favorite store
                </div>
                <div className="leading-5 font-bold mt-3 text-white">
                  Check out the latest new deals
                </div>
              </div>
            </Link>
            <UserCardProducts products={products} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeUserCard;
