"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Function: getOrder
// Description: Retrieves a specific order by its ID and the current user's ID, including associated groups, items, store information,
//              item count, and shipping address.
// Parameters:
//   - params: orderId.
// Returns: Object containing order details with groups sorted by totalPrice in descending order.

export const getOrder = async (orderId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  //Get order details
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      groups: {
        include: {
          items: true,
          store: true,
          coupon: true,
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          total: "desc",
        },
      },
      shippingAddress: {
        include: {
          country: true,
          user: true,
        },
      },
      paymentDetails: true,
    },
  });

  return order;
};
