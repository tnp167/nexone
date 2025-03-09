"use client";

import {
  ProductPageDataType,
  RatingStatisticsType,
  ReviewWithImageType,
  ReviewFiltersType,
  SortOrder,
  ReviewsOrderType,
  VariantInfoType,
} from "@/lib/types";
import React, { FC, useEffect, useState } from "react";
import ProductRatingCard from "../../cards/ProductRating";
import RatingStatisticsCard from "../../cards/RatingStatistics";
import ReviewCard from "../../cards/Review";
import { getProductFilteredReviews } from "@/queries/product";
import ReviewsFilters from "./Filters";
import ReviewsSort from "./Sort";
import Pagination from "../../shared/Pagination";
import ReviewDetails from "../../forms/ReviewDetails";
interface Props {
  productId: string | undefined;
  rating: number | undefined;
  statistics: RatingStatisticsType;
  reviews: ReviewWithImageType[];
  variantInfo: VariantInfoType[];
}

const ProductReviews: FC<Props> = ({
  productId,
  rating,
  statistics,
  reviews,
  variantInfo,
}) => {
  const [data, setData] = useState<ReviewWithImageType[]>(reviews);
  const { totalReviews, ratingStatistics } = statistics || {};
  const half = Math.ceil(data.length / 2);

  //Filtering
  const filteredData = {
    rating: undefined,
    hasImages: undefined,
  };

  const [filters, setFilters] = useState<ReviewFiltersType>(filteredData);

  //Sorting
  const [sort, setSort] = useState<ReviewsOrderType | undefined>({
    orderBy: "latest",
  });

  //Pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);

  const handleGetReviews = async () => {
    const response = await getProductFilteredReviews(
      productId,
      filters,
      sort,
      page,
      pageSize
    );
    setData(response);
  };

  useEffect(() => {
    if (filters.rating || filters.hasImage || sort) {
      setPage(1);
      handleGetReviews();
    }
    if (page) {
      handleGetReviews();
    }
  }, [filters, sort, page]);

  return (
    <div id="reviews" className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-main-primary text-2xl font-bold">
          Customer Reviews ({totalReviews})
        </h2>
      </div>
      {/* Statistics */}
      <div className="w-full">
        <div className="flex items-ceter gap-4">
          <ProductRatingCard rating={rating || 0} />
          <RatingStatisticsCard statistics={ratingStatistics || []} />
        </div>
      </div>
      {totalReviews! > 0 && (
        <>
          <div className="space-y-6">
            <ReviewsFilters
              filters={filters}
              setFilters={setFilters}
              stats={statistics}
              setSort={setSort}
            />
            <ReviewsSort sort={sort} setSort={setSort} />
          </div>
          {/* Reviews */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {data.length > 0 ? (
              <>
                <div className="flex flex-col gap-3">
                  {data.slice(0, half).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {data.slice(half).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </>
            ) : (
              <div>No reviews found</div>
            )}
          </div>
          {data.length > pageSize && (
            <Pagination
              page={page}
              totalPages={
                filters.rating || filters.hasImage
                  ? data.length / pageSize
                  : totalReviews / pageSize
              }
              setPage={setPage}
            />
          )}
        </>
      )}
      <div className="mt-5">
        <ReviewDetails
          productId={productId || ""}
          variantsInfo={variantInfo}
          setReviews={setData}
          reviews={data}
        />
      </div>
    </div>
  );
};

export default ProductReviews;
