import { cn } from "@/lib/utils";
import { MoveLeft, MoveRight } from "lucide-react";
import { Dispatch, FC } from "react";

import { SetStateAction } from "react";

interface Props {
  page: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
}

const Pagination: FC<Props> = ({ page, totalPages, setPage }) => {
  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev);
    }
  };

  return (
    <div className="w-full py-10 lg:px-0 sm:px-6 px-4">
      <div className="w-full flex items-center justify-end gap-x-4 border-t border-gray-200">
        <div
          className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
          onClick={() => handlePrevious(page)}
        >
          <MoveLeft className="w-3" />
          <p className="text-sm font-medium leading-none mr-3">Previous</p>
        </div>
        <div className="flex flex-wrap">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "text-sm font-medium leading-none cursor-pointer text-gray-600  hover:text-orange-background  border-t border-transparent pt-3 mr-4 px-2",
                {
                  "border-indigo-400": idx + 1 === page,
                }
              )}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </span>
          ))}
        </div>
        <div
          className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
          onClick={() => handleNext()}
        >
          <p className="text-sm font-medium leading-none mr-3">Next</p>
          <MoveRight className="w-3" />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
