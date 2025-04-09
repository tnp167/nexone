"use client";

import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import Pagination from "../../shared/Pagination";
import StoreCard from "../../cards/StoreCard";

interface Props {
  stores: {
    id: string;
    url: string;
    name: string;
    logo: string;
    followersCount: number;
    isUserFollowingStore: boolean;
  }[];
  page: number;
  totalPages: number;
}

const FollowingContainer: FC<Props> = ({ stores, page, totalPages }) => {
  const router = useRouter();
  const [currentPage, setPage] = useState<number>(1);

  useEffect(() => {
    if (currentPage !== page) {
      router.push(`/profile/following/${currentPage}`);
    }
  }, [currentPage, page]);

  return (
    <div>
      <div className="flex flex-wrap pb-16">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default FollowingContainer;
