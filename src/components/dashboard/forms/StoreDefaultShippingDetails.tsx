"use client";

import { Category } from "@prisma/client";
import { FC, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { StoreShippingFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { NumberInput } from "@tremor/react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { StoreDefaultShippingDetailsType } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { updateStoreDefaultShippingDetails } from "@/queries/store";

interface StoreDefaultShippingDetailsProps {
  data?: StoreDefaultShippingDetailsType;
  storeUrl: string;
}

const StoreDefaultShippingDetails: FC<StoreDefaultShippingDetailsProps> = ({
  data,
  storeUrl,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof StoreShippingFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreShippingFormSchema),
    defaultValues: {
      defaultShippingService:
        data?.defaultShippingService || "International Delivery",
      defaultShippingFeesPerItem: data?.defaultShippingFeesPerItem || 0,
      defaultShippingFeesForAdditionalItem:
        data?.defaultShippingFeesForAdditionalItem || 0,
      defaultShippingFeePerKg: data?.defaultShippingFeePerKg || 0,
      defaultShippingFeeFixed: data?.defaultShippingFeeFixed || 0,
      defaultDeliveryTimeMin: data?.defaultDeliveryTimeMin || 7,
      defaultDeliveryTimeMax: data?.defaultDeliveryTimeMax || 31,
      returnPolicy: data?.returnPolicy || "Returns within 30 days of purchase.",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        image: data.image ? [{ url: data.image }] : [],
        url: data.url || "",
        featured: data.featured || false,
      });
    }
  }, [data, form]);

  const handleSubmit = async (
    values: z.infer<typeof StoreShippingFormSchema>
  ) => {
    try {
      const response = await updateStoreDefaultShippingDetails(storeUrl, {
        defaultShippingService: values.defaultShippingService,
        defaultShippingFeesPerItem: values.defaultShippingFeesPerItem,
        defaultShippingFeesForAdditionalItem:
          values.defaultShippingFeesForAdditionalItem,
        defaultShippingFeePerKg: values.defaultShippingFeePerKg,
        defaultShippingFeeFixed: values.defaultShippingFeeFixed,
        defaultDeliveryTimeMin: values.defaultDeliveryTimeMin,
        defaultDeliveryTimeMax: values.defaultDeliveryTimeMax,
        returnPolicy: values.returnPolicy,
      });

      if (response.id) {
        toast({
          title: "Shipping details has been updated",
        });
      }

      //Refresh data
      router.refresh();
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
          <CardTitle>Store Default Shipping Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="defaultShippingService"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Shipping Service name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="defaultShippingFeesPerItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee per item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={1}
                          step={0.01}
                          className="!shadow-none rounded-md pl-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultShippingFeesForAdditionalItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee for additional item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={0}
                          step={0.01}
                          className="!shadow-none rounded-md pl-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="defaultShippingFeePerKg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee per kg</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={1}
                          step={0.01}
                          className="!shadow-none rounded-md pl-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultShippingFeeFixed"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Fixed shipping fee</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={0}
                          step={0.01}
                          className="!shadow-none rounded-md pl-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="defaultDeliveryTimeMin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimum delivery time</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={1}
                          step={0.01}
                          className="!shadow-none rounded-md pl-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultDeliveryTimeMax"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Maximum delivery time (days)</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={2}
                          className="!shadow-none rounded-md pl-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="returnPolicy"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Return Policy</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter return policy"
                        className="p-4"
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

export default StoreDefaultShippingDetails;
