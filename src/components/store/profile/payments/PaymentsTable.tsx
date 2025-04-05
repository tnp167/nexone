"use client";

import {
  PaymentTableDateFilter,
  PaymentTableFilter,
  UserPaymentType,
} from "@/lib/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/store/shared/Pagination";
import { getUserPayments } from "@/queries/profile";
import PaymentTableHeader from "./PaymentTableHeader";
const PaymentsTable = ({
  payments,
  totalPages,
}: {
  payments: UserPaymentType[];
  totalPages: number;
}) => {
  const [data, setData] = useState<UserPaymentType[]>(payments);
  const [page, setPage] = useState(1);
  const [totalDataPages, setTotalDataPages] = useState<number>(totalPages);

  //Filter
  const [filter, setFilter] = useState<PaymentTableFilter>("");
  const [period, setPeriod] = useState<PaymentTableDateFilter>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setPage(1);
  }, [filter, search, period]);

  useEffect(() => {
    const getData = async () => {
      const response = await getUserPayments(filter, page, 10, search, period);
      if (response) {
        setData(response.payments);
        setTotalDataPages(response.totalPages);
      }
    };
    getData();
  }, [page, filter, search, period]);

  return (
    <div>
      <div className="space-y-4">
        {/* Header */}
        <PaymentTableHeader
          filter={filter}
          setFilter={setFilter}
          period={period}
          setPeriod={setPeriod}
          search={search}
          setSearch={setSearch}
        />
        {/* Table */}
        <div className="overflow-hidden">
          <div className="bg-white px-6 py-1">
            <div className="max-h-[700px] overflow-x-auto overflow-y-auto border rounded-md scrollbar">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Payment
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Intent ID
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Type
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Amount
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Status
                    </th>
                    <th className="cursor-pointer text-sm border-y p-4">
                      Order
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((payment) => {
                    return (
                      <tr key={payment.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p className="block antialiased text-sm leading-normal font-normal">
                                #{payment.id}
                              </p>
                              <p className="block antialiased text-sm leading-normal font-normal">
                                Last updated:
                                {payment.updatedAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{payment.paymentIntentId}</td>
                        <td>{payment.paymentMethod}</td>
                        <td>£{payment.amount.toFixed(2)}</td>
                        <td>{payment.status}</td>
                        <td className="p-4">
                          <Link href={`/order/${payment.orderId}`}>
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
      <Pagination page={page} totalPages={totalDataPages} setPage={setPage} />
    </div>
  );
};

export default PaymentsTable;
