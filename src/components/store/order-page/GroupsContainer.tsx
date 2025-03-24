import { OrderGroupWithItemsType } from "@/lib/types";
import { getShippingDatesRange } from "@/lib/utils";
import React from "react";
import OrderGroupTable from "./GroupTable";
const OrderGroupsContainer = ({
  groups,
}: {
  groups: OrderGroupWithItemsType[];
}) => {
  const deliveryDetails = groups.map((group) => {
    const { minDate, maxDate } = getShippingDatesRange(
      group.shippingDeliveryMin,
      group.shippingDeliveryMax,
      group.createdAt
    );

    return {
      shippingService: group.shippingService,
      deliveryMinDate: minDate,
      deliveryMaxDate: maxDate,
    };
  });
  return (
    <div>
      <section className="p-2 relative">
        <div className="w-full space-y-4">
          {groups.map((group, idx) => {
            const deliveryInfo = deliveryDetails[idx];
            return (
              <OrderGroupTable
                key={group.id}
                group={group}
                deliveryInfo={deliveryInfo}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default OrderGroupsContainer;
