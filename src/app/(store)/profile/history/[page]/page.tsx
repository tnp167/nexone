"use client";
import Pagination from "@/components/store/shared/Pagination";
import ProductList from "@/components/store/shared/ProductList";
import { getProductsByIds } from "@/queries/product";
import React, { useEffect, useState } from "react";

const ProfileHistoryPage = async ({
  params,
}: {
  params: Promise<{ page: string }>;
}) => {
  const { page } = await params;
  const [products, setProducts] = useState<any>([]);
  const [currentPage, setPage] = useState<number>(Number(page) || 1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const historyString = localStorage.getItem("productHistory") || "[]";

      if (!historyString) {
        setProducts([]);
        return;
      }

      try {
        setLoading(true);
        const parsedHistory = JSON.parse(historyString);

        const response = await getProductsByIds(parsedHistory, currentPage);
        setProducts(response.products);
        setTotalPages(response.totalPages);
        setLoading(false);
        console.log(response);
      } catch (error) {
        console.error("Error fetching product history", error);
        setProducts([]);
        setLoading(false);
      }
    };
    setLoading(false);
    fetchHistory();
  }, [currentPage]);
  return (
    <div className="bg-white py-4 px-6">
      <h1 className="text-lg mb-3 font-bold">Your product view history</h1>
      {loading ? (
        <div>loading...</div>
      ) : products.length > 0 ? (
        <div className="pb-16">
          <ProductList products={products} />
          <div className="mt-2">
            <Pagination
              page={currentPage}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      ) : (
        <div>No products</div>
      )}
    </div>
  );
};

export default ProfileHistoryPage;
