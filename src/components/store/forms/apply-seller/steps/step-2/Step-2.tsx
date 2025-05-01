import { StoreFormSchema } from "@/lib/schemas";
import { StoreType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { Dispatch, SetStateAction } from "react";
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

const Step2 = ({
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
  const form = useForm<z.infer<typeof StoreFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(StoreFormSchema), // Resolver for form validation
    defaultValues: {
      logo: formData.logo ? [{ url: formData.logo }] : [],
      cover: formData.cover ? [{ url: formData.cover }] : [],
      name: formData.name,
      description: formData.description,
      url: formData.url,
      email: formData.email,
      phone: formData.phone,
    },
  });

  const handleSubmit = async (values: z.infer<typeof StoreFormSchema>) => {
    setStep((prev) => prev + 1);
  };
  return (
    <div className="h-full">
      <AnimatedContainer>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Form items */}
            <div className="space-y-4">
              <div className="relative mb-24">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="absolute -bottom-20 -left-48 z-10 inset-x-40">
                      <FormControl>
                        <ImageUpload
                          error={form.formState.errors.logo ? true : false}
                          type="profile"
                          value={field.value.map((image) => image.url)}
                          onChange={(url) => {
                            field.onChange([{ url }]);
                            setFormData({ ...formData, logo: url });
                          }}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url
                              ),
                            ])
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          error={form.formState.errors.logo ? true : false}
                          type="cover"
                          value={field.value.map((image) => image.url)}
                          onChange={(url) => {
                            field.onChange([{ url }]);
                            setFormData({ ...formData, cover: url });
                          }}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url
                              ),
                            ])
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <Input
                        placeholder="Store name"
                        value={field.value}
                        type="text"
                        name="name"
                        onChange={(e) => {
                          field.onChange(e);
                          setFormData((prev) => ({
                            ...prev,
                            url: field.value,
                          }));
                        }}
                      />
                    </FormControl>
                    <FormMessage className="ml-1" />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Store description"
                        {...field}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          setFormData((prev) => ({ ...prev, [name]: value }));
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Url */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Store url"
                        name="url"
                        type="text"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          setFormData((prev) => ({
                            ...prev,
                            url: field.value,
                          }));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Store email"
                        name="email"
                        type="text"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          setFormData((prev) => ({
                            ...prev,
                            url: field.value,
                          }));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Store phone"
                        name="phone"
                        type="text"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          setFormData((prev) => ({
                            ...prev,
                            url: field.value,
                          }));
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
          Next
        </button>
      </div>
    </div>
  );
};
export default Step2;
