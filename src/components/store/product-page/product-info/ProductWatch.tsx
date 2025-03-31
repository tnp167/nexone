"use client";
import { Eye } from "lucide-react";
import React, { useEffect, useState } from "react";

const ProductWatch = ({ productId }: { productId: string }) => {
  const [watcherCount, setWatcherCount] = useState<number>(0);

  useEffect(() => {
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WATCHERS_SERVER}/${productId}`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (productId === data.productId) {
        setWatcherCount(data.count);
      }
    };

    ws.onopen = () => {
      console.log("Connected to watchers server");
    };

    return () => {
      ws.close();
    };
  }, [productId]);

  if (watcherCount > 0)
    return (
      <div className="mb-2 text-sm">
        <span className="flex items-center gap-x-1">
          <Eye className="w-5 text-main-secondary" />
          <span>
            {watcherCount} {watcherCount > 1 ? "People are" : "Person is"}{" "}
            watching this product
          </span>
        </span>
      </div>
    );
};

export default ProductWatch;
