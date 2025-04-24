"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { OrderStatus, ProductStatus } from "@/lib/types";

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

/**
 * @name updateOrderGroupStatus
 * @description - Updates the status of a specified order group.
 *              - Throws an error if the user is not authenticated or lacks seller privileges.
 * @access User
 * @param storeId - The store id of the seller to verify ownership.
 * @param groupId - The ID of the order group whose status is to be updated.
 * @param status - The new status to be set for the order.
 * @returns {Object} - Updated order status.
 */

export const updateOrderGroupStatus = async (
  storeId: string,
  groupId: string,
  status: OrderStatus
) => {
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  //Verify seller permission
  if (user.privateMetadata.role !== "SELLER")
    throw new Error("Seller permission required");

  //Verify store ownership
  const store = await db.store.findUnique({
    where: {
      id: storeId,
      userId: user.id,
    },
  });
  if (!store) throw new Error("Store not found");

  //Retrieve the order to be updated
  const order = await db.orderGroup.findUnique({
    where: {
      id: groupId,
      storeId: storeId,
    },
  });

  if (!order) throw new Error("Order not found");

  //Update order group status
  const updatedOrder = await db.orderGroup.update({
    where: {
      id: groupId,
    },
    data: {
      status,
    },
  });

  return updatedOrder.status;
};

export const updateOrderItemStatus = async (
  storeId: string,
  orderItemId: string,
  status: ProductStatus
) => {
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  //Verify seller permission
  if (user.privateMetadata.role !== "SELLER")
    throw new Error("Seller permission required");

  //Verify store ownership
  const store = await db.store.findUnique({
    where: {
      id: storeId,
      userId: user.id,
    },
  });
  if (!store) throw new Error("Store not found");

  //Retrieve the product item to be updated
  const product = await db.orderItem.findUnique({
    where: {
      id: orderItemId,
    },
  });

  if (!product) throw new Error("Order item not found");

  //Update order item status
  const updatedProduct = await db.orderItem.update({
    where: {
      id: orderItemId,
    },
    data: {
      status,
    },
  });

  return updatedProduct.status;
};
