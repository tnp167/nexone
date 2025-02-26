"use client";

import "@/node_modules/flag-icons/css/flag-icons.min.css";
import { Country, SelectMenuOption } from "@/lib/types";
import { ChevronDown, ChevronDownIcon } from "lucide-react";
import CountrySelector from "@/components/shared/country-selector";
import countries from "@/data/countries.json";
import { useState } from "react";
import { useRouter } from "next/navigation";
const CountryLanguageCurrencySelector = ({
  userCountry,
}: {
  userCountry: Country;
}) => {
  const [show, setshow] = useState(false);
  const router = useRouter();
  const handleCountryClick = async (country: string) => {
    const countryData = countries.find((c) => c.name === country);
    if (countryData) {
      const data: Country = {
        name: countryData.name,
        code: countryData.code,
        city: "",
        region: "",
      };
      try {
        const response = await fetch("/api/setUserCountryInCookies", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ userCountry: data }),
        });
        if (response.ok) {
          router.refresh();
        }
      } catch (error) {
        console.log("Error in handleCountryClick", error);
      }
    }
  };
  return (
    <div className="relative inline-block group">
      {/* Trigger */}
      <div>
        <div className="flex items-center h-11 py-0 px-2 cursor-pointer">
          <span className="mr-0.5 h[33px] grid place-items-center">
            <span className={`fi fi-${userCountry.code.toLowerCase()}`}></span>
          </span>
          <div className="ml-1">
            <span className="block text-xs text-white leading-3 mt-2">
              {userCountry.name}/EN/
            </span>
            <div className="text-xs font-bold text-white">
              GBP
              <span className="text-white scale-[60%] align-middle inline-block">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="absolute hidden top-0 group-hover:block cursor-pointer">
        <div className="relative mt-12 -ml-32 w-[300px] bg-white rounded-[24px]  text-main-primary pt-2 px-6 pb-6 z-50 shadow-lg">
          <div className="w-0 h-0 absolute -top-1.5 right-24 border-l-[10px] border-l-transparent border-b-[10px] border-white border-r-[10px] border-r-transparent" />
          <div className="mt-4 leading-6 text-[20px] font-bold">Ship to</div>
          <div className="mt-2">
            <div className="relative text-main-primary">
              <CountrySelector
                id={"countries"}
                open={show}
                onToggle={() => setshow(!show)}
                onChange={(val) => {
                  handleCountryClick(val);
                }}
                selectedValue={
                  (countries.find(
                    (option) => option.name === userCountry?.name
                  ) as SelectMenuOption) || countries[0]
                }
              />
              <div>
                <div className="mt-4 leading-6 text-[20px] font-bold">
                  Language
                </div>
                <div className="relative mt-2.5 h-10 py-0 px-3 border-[1px] border-black/20 rounded-lg  flex items-center cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">
                  <div className="align-middle">English</div>
                  <span className="absolute right-2">
                    <ChevronDown className="text-main-primary scale-75" />
                  </span>
                </div>
              </div>
              <div>
                <div className="mt-4 leading-6 text-[20px] font-bold">
                  Currency
                </div>
                <div className="relative mt-2.5 h-10 py-0 px-3 border-[1px] border-black/20 rounded-lg  flex items-center cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">
                  <div className="align-middle">GBP</div>
                  <span className="absolute right-2">
                    <ChevronDown className="text-main-primary scale-75" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryLanguageCurrencySelector;
