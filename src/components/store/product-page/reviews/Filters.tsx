import {
  RatingStatisticsType,
  ReviewsFiltersType,
  ReviewsOrderType,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  filters: ReviewsFiltersType;
  setFilters: Dispatch<SetStateAction<ReviewsFiltersType>>;
  stats: RatingStatisticsType;
  setSort: Dispatch<SetStateAction<ReviewsOrderType | undefined>>;
}

const ReviewsFilters: FC<Props> = ({ filters, setFilters, stats, setSort }) => {
  const { rating, hasImages } = filters;
  const { ratingStatistics, reviewsWithImagesCount, totalReviews } = stats;
  return (
    <div className="mt-8 relative overflow-hidden">
      <div className="flex flex-wrap gap-4">
        {/* All */}
        <div
          className={cn(
            "bg-[#f5f5f5] text-main-primary border border-transparent rounded-full cursor-pointer py-1.5 px-4",
            {
              "bg-[#FFEBED] text-[#FD384F] border-[#FD384F]":
                !rating && !hasImages,
            }
          )}
          onClick={() => {
            setFilters({ rating: undefined, hasImages: undefined });
            setSort(undefined);
          }}
        >
          All ({totalReviews})
        </div>
        {/* Include Images */}
        <div
          className={cn(
            "bg-[#f5f5f5] text-main-primary border border-transparent rounded-full cursor-pointer py-1.5 px-4",
            {
              "bg-[#FFEBED] text-[#FD384F] border-[#FD384F]": hasImages,
            }
          )}
          onClick={() => setFilters({ ...filters, hasImages: !hasImages })}
        >
          Include Pictures ({reviewsWithImagesCount})
        </div>
        {/* Rating Filters */}
        {ratingStatistics.map((r) => (
          <div
            key={r.rating}
            className={cn(
              "bg-[#f5f5f5] text-main-primary border border-transparent rounded-full cursor-pointer py-1.5 px-4",
              {
                "bg-[#FFEBED] text-[#FD384F] border-[#FD384F]":
                  rating === r.rating,
              }
            )}
            onClick={() => {
              setFilters({ ...filters, rating: r.rating });
            }}
          >
            {r.rating} Stars ({r.numReviews})
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsFilters;
