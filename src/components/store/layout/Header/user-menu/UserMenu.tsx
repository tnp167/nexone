import { currentUser } from "@clerk/nextjs/server";
import { UserIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/store/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageIcon, OrderIcon, WishlistIcon } from "@/components/store/icons";

const links = [
  {
    icon: <OrderIcon />,
    title: "My Orders",
    link: "/profile/orders",
  },
  {
    icon: <MessageIcon />,
    title: "Messages",
    link: "/profile/messages",
  },
  {
    icon: <WishlistIcon />,
    title: "WishList",
    link: "/profile/wishlist",
  },
];
const extraLinks = [
  {
    title: "Profile",
    link: "/profile",
  },
  {
    title: "Settings",
    link: "/",
  },
  {
    title: "Become a Seller",
    link: "/become-seller",
  },
  {
    title: "Help Center",
    link: "",
  },
  {
    title: "Return & Refund Policy",
    link: "/",
  },
  {
    title: "Legal & Privacy",
    link: "",
  },
  {
    title: "Discounts & Offers",
    link: "",
  },
  {
    title: "Order Dispute Resolution",
    link: "",
  },
  {
    title: "Report a Problem",
    link: "",
  },
];

const UserMenu = async () => {
  const user = await currentUser();
  return (
    <div className="relative group">
      {/* Trigger */}
      <div>
        {user ? (
          <Image
            src={user.imageUrl}
            alt={user.fullName || "user"}
            width={32}
            height={32}
            className="size-10 object-cover rounded-full"
          />
        ) : (
          <div className="flex h-10 items-center py-0 mx-2 cursor-pointer">
            <span className="text-2xl">
              <UserIcon />
            </span>
            <div className="ml-1">
              <span className="block text-xs text-white leading-3">
                Welcome
              </span>
              <div className="font-bold text-cs text-white leading-4">
                <span>Sign in / Register</span>
                <span className="text-white scale-[60%] align-middle inline-block">
                  <ChevronDown />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Content */}
      <div
        className={cn(
          "hidden absolute top-0 -left-20 group-hover:block cursor-pointer",
          {
            "-left-[200px] lg:-left-[145px]": user,
          }
        )}
      >
        <div className="relative left-2 mt-8 right-auto bottom-auto pt-2.5 text-[#222] p-0 text-sm z-10">
          {/* Triangle */}
          <div className="w-0 h-0 absolute left-[149px] top-1 right-24 !border-l-[10px] !border-l-transparent !border-r-[10px] !border-r-transparent !border-b-[10px] border-b-white"></div>
          {/* Menu */}
          <div className="rounded-3xl bg-white text-sm text-[#222] shadow-lg">
            <div className="w-[305px]">
              <div className="pt-5 px-6 pb-0">
                {user ? (
                  <div className="user-avatar flex flex-col items-center justify-center">
                    <UserButton />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link href="/sign-in">
                      <Button>Sign in</Button>
                    </Link>
                    <Link
                      href="/sign-up"
                      className="h-10 text-sm hover:underline text-main-primary flex items-center justify-center cursor-pointer"
                    >
                      Register
                    </Link>
                  </div>
                )}
                {user && (
                  <p className="my-2 text-center text-sm text-main-primary  cursor-pointer">
                    <SignOutButton />
                  </p>
                )}
                <Separator />
              </div>
              {/* Links */}
              <div className="max-w-[calc(100vh-180px)] text-main-secondary overflow-y-auto overflow-x-hidden">
                <ul className="grid grid-cols-3 gap-2 py-2.5 px-4 w-full">
                  {links.map((link) => (
                    <li key={link.title} className="grid place-items-center">
                      <Link href={link.link} className="space-y-2">
                        <div className="w-14 h-14 rounded-full p-2 grid place-items-center bg-gray-100 hover:bg-gray-200">
                          <span className="text-gray-500">{link.icon}</span>
                        </div>
                        <span className="block text-xs">{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Separator />
                <ul className="pt-2.5 pr-4 pb-1 pl-4 w-[288px]">
                  {extraLinks.map((item, i) => (
                    <li key={i}>
                      <Link href={item.link} legacyBehavior>
                        <a className="block text-sm text-main-primary py-1.5 hover:underline">
                          {item.title}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
