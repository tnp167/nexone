"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { PaymentIntent } from "@stripe/stripe-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export const createStripePaymentIntent = async (orderId: string) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not found");

    //Fetch the order to get total price
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: "gbp",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create Stripe payment intent");
  }
};

export const creataStripePayment = async (
  paymentIntent: PaymentIntent,
  orderId: string
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not found");

    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    const updatePaymentDetails = await db.paymentDetails.upsert({
      where: {
        orderId,
      },
      update: {
        paymentIntentId: paymentIntent.id,
        paymentMethod: "Stripe",
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        userId: user.id,
        status:
          paymentIntent.status === "succeeded"
            ? "Completed"
            : paymentIntent.status,
      },
      create: {
        userId: user.id,
        orderId,
        paymentIntentId: paymentIntent.id,
        paymentMethod: "Stripe",
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status:
          paymentIntent.status === "succeeded"
            ? "Completed"
            : paymentIntent.status,
      },
    });

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: paymentIntent.status === "succeeded" ? "Paid" : "Failed",
        paymentMethod: "Stripe",
        paymentDetails: {
          connect: {
            id: updatePaymentDetails.id,
          },
        },
      },
      include: {
        paymentDetails: true,
      },
    });

    return updatedOrder;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create Stripe payment");
  }
};
