import { OrderTableDateFilter, OrderTableFilter } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Dispatch, FC, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import DeleteIcon from "@/components/store/icons/delete";

interface Props {
  filter: OrderTableFilter;
  setFilter: Dispatch<SetStateAction<OrderTableFilter>>;
  period: OrderTableDateFilter;
  setPeriod: Dispatch<SetStateAction<OrderTableDateFilter>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const filters: { title: string; filter: OrderTableFilter }[] = [
  {
    title: "View all",
    filter: "",
  },
  {
    title: "To pay",
    filter: "unpaid",
  },
  {
    title: "To ship",
    filter: "toShip",
  },
  {
    title: "Shipped",
    filter: "shipped",
  },
  {
    title: "Delivered",
    filter: "delivered",
  },
];

const date_filters: { title: string; value: OrderTableDateFilter }[] = [
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

const OrderTableHeader: FC<Props> = ({
  filter,
  setFilter,
  period,
  setPeriod,
  search,
  setSearch,
}) => {
  const router = useRouter();
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
            }}
          >
            <DeleteIcon />
          </span>
          <span>Remove all filters</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTableHeader;
