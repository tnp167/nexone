"use client";

import { FC, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { CouponFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { upsertCategory } from "@/queries/category";
import { format } from "date-fns";
import { Coupon } from "@prisma/client";
import { NumberInput } from "@tremor/react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

interface CouponDetailsProps {
  data?: Coupon;
}

const CouponDetails: FC<CouponDetailsProps> = ({ data }) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof CouponFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CouponFormSchema),
    defaultValues: {
      code: data?.code || "",
      startDate: data?.startDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      endDate: data?.endDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      discount: data?.discount || 0,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const handleSubmit = async (values: z.infer<typeof CouponFormSchema>) => {
    try {
      const response = await upsertCategory({
        id: data?.id ? data.id : uuidv4(),
        name: values.name,
        image: values.image[0].url,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast({
        title: data?.id
          ? "Category updated"
          : `Category ${response?.name} has been created`,
      });

      if (data?.id) {
        router.refresh();
      } else {
        router.push(`/dashboard/admin/categories`);
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create category",
      });
    }
  };
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Coupon Details</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.code} coupon information`
              : "Create a new coupon"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Coupon code</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Coupon Discount</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="%"
                        min={1}
                        className="!shadow-none rounded-md !text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        onChange={(date) => {
                          field.onChange(
                            date ? format(date, "yyyy-MM-dd'T'HH:mm:ss") : ""
                          );
                        }}
                        value={field.value ? new Date(field.value) : null}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        onChange={(date) => {
                          field.onChange(
                            date ? format(date, "yyyy-MM-dd'T'HH:mm:ss") : ""
                          );
                        }}
                        value={field.value ? new Date(field.value) : null}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : data?.id ? "Update" : "Create"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CouponDetails;
