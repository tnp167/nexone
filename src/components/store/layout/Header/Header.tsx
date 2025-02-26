import Link from "next/link";
import React from "react";
import UserMenu from "./UserMenu/UserMenu";
import Cart from "./Cart";
import DownloadApp from "./DownloadApp";
import Search from "./Search/Search";
import { Country } from "@/lib/types";
import { cookies } from "next/headers";
import CountryLanguageCurrencySelector from "./CountryLangCurSelector";

const Header = async () => {
  const cookieStore = await cookies();
  const userCountryCookie = cookieStore.get("userCountry");

  let userCountry: Country = {
    name: "United Kingdom",
    code: "GB",
    city: "London",
    region: "England",
  };

  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as Country;
  }
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="w-full h-full lg:flex text-white px-4 lg:px-12">
        <div className="flex lg:w-full lg:flex-1 flex-col lg:flex-row gap-3 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="font-extrabold text-3xl">NexOne</h1>
            </Link>
            <div className="flex lg:hidden">
              <UserMenu />
              <Cart />
            </div>
          </div>
          <Search />
        </div>

        <div className="hidden lg:flex w-full lg:w-fit lg:mt-2 justify-end mt-1.5 pl-6">
          <div className="lg:flex">
            <DownloadApp />
          </div>
          <CountryLanguageCurrencySelector userCountry={userCountry} />
          <UserMenu />
          <Cart />
        </div>
      </div>
    </div>
  );
};

export default Header;
