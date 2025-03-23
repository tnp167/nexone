import React from "react";
import { CartWithCartItemsType } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { ApplyCouponSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { applyCoupon } from "@/queries/coupon";

const ApplyCouponForm = ({
  cartId,
  setCartData,
}: {
  cartId: string;
  setCartData: Dispatch<SetStateAction<CartWithCartItemsType>>;
}) => {
  const form = useForm<z.infer<typeof ApplyCouponSchema>>({
    mode: "onChange",
    resolver: zodResolver(ApplyCouponSchema),
    defaultValues: {
      coupon: "",
    },
  });

  const { errors, isSubmitting } = form.formState;

  const handleSubmit = async (data: z.infer<typeof ApplyCouponSchema>) => {
    try {
      const response = await applyCoupon(data.coupon, cartId);
      setCartData(response.cart);
      toast.success(response.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.toString());
    }
  };

  return (
    <div className="rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="relative bg-gray-100 rounded-2xl shadow-sm p-1.5 hover:shadow-md">
            <FormField
              control={form.control}
              name="coupon"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="text"
                      className="w-full pl-8 pr-24 py-3 text-base text-main-primary bg-transparent rounded-lg focus:outline-none"
                      placeholder="Coupon"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              variant="outline"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 w-20 rounded-2xl"
            >
              Apply
            </Button>
          </div>
          <div className="mt-3">
            {errors.coupon && (
              <FormMessage className="text-xs">
                {errors.coupon.message}
              </FormMessage>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
export default ApplyCouponForm;
