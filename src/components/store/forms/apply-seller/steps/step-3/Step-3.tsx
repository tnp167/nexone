import { StoreShippingSchema } from "@/lib/schemas";
import { StoreType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import AnimatedContainer from "../../AnimtedContainer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/dashboard/shared/ImageUpload";
import Input from "@/components/store/ui/input";
import { Textarea } from "@/components/store/ui/textarea";
import { applySeller } from "@/queries/store";
import { toast } from "sonner";

interface FormData {
  defaultShippingService: string;
  defaultShippingFeesPerItem: number;
  defaultShippingFeePerKg: number;
  defaultShippingFeesForAdditionalItem: number;
  defaultShippingFeeFixed: number;
  defaultDeliveryTimeMin: number;
  defaultDeliveryTimeMax: number;
  returnPolicy: string;
}
const Step3 = ({
  step,
  setStep,
  formData,
  setFormData,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  formData: StoreType;
  setFormData: Dispatch<SetStateAction<StoreType>>;
}) => {
  const form = useForm<z.infer<typeof StoreShippingSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreShippingSchema),
    defaultValues: {
      defaultShippingService: formData.defaultShippingService,
      defaultShippingFeesPerItem: formData.defaultShippingFeesPerItem,
      defaultShippingFeePerKg: formData.defaultShippingFeePerKg,
      defaultShippingFeesForAdditionalItem:
        formData.defaultShippingFeesForAdditionalItem,
      defaultShippingFeeFixed: formData.defaultShippingFeeFixed,
      defaultDeliveryTimeMin: formData.defaultDeliveryTimeMin,
      defaultDeliveryTimeMax: formData.defaultDeliveryTimeMax,
      returnPolicy: formData.returnPolicy,
    },
  });

  const handleSubmit = async (values: z.infer<typeof StoreShippingSchema>) => {
    try {
      const response = await applySeller({
        name: formData.name,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        logo: formData.logo,
        cover: formData.cover,
        url: formData.url,
        defaultShippingService: values.defaultShippingService,
        defaultShippingFeesPerItem: values.defaultShippingFeesPerItem,
        defaultShippingFeePerKg: values.defaultShippingFeePerKg,
        defaultShippingFeesForAdditionalItem:
          values.defaultShippingFeesForAdditionalItem,
        defaultShippingFeeFixed: values.defaultShippingFeeFixed,
        defaultDeliveryTimeMin: values.defaultDeliveryTimeMin || 7,
        defaultDeliveryTimeMax: values.defaultDeliveryTimeMax || 31,
        returnPolicy: values.returnPolicy,
      });
      if (response.id) {
        setStep((prev) => prev + 1);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message.toString());
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === "number" ? (value === "" ? undefined : Number(value)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
    form.setValue(name as keyof FormData, parsedValue);
  };
  return (
    <div className="h-full">
      <AnimatedContainer>
        <div className="pl-1 text-gray-600 mt-2 mb-4">
          <p className="font-medium">
            Fill out your store&apos;s default shipping details (this is
            optional).
          </p>
          <ul className="list-disc text-sm ml-4 mt-2">
            <li>Any fields left empty will default to our pre-set values.</li>
            <li>
              Do not worry, you can update your details anytime from your seller
              dashboard.
            </li>
            <li>
              You will also be able to customize shipping details for each
              country later on.
            </li>
          </ul>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Form items */}
            <div className="space-y-4">
              {/* Shipping Service */}
              <FormField
                control={form.control}
                name="defaultShippingService"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Shipping Service"
                        value={field.value}
                        type="text"
                        name="defaultShippingService"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shipping Fee per Item */}
              <FormField
                control={form.control}
                name="defaultShippingFeesPerItem"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Shipping Fee per item"
                        name="defaultShippingFeesPerItem"
                        type="number"
                        value={field.value}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shipping Fee per Kg */}
              <FormField
                control={form.control}
                name="defaultShippingFeePerKg"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Shipping Fee per Kg"
                        name="defaultShippingFeePerKg"
                        type="number"
                        value={field.value}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shipping Fee for Additional Item */}
              <FormField
                control={form.control}
                name="defaultShippingFeesForAdditionalItem"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Shipping Fee for Additional Item"
                        name="defaultShippingFeesForAdditionalItem"
                        type="number"
                        value={Number(field.value)}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fixed Shipping Fee */}
              <FormField
                control={form.control}
                name="defaultShippingFeeFixed"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Fixed Shipping Fee"
                        name="defaultShippingFeeFixed"
                        type="number"
                        value={Number(field.value)}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Delivery Time Min */}
              <FormField
                control={form.control}
                name="defaultDeliveryTimeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Min Delivery Time"
                        name="defaultDeliveryTimeMin"
                        type="number"
                        value={Number(field.value)}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Delivery Time Max */}
              <FormField
                control={form.control}
                name="defaultDeliveryTimeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Max Delivery Time"
                        name="defaultDeliveryTimeMax"
                        type="number"
                        value={Number(field.value)}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Return Policy */}
              <FormField
                control={form.control}
                name="returnPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Return Policy"
                        name="returnPolicy"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          setFormData({
                            ...formData,
                            returnPolicy: field.value,
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </AnimatedContainer>
      <div className="h-[100px] flex pt-4 px-2 justify-between">
        <button
          type="button"
          onClick={() => step > 1 && setStep((prev) => prev - 1)}
          className="h-10 py-2 px-4 rounded-lg shadow-sm text-gray-600 bg-white hover:bg-gray-100 font-medium border"
        >
          Previous
        </button>
        <button
          type="submit"
          onClick={form.handleSubmit(handleSubmit)}
          className="h-10 py-2 px-4 rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-700 font-medium"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default Step3;
