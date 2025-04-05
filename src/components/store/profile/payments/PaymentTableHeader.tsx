"use client";
import { PaymentTableDateFilter, PaymentTableFilter } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeleteIcon from "@/components/store/icons/delete";
import { SearchIcon } from "../../icons";

interface Props {
  filter: PaymentTableFilter;
  setFilter: Dispatch<SetStateAction<PaymentTableFilter>>;
  period: PaymentTableDateFilter;
  setPeriod: Dispatch<SetStateAction<PaymentTableDateFilter>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const filters: { title: string; filter: PaymentTableFilter }[] = [
  {
    title: "View all",
    filter: "",
  },
  {
    title: "Paypal",
    filter: "paypal",
  },
  {
    title: "Credit card",
    filter: "credit-card",
  },
];

const date_filters: { title: string; value: PaymentTableDateFilter }[] = [
  {
    title: "All time",
    value: "",
  },
  {
    title: "last 6 months",
    value: "last-6-months",
  },
  {
    title: "last 1 year",
    value: "last-1-year",
  },
  {
    title: "last 2 years",
    value: "last-2-years",
  },
];

const PaymentTableHeader: FC<Props> = ({
  filter,
  setFilter,
  period,
  setPeriod,
  search,
  setSearch,
}) => {
  const router = useRouter();

  //Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

  //Update parent search state when the debounced search changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedSearch.length) {
        setSearch(debouncedSearch);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [debouncedSearch, setSearch]);

  return (
    <div className="pt-4 px-6 bg-white">
      <div className="flex items-center justify-between">
        <div className="-ml-2 text-sm text-main-primary">
          <div className="relative overflow-x-hidden">
            <div className="py-4 inline-flex items-center bg-white justifycenter relative">
              {filters.map((f, index) => (
                <div
                  key={f.filter}
                  className={cn(
                    "relative px-4 text-main-primary whitespace-nowrap cursor-pointer",
                    {
                      "user-orders-table-tr font-bold": f.filter === filter,
                    }
                  )}
                  onClick={() => {
                    if (f.filter === "") {
                      router.refresh();
                      setFilter(f.filter);
                    } else {
                      setFilter(f.filter);
                    }
                  }}
                >
                  {f.title}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-1 text-xs cursor-pointer">
          <span
            className="mx-2 inline-block translate-y-0.5"
            onClick={() => {
              setFilter("");
              setDebouncedSearch("");
              setSearch("");
            }}
          >
            <DeleteIcon />
          </span>
          <span>Remove all filters</span>
        </div>
      </div>
      {/* Search Form */}
      <div className="flex items-center justify-between mt-3">
        <div className="w-[500px] text-main-primary text-sm leading-6 relative flex">
          {/* Select */}
          <div className="relative mb-4 w-fit">
            <select className="h-8 px-4 w-24 appearance-none outline-none cursor-pointer hover:border-[1px] hover:border-black border rounded-l-md">
              <option value="">
                <div className="flex h-8 text-left text-sm overflow-hidden">
                  <span className="flex-1 whitespace-nowrap">Order</span>
                </div>
              </option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                viewBox="0 0 1024 1024"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="false"
                focusable="false"
              >
                <path d="M97.6 308.032a35.925333 35.925333 0 0 0-4.128 49.813333l1.408 1.632 355.232 371.914667a85.333333 85.333333 0 0 0 123.381333 0.032l355.626667-371.946667a35.936 35.936 0 0 0-2.730667-51.445333 37.674667 37.674667 0 0 0-50.944 1.130667l-1.504 1.546666L527.253333 674.986667a21.333333 21.333333 0 0 1-30.922666 0L150.058667 310.698667a37.653333 37.653333 0 0 0-52.448-2.666667z" />
              </svg>
            </span>
          </div>
          {/* Input */}
          <input
            type="text"
            placeholder="Order ID. product or store name"
            className="h-8 border text-sm relative inline-block w-full py-[3px] px-3 text-main-primary leading-6 bg-white  transition-all duration-75 placeholder:text-xs"
            value={debouncedSearch}
            onChange={(e) => {
              setDebouncedSearch(e.target.value);
            }}
          />
          {/* Search Icon */}
          <span className="-ml-[1px] rounded-r-md relative bg-white text-center">
            <button className="rounded-r-md min-w-[52px] h-8 text-white bg-[linear-gradient(90deg,_#ff640e,_#ff3000)] grid place-items-center">
              <span className="text-2xl inline-block ">
                <SearchIcon />
              </span>
            </button>
          </span>
        </div>
        <div className="flex items-center">
          {/* Select */}
          <div className="relative mb-4 w-fit ">
            <select
              className="h-8 px-4 w-40 appearance-none outline-none cursor-pointer hover:border-[1px] hover:border-black border rounded-md"
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value as PaymentTableDateFilter)
              }
            >
              {date_filters.map((f) => (
                <option
                  key={f.value}
                  value={f.value}
                  className="flex h-8 text-left text-sm overflow-hidden"
                >
                  <span className="flex-1 whitespace-none">{f.title}</span>
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                viewBox="0 0 1024 1024"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="false"
                focusable="false"
              >
                <path d="M97.6 308.032a35.925333 35.925333 0 0 0-4.128 49.813333l1.408 1.632 355.232 371.914667a85.333333 85.333333 0 0 0 123.381333 0.032l355.626667-371.946667a35.936 35.936 0 0 0-2.730667-51.445333 37.674667 37.674667 0 0 0-50.944 1.130667l-1.504 1.546666L527.253333 674.986667a21.333333 21.333333 0 0 1-30.922666 0L150.058667 310.698667a37.653333 37.653333 0 0 0-52.448-2.666667z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTableHeader;
