"use server";

import { db } from "@/lib/db";
import {
  OrderStatus,
  OrderTableFilter,
  PaymentStatus,
  OrderTableDateFilter,
  PaymentTableFilter,
  PaymentTableDateFilter,
} from "@/lib/types";
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
  period: OrderTableDateFilter = ""
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
  if (period === "last-6-months") {
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

/**
 * @name getUserPayments
 * @description - Retrieves paginated payment details for the authenticated user, with optional filters and search functionality.
 * @access User
 * @param filter - A string to filter payments by method (e.g., "paypal", "credit-card").
 * @param period - A string representing the time range for payments (e.g., "last-6-months").
 * @param search - A string to search within payment details (e.g., paymentMethod or currency).
 * @param page - The page number for pagination (default: 1).
 * @param pageSize - The number of records to return per page (default: 10).
 * @returns A Promise resolving to an object containing:
 *   - `payments`: An array of payment details.
 *   - `totalPages`: The total number of pages available.
 *   - `currentPage`: The current page number.
 *   - `pageSize`: The number of records per page.
 *   - `totalCount`: The total number of payment records matching the query.
 */

export const getUserPayments = async (
  filter: PaymentTableFilter = "",
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  period: PaymentTableDateFilter = ""
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

  if (filter === "paypal") whereClause.AND.push({ paymentMethod: "Paypal" });
  if (filter === "credit-card")
    whereClause.AND.push({ paymentMethod: "Stripe" });

  const now = new Date();
  if (period === "last-6-months") {
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
          paymentIntentId: { contains: search }, //Search by Payment Intenet ID
        },
      ],
    });
  }

  //Fetch payments for the current page
  const payments = await db.paymentDetails.findMany({
    where: whereClause,
    include: {
      order: true,
    },
    skip,
    take: pageSize,
    orderBy: {
      updatedAt: "desc",
    },
  });

  const totalCount = await db.paymentDetails.count({ where: whereClause });

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    payments,
    totalPages,
    totalCount,
  };
};
