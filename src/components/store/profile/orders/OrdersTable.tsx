"use client";

import OrderStatusTag from "@/components/shared/order-status";
import PaymentStatusTag from "@/components/shared/payment-status";
import {
  OrderStatus,
  OrderTableDateFilter,
  OrderTableFilter,
  PaymentStatus,
  UserOrderType,
} from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/store/shared/Pagination";
import { getUserOrders } from "@/queries/profile";
import OrderTableHeader from "./OrderTableHeader";
const OrdersTable = ({
  orders,
  totalPages,
}: {
  orders: UserOrderType[];
  totalPages: number;
}) => {
  const [data, setData] = useState<UserOrderType[]>(orders);
  const [page, setPage] = useState(1);
  const [totalDataPages, setTotalDataPages] = useState<number>(totalPages);

  //Filter
  const [filter, setFilter] = useState<OrderTableFilter>("");
  const [period, setPeriod] = useState<OrderTableDateFilter>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      const response = await getUserOrders(filter, page, 10, "", "");
      if (response) {
        setData(response.orders);
        setTotalDataPages(response.totalPages);
      }
    };
    getData();
  }, [page, filter]);

  return (
    <div>
      <div className="space-y-4">
        {/* Header */}
        <OrderTableHeader
          filter={filter}
          setFilter={setFilter}
          period={period}
          setPeriod={setPeriod}
          search={search}
          setSearch={setSearch}
        />
        {/* Table */}
        <div className="overflow-hidden">
          <div className="bg-white p-6">
            <div className="max-h-[700px] overflow-x-auto overflow-y-auto border rounded-md scrollbar">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Order
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Products
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Items
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Payment
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Delivery
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Total
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((order) => {
                    const totalItemsCount = order.groups.reduce(
                      (acc, group) => acc + group._count.items,
                      0
                    );
                    const images = Array.from(
                      order.groups.flatMap((g) => g.items.map((p) => p.image))
                    );
                    return (
                      <tr key={order.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p className="block antialiased text-sm leading-normal font-normal">
                                #{order.id}
                              </p>
                              <p className="block antialiased text-sm leading-normal font-normal">
                                Placed on:{order.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex">
                            {images.slice(0, 5).map((image, index) => (
                              <Image
                                key={index}
                                alt="product image"
                                src={image}
                                width={40}
                                height={40}
                                className="size-8 object-cover shadow-md rounded-full"
                                style={{
                                  transform: `translateX(-${index * 5}px)`,
                                }}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="p-4">{totalItemsCount} items</td>
                        <td className="p-4 text-center">
                          <PaymentStatusTag
                            status={order.paymentStatus as PaymentStatus}
                            isTable
                          />
                        </td>
                        <td className="p-4">
                          <OrderStatusTag
                            status={order.orderStatus as OrderStatus}
                          />
                        </td>
                        <td className="p-4">£{order.total.toFixed(2)}</td>
                        <td className="p-4">
                          <Link href={`/order/${order.id}`}>
                            <span className="text-xs text-blue-primary cursor-pointer">
                              View
                            </span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default OrdersTable;
