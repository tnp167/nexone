"use client";

import { SearchIcon } from "@/components/store/icons";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { SearchResult } from "@/lib/types";
import SearchSuggestions from "./Suggestions";
const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const { push, replace } = useRouter();

  const searchQueryUrl = params.get("search");
  const [searchQuery, setSearchQuery] = useState(searchQueryUrl || "");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pathname !== "/browse") {
      push(`/browse?search=${searchQuery}`);
    } else {
      if (!searchQuery) {
        params.delete("search");
      } else {
        params.set("search", searchQuery);
        setSuggestions([]);
      }
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (pathname === "/browse") return;
    if (value.length >= 2) {
      try {
        const response = await fetch(`/api/search-products?search=${value}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      setSuggestions([]);
    }
  };
  return (
    <div className="relative lg:w-full flex-1">
      <form
        className="h-10 rounded-3xl bg-white relative border-none flex"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Search..."
          className="bg-white text-black flex-1 border-none pl-2.5 m-2.5 outline-none"
          value={searchQuery}
          onChange={handleInputChange}
        />
        {suggestions.length > 0 && (
          <SearchSuggestions suggestions={suggestions} query={searchQuery} />
        )}
        <button
          type="submit"
          className=" rounded-[20px] w-[56px] h-8 mt-1 mr-1 mb-0 ml-0 bg-gradient-to-r from-slate-500 to-slate-500 grid place-items-center cursor-pointer"
        >
          <SearchIcon />
        </button>
      </form>
    </div>
  );
};

export default Search;
