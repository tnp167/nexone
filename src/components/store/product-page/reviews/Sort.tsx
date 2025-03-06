import { ReviewsOrderType } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
interface Props {
  sort: ReviewsOrderType | undefined;
  setSort: Dispatch<SetStateAction<ReviewsOrderType | undefined>>;
}

const ReviewsSort: FC<Props> = ({ sort, setSort }) => {
  return (
    <div className="group w-[120px]">
      <button className="text-main-primary hover:text-[#FD384F] text-sm py-0.5 text-center inline-flex items-center">
        Sort by {sort?.orderBy === "latest" ? "latest" : "highest"}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>
      <div className="z-10 hidden absolute bg-white shadow w-[120px] group-hover:block">
        <ul className="text-m text-gray-500">
          <li
            onClick={() => setSort({ orderBy: "highest" })}
            className="py-1.5 px-3 hover:bg-gray-100 cursor-pointer"
          >
            <span className="text-sm block p-2 cursor-pointer hover:bg-gray-100">
              Sort by Highest
            </span>
          </li>
          <li
            onClick={() => setSort({ orderBy: "latest" })}
            className="py-1.5 px-3 hover:bg-gray-100 cursor-pointer"
          >
            <span className="text-sm block p-2 cursor-pointer hover:bg-gray-100">
              Sort by Latest
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewsSort;
