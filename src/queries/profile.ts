"use server";

import { db } from "@/lib/db";
import { OrderStatus, OrderTableFilter, PaymentStatus } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { subMonths } from "date-fns";

// Function: getUserOrders
// Description: Retrieves user orders, with populated groups and items,
//              item count, and shipping address.
// Parameters:
//   - filter: String to filter orders by.
//   - page: The current page number for pagination (default = 1).
//   - pageSize: The number of products per page (default = 10).
//   - search: the string to search by.
//   - period: The period of orders u wanna get.
// Returns: Array containing user orders with groups sorted by totalPrice in descending order.
export const getUserOrders = async (
  filter: OrderTableFilter = "",
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  period: string = ""
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const skip = (page - 1) * pageSize;

  const whereClause: any = {
    AND: [
      {
        userId: user.id,
      },
    ],
  };

  if (filter === "unpaid")
    whereClause.AND.push({ paymentStatus: PaymentStatus.Pending });
  if (filter === "toShip")
    whereClause.AND.push({ orderStatus: OrderStatus.Processing });
  if (filter === "shipped")
    whereClause.AND.push({ orderStatus: OrderStatus.Shipped });
  if (filter === "delivered")
    whereClause.AND.push({ orderStatus: OrderStatus.Delivered });

  const now = new Date();
  if (period === "last-6-month") {
    whereClause.AND.push({
      createdAt: {
        gte: subMonths(now, 6),
      },
    });
  } else if (period === "last-1-year") {
    whereClause.AND.push({
      createdAt: {
        gte: subMonths(now, 12),
      },
    });
  } else if (period === "last-2-years") {
    whereClause.AND.push({
      createdAt: {
        gte: subMonths(now, 24),
      },
    });
  }

  //Apply search filter
  if (search.trim()) {
    whereClause.AND.push({
      OR: [
        {
          id: { contains: search }, //Search by order id
        },
        {
          groups: {
            some: {
              store: {
                name: {
                  contains: search,
                },
              },
            },
          },
        },
        {
          groups: {
            some: {
              items: {
                some: {
                  name: {
                    contains: search,
                  },
                },
              },
            },
          },
        },
      ],
    });
  }

  const orders = await db.order.findMany({
    where: whereClause,
    include: {
      groups: {
        include: {
          items: true,
          _count: {
            select: {
              items: true,
            },
          },
        },
      },
      shippingAddress: {
        include: {
          country: true,
        },
      },
    },
    skip, //Skip the orders
    take: pageSize, //limit page size
  });

  const totalCount = await db.order.count({ where: whereClause });

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    orders,
    totalPages,
    totalCount,
  };
};
