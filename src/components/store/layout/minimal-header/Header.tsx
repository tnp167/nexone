import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ChevronDown, Globe } from "lucide-react";
import React from "react";
import { Button } from "../../ui/button";
import Link from "next/link";
const MinimalHeader = async () => {
  const user = await currentUser();
  return (
    <div className="bg-transparent h-16 w-full border-b border-b-[#e5e5e5]">
      <div className="mx-auto px-6">
        <div className="relative flex items-center justify-between py-2">
          <Link href="/">
            <h1 className="font-extrabold text-2xl font-mono">NexOne</h1>
          </Link>
          <div className="flex items-center gap-x-5">
            <div className="flex items-center gap-x-1">
              <Globe className="size-4" />
              <div className="text-sm text-main-primary py-2 cursor-pointer">
                English
              </div>
              <ChevronDown className="w-3" />
            </div>
            {user ? (
              <UserButton />
            ) : (
              <Link href="/sign-in">
                <Button variant="outline">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalHeader;
