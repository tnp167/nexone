"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
// Function: createPayPalPayment
// Description: Creates a PayPal payment and return payment details.
// Permission Level: User only
// Parameters:
//   - orderId: The ID of the order to process payment for.
// Returns: Details of the created payment from paypal.

export const createPayPalPayment = async (orderId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not found");
    }

    //Fetch the order to get total price
    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const response = await fetch(
      "https://api.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "GBP",
                value: order.total.toFixed(2).toString(),
              },
            },
          ],
        }),
      }
    );
    const paymentData = await response.json();
    return paymentData;
  } catch (error) {
    console.error("Error creating PayPal payment:", error);
    throw new Error("Failed to create PayPal payment");
  }
};

// Function: capturePayPalPayment
// Description: Captures a PayPal payment and updates the order status in the database.
// Permission Level: User only
// Parameters:
//   - orderId: The ID of the order to update.
//   - paymentId: The PayPal payment ID to capture.
// Returns: Updated order details.
export const capturePaypalPayment = async (
  orderId: string,
  paymentId: string
) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not found");
    }

    //Capture the payment
    const captureResponse = await fetch(
      `https://api.sandbox.paypal.com/v2/checkout/orders/${paymentId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    const captureData = await captureResponse.json();

    if (captureData.status !== "COMPLETED") {
      return await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          paymentStatus: "Failed",
        },
      });
    }

    //Update payment details record
    const newPaymentDetails = await db.paymentDetails.upsert({
      where: {
        id: orderId,
      },
      update: {
        paymentIntentId: paymentId,
        status: captureData.status === "COMPLETED" ? "success" : "failed",
        amount: Number(
          captureData.purchase_units[0].payments.captures[0].amount.value
        ),
        currency:
          captureData.purchase_units[0].payments.captures[0].amount
            .currency_code,
        paymentMethod: "PayPal",
        userId: user.id,
      },
      create: {
        paymentIntentId: paymentId,
        status: captureData.status === "COMPLETED" ? "success" : "failed",
        amount: Number(
          captureData.purchase_units[0].payments.captures[0].amount.value
        ),
        currency:
          captureData.purchase_units[0].payments.captures[0].amount
            .currency_code,
        paymentMethod: "PayPal",
        userId: user.id,
        orderId: orderId,
      },
    });

    // Update payment details record
    const updatedOrder = await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: captureData.status === "COMPLETED" ? "Paid" : "Failed",
        paymentMethod: "PayPal",
        paymentDetails: {
          connect: {
            id: newPaymentDetails.id,
          },
        },
      },
      include: {
        paymentDetails: true,
      },
    });

    return updatedOrder;
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    throw new Error("Failed to capture PayPal payment");
  }
};
