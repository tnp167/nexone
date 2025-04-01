import { currentUser } from "@clerk/nextjs/server";
import { Puzzle, WalletCards } from "lucide-react";
import { Heart, Rss } from "lucide-react";
import { Eye } from "lucide-react";
import Image from "next/image";
import React from "react";
import Link from "next/link";
const menu = [
  {
    title: "Wishlist",
    icon: <Heart />,
    link: "/profile/wishlist",
  },
  {
    title: "Following",
    icon: <Rss />,
    link: "/profile/following/1",
  },
  {
    title: "Viewed",
    icon: <Eye />,
    link: "/profile/history/1",
  },
  {
    title: "Coupons",
    icon: <Puzzle />,
    link: "/profile/coupons",
  },
  {
    title: "Shopping credit",
    icon: <WalletCards />,
    link: "/profile/credit",
  },
];

const ProfileOverview = async () => {
  const user = await currentUser();
  if (!user) return null;
  return (
    <div className="w-full bg-red-500">
      <div className="bg-white p-4 border shadow-sm">
        <div className="flex items-center">
          <Image
            src={user.imageUrl || ""}
            alt={user.fullName || ""}
            width={200}
            height={200}
            className="size-14 rounded-full object-cover"
          />
          <div className="flex-1 ml-4 text-main-primary text-xl font-bold capitalize">
            {user.fullName?.toLowerCase()}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap py-4">
          {menu.map((item) => (
            <Link
              href={item.link}
              key={item.title}
              className="w-36 relative flex flex-col items-center justify-center"
            >
              <div className="text-3xl">
                <span>{item.icon}</span>
              </div>
              <div className="mt-2">{item.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
