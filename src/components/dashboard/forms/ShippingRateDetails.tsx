"use client";

import { FC, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ShippingRateFormSchema } from "@/lib/schemas";
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
import { CountryWithShippingRatesType } from "@/lib/types";
import { NumberInput } from "@tremor/react";
import { Textarea } from "@/components/ui/textarea";
import { upsertStoreShippingRate } from "@/queries/store";

interface ShippingRateDetailsProps {
  data?: CountryWithShippingRatesType;
  storeUrl: string;
}

const ShippingRateDetails: FC<ShippingRateDetailsProps> = ({
  data,
  storeUrl,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof ShippingRateFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ShippingRateFormSchema),
    defaultValues: {
      countryId: data?.countryId,
      countryName: data?.countryName,
      shippingService: data?.shippingRate?.shippingService || "",
      shippingFeePerItem: data?.shippingRate?.shippingFeePerItem,
      shippingFeeForAdditionalItem:
        data?.shippingRate?.shippingFeeForAdditionalItem,
      shippingFeePerKg: data?.shippingRate?.shippingFeePerKg,
      shippingFeeFixed: data?.shippingRate?.shippingFeeFixed,
      deliveryTimeMin: data?.shippingRate?.deliveryTimeMin,
      deliveryTimeMax: data?.shippingRate?.deliveryTimeMax,
      returnPolicy: data?.shippingRate?.returnPolicy || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const handleSubmit = async (
    values: z.infer<typeof ShippingRateFormSchema>
  ) => {
    try {
      const response = await upsertStoreShippingRate(storeUrl, {
        id: data?.shippingRate ? data.shippingRate.id : uuidv4(),
        countryId: data?.countryId ? data.countryId : "",
        shippingService: values.shippingService,
        shippingFeePerItem: values.shippingFeePerItem,
        shippingFeeForAdditionalItem: values.shippingFeeForAdditionalItem,
        shippingFeePerKg: values.shippingFeePerKg,
        shippingFeeFixed: values.shippingFeeFixed,
        deliveryTimeMin: values.deliveryTimeMin,
        deliveryTimeMax: values.deliveryTimeMax,
        returnPolicy: values.returnPolicy,
        storeId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (response.id) {
        toast({
          title: "Shipping rate updated",
        });
      }

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
          <CardTitle>Shipping Rate</CardTitle>
          <CardDescription>
            Update shipping rate information for{" "}
            {data?.countryName || "this country"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="hidden">
                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="countryName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingService"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Service</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingFeePerItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee per Item</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onValueChange={field.onChange}
                          step={0.01}
                          min={0}
                          className="!shadow-none rounded-md pl-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingFeeForAdditionalItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee for Additional Item</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onValueChange={field.onChange}
                          step={0.01}
                          min={0}
                          className="!shadow-none rounded-md pl-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingFeePerKg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee per Kg</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onValueChange={field.onChange}
                          step={0.01}
                          min={0}
                          className="!shadow-none rounded-md pl-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingFeeFixed"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Fixed Shipping Fee</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onValueChange={field.onChange}
                          step={0.01}
                          min={0}
                          className="!shadow-none rounded-md pl-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryTimeMin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimum Delivery Time (days)</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onValueChange={field.onChange}
                          step={1}
                          min={1}
                          className="!shadow-none rounded-md pl-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryTimeMax"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Maximum Delivery Time (days)</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onValueChange={field.onChange}
                          step={1}
                          min={2}
                          className="!shadow-none rounded-md pl-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ShippingRateDetails;
