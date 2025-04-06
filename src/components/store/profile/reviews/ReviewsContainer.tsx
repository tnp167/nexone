"use client";

import {
  ReviewDateFilter,
  ReviewFilter,
  ReviewWithImageType,
} from "@/lib/types";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/store/shared/Pagination";
import { getUserReviews } from "@/queries/profile";
import ReviewCard from "../../cards/Review";
import ReviewsHeader from "./ReviewsHeader";
const ReviewsContainer = ({
  reviews,
  totalPages,
}: {
  reviews: ReviewWithImageType[];
  totalPages: number;
}) => {
  const [data, setData] = useState<ReviewWithImageType[]>(reviews);
  const [page, setPage] = useState(1);
  const [totalDataPages, setTotalDataPages] = useState<number>(totalPages);

  //Filter
  const [filter, setFilter] = useState<ReviewFilter>("");
  const [period, setPeriod] = useState<ReviewDateFilter>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setPage(1);
  }, [filter, search, period]);

  useEffect(() => {
    const getData = async () => {
      const response = await getUserReviews(filter, page, 10, search, period);
      if (response) {
        setData(response.reviews);
        setTotalDataPages(response.totalPages);
      }
    };
    getData();
  }, [page, filter, search, period]);

  return (
    <div>
      <div className="space-y-4">
        {/* Header */}
        <ReviewsHeader
          filter={filter}
          setFilter={setFilter}
          period={period}
          setPeriod={setPeriod}
          search={search}
          setSearch={setSearch}
        />
        {/* Table */}
        <div className="space-y-2">
          {data.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
      <div className="mt-2">
        <Pagination page={page} totalPages={totalDataPages} setPage={setPage} />
      </div>
    </div>
  );
};

export default ReviewsContainer;
