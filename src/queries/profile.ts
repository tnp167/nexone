"use server";

import { db } from "@/lib/db";
import {
  OrderStatus,
  OrderTableFilter,
  PaymentStatus,
  OrderTableDateFilter,
  PaymentTableFilter,
  PaymentTableDateFilter,
  ReviewFilter,
  ReviewDateFilter,
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

/**
 * @name getUserReviews
 * @description - Retrieves paginated reviews for the authenticated user, with optional filters for rating and search functionality.
 * @access User
 * @param filter - A string to filter reviews by rating (e.g., "5", "4", "3", "2", "1").
 * * @param period - A string to filter reviews by creation date:
 *   - "" (no filter)
 *   - "last-6-months"
 *   - "last-1-year"
 *   - "last-2-years".
 * @param search - A string to search within the review text.
 * @param page - The page number for pagination (default: 1).
 * @param pageSize - The number of records to return per page (default: 10).
 * @returns A Promise resolving to an object containing:
 *   - `reviews`: An array of review details.
 *   - `totalPages`: The total number of pages available.
 *   - `currentPage`: The current page number.
 *   - `pageSize`: The number of records per page.
 *   - `totalCount`: The total number of review records matching the query.
 */

export const getUserReviews = async (
  filter: ReviewFilter = "",
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  period: ReviewDateFilter = ""
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

  if (filter) whereClause.AND.push({ rating: parseFloat(filter) });

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
      review: {
        contains: search,
      },
    });
  }

  //Fetch payments for the current page
  const reviews = await db.review.findMany({
    where: whereClause,
    include: {
      images: true,
      user: true,
    },
    skip,
    take: pageSize,
    orderBy: {
      updatedAt: "desc",
    },
  });

  const totalCount = await db.review.count({ where: whereClause });

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    reviews,
    totalPages,
    totalCount,
  };
};

/**
 * @name getUserWishlist
 * @description - Retrieves paginated wishlist items for the authenticated user.
 * @access User
 * @param page - The page number for pagination (default: 1).
 * @param pageSize - The number of records to return per page (default: 10).
 * @returns A Promise resolving to an object containing:
 *   - `wishlist`: An array of wishlist items formatted with product details.
 *   - `totalPages`: The total number of pages available.
 */
export const getUserWishlist = async (
  page: number = 1,
  pageSize: number = 2
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const skip = (page - 1) * pageSize;

  //Fetch wishlist items for the current page
  const wishlist = await db.wishlist.findMany({
    where: {
      userId: user.id,
    },
    include: {
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          rating: true,
          sales: true,
          variants: {
            select: {
              id: true,
              slug: true,
              variantName: true,
              images: true,
              sizes: true,
            },
          },
        },
      },
    },
    take: pageSize,
    skip,
  });

  const formattedWishlist = wishlist.map((item) => ({
    id: item.product.id,
    slug: item.product.slug,
    name: item.product.name,
    rating: item.product.rating,
    sales: item.product.sales,
    variants: [
      {
        variantId: item.product.variants[0].id,
        variantSlug: item.product.variants[0].slug,
        variantName: item.product.variants[0].variantName,
        images: item.product.variants[0].images,
        sizes: item.product.variants[0].sizes,
      },
    ],
    variantImages: [],
  }));

  //Fetch the total count of wishlist items for the query
  const totalCount = await db.wishlist.count({
    where: {
      userId: user.id,
    },
  });

  //Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    wishlist: formattedWishlist,
    totalPages,
  };
};
