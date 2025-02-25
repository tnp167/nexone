import Link from "next/link";
import React from "react";
import UserMenu from "./UserMenu/UserMenu";

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="w-full h-full lg:flex text-white px-4 lg:px-12">
        <div className="flex gap-3 py-3 lg:w-full lg:flex-1 flex-col lg:flex-row">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="font-extrabold text-3xl">NexOne</h1>
            </Link>
            <div className="flex lg:hidden">
              <UserMenu />
              <div className="w-44"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
