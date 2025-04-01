"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const menu = [
  {
    title: "Overview",
    link: "/profile",
  },
  {
    title: "Orders",
    link: "/profile/orders",
  },
  {
    title: "Payment",
    link: "/profile/payment",
  },
  {
    title: "Shipping address",
    link: "/profile/addresses",
  },
  {
    title: "Reviews",
    link: "/profile/reviews",
  },
  {
    title: "History",
    link: "/profile/history/1",
  },
  {
    title: "Wishlist",
    link: "/profile/wishlist/1",
  },
  {
    title: "Following",
    link: "/profile/following/1",
  },
];

const ProfileSidebar = () => {
  const pathname = usePathname();
  const path = pathname.split("/profile/")[1];
  return (
    <div>
      <div className="w-full p-4 text-xs text-[#999]">
        <span>
          <Link href="/">Home</Link>
          <span className="mx-2">&gt;</span>
        </span>
        <span>
          <Link href="/profile">Account</Link>
          {pathname !== "/profile" && <span className="mx-2">&gt;</span>}
        </span>
        {path && (
          <span>
            <Link href={pathname} className="capitalize">
              {path}
            </Link>
          </span>
        )}
      </div>
      <div className="bg-white">
        <div className="py-4 inline-block w-[300px] min-h-72 mr-6">
          <div className="font-bold text-main-primary flex h-9 items-center px-4">
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">
              Account
            </div>
          </div>
          {/* Links */}
          {menu.map((item) => (
            <Link key={item.title} href={item.link}>
              <div
                className={cn(
                  "relative flex h-9 items-center px-4 text-sm cursor-pointer hover:bg-[#F5F5F5]",
                  {
                    "bg-[#F5F5F5] user-menu-item":
                      item.link && pathname === item.link,
                  }
                )}
              >
                <span>{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
