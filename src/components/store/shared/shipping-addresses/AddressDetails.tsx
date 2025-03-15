"use client";

import { Category, Country } from "@prisma/client";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ShippingAddressSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SelectMenuOption, UserShippingAddressType } from "@/lib/types";
import { Button } from "../../ui/button";
import CountrySelector from "@/components/shared/country-selector";
import { upsertShippingAddress } from "@/queries/user";

interface AddressDetailsProps {
  data?: UserShippingAddressType;
  countries: Country[];
  setShow: Dispatch<SetStateAction<boolean>>;
}

const AddressDetails: FC<AddressDetailsProps> = ({
  data,
  countries,
  setShow,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [country, setCountry] = useState<string>("United Kingdom");

  const form = useForm<z.infer<typeof ShippingAddressSchema>>({
    mode: "onChange",
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: {
      firstName: data?.firstName,
      lastName: data?.lastName,
      phone: data?.phone,
      address1: data?.address1,
      address2: data?.address2 || "",
      city: data?.city,
      state: data?.state,
      zip_code: data?.zip_code,
      countryId: data?.countryId,
      default: data?.default || false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        address2: data.address2 || "",
      });
      handleCountryChange(data?.country.name);
    }
  }, [data, form]);

  const handleSubmit = async (
    values: z.infer<typeof ShippingAddressSchema>
  ) => {
    try {
      const response = await upsertShippingAddress({
        id: data?.id ? data.id : uuidv4(),
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        address1: values.address1,
        address2: values.address2 || "",
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        countryId: values.countryId,
        default: values.default,
        userId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast({
        title: data?.id
          ? "Shipping address updated"
          : `Shipping address has been created`,
      });

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

  const handleCountryChange = (name: string) => {
    const country = countries.find((c) => c.name === name);
    if (country) {
      form.setValue("countryId", country.id);
    }
    setCountry(name);
  };

  console.log(country);
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormLabel>Contact information</FormLabel>
            <div className="flex items-center justify-between gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1 w-[calc(50%-12px)] !mt-4">
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Address</FormLabel>
            <div className="!mt-6 flex items-center justify-between gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address1"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Address line 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Address line 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="!mt-6 flex items-center justify-between gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="!mt-6 flex items-center justify-between gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Zip code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <CountrySelector
                        id="countries"
                        open={isOpen}
                        onToggle={() => setIsOpen((prev) => !prev)}
                        onChange={(value) => handleCountryChange(value)}
                        selectedValue={
                          (countries.find(
                            (c) => c.name === country
                          ) as SelectMenuOption) || countries[0]
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="rounded-md">
            {isLoading ? "Saving..." : data?.id ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddressDetails;
