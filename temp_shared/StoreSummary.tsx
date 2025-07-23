import PaymentStatusTag from "@/components/shared/payment-status";
import {
  AdminStoreType,
  OrderStatus,
  PaymentStatus,
  StoreOrderType,
  UserShippingAddressType,
} from "@/lib/types";
import { cn, getShippingDatesRange } from "@/lib/utils";
import { PaymentDetails } from "@prisma/client";
import { ProductStatus, StoreStatus } from "@/lib/types";
import { FC, useState } from "react";
import OrderStatusSelect from "../forms/OrderStatusSelect";
import Image from "next/image";
import ProductStatusTag from "@/components/shared/product-status";
import ProductStatusSelect from "../forms/ProductStatusSelect";
import StoreStatusSelect from "../forms/StoreStatusSelect";

interface Props {
  store: AdminStoreType;
}

const StoreSummary: FC<Props> = ({ store }) => {
  const [showFullDescription, setShowFullDescription] =
    useState<boolean>(false);
  return (
    <div className="py-2 relative">
      <div className="w-full px-1">
        <div className="space-y-3">
          <h2 className="font-bold text-3xl leading-10 overflow-ellipsis line-clamp-1">
            Store Details
          </h2>
          <h6 className="font-semibold text-2xl leading-9">#{store.id}</h6>
          <div className="flex items-center gap-x-2">
            <StoreStatusSelect
              status={store.status as StoreStatus}
              storeId={store.id}
            />
          </div>
        </div>
        <div className="relative mt-4">
          <Image
            src={store.cover}
            alt={store.name}
            width={1000}
            height={1000}
            className="w-full h-40 object-cover rounded-md"
          />
          <Image
            src={store.logo}
            alt={store.name}
            width={1000}
            height={1000}
            className="w-36 h-36 object-cover rounded-full absolute -bottom-11 left-11 shadow-"
          />
        </div>
        <div className="mt-16 space-y-3">
          <h1 className="text-2xl font-semibold">{store.name}</h1>
          <div>
            <p
              className={cn("text-sm", {
                "line-clamp-4": !showFullDescription,
              })}
            >
              {store.description}
            </p>
            <span
              className="text-sm hover:underline cursor-pointer text-blue-primary"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Show less" : "Show more"}
            </span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 py-4 border-gray-100 mb-6">
          {/*Store details*/}
          <div className="grid grid-cols-2">
            <div>
              <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 ">
                Store email
              </p>
              <h6 className="font-semibold text-lg leading-9">{store.email}</h6>
            </div>
            <div>
              <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 ">
                Store phone
              </p>
              <h6 className="font-semibold text-lg leading-9">{store.phone}</h6>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 ">
                Store url
              </p>
              <h6 className="font-semibold text-lg leading-9">/{store.url}</h6>
            </div>
          </div>
        </div>
        {/* Shipping details table */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold leading-tight text-gray-500">
            Shipping Details
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody>
                <tr className="border-b border-opacity-20 ">
                  <td className="p-3">
                    <p className="font-semibold">Shipping Service</p>
                  </td>
                  <td className="p-3">
                    <p>{store.defaultShippingService || "-"}</p>
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 ">
                  <td className="p-3">
                    <p className="font-semibold">Shipping Fee per item</p>
                  </td>
                  <td className="p-3">
                    <p>${store.defaultShippingFeesPerItem}</p>
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 s">
                  <td className="p-3">
                    <p className="font-semibold">
                      Shipping Fee for additional item
                    </p>
                  </td>
                  <td className="p-3">
                    <p>${store.defaultShippingFeesForAdditionalItem}</p>
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 ">
                  <td className="p-3">
                    <p className="font-semibold">Shipping Fee per kg</p>
                  </td>
                  <td className="p-3">
                    <p>${store.defaultShippingFeePerKg}</p>
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 ">
                  <td className="p-3">
                    <p className="font-semibold">Shipping fee fixed</p>
                  </td>
                  <td className="p-3">
                    <p>${store.defaultShippingFeeFixed}</p>
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 ">
                  <td className="p-3">
                    <p className="font-semibold">Shipping Delivery min days</p>
                  </td>
                  <td className="p-3">
                    <p>{store.defaultDeliveryTimeMin} days</p>
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 ">
                  <td className="p-3">
                    <p className="font-semibold">Shipping Delivery max days</p>
                  </td>
                  <td className="p-3">
                    <p>{store.defaultDeliveryTimeMax} days</p>
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 ">
                  <td className="p-3">
                    <p className="font-semibold">Return policy</p>
                  </td>
                  <td className="p-3">
                    <p>{store.returnPolicy || "-"} </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSummary;
