"use client";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { AddReviewSchema } from "@/lib/schemas";
import {
  ReviewDetailsType,
  ReviewWithImageType,
  VariantInfoType,
} from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import Select from "../ui/select";
import Input from "../ui/input";
import { Button } from "@/components/ui/button";
import { SyncLoader } from "react-spinners";
import ImageUploadStore from "../shared/UploadImages";
import { upsertReview } from "@/queries/review";
import { v4 } from "uuid";
const ReviewDetails = ({
  productId,
  data,
  variantsInfo,
  setReviews,
  reviews,
}: {
  productId: string;
  data?: ReviewDetailsType;
  variantsInfo: VariantInfoType[];
  reviews: ReviewWithImageType[];
  setReviews: Dispatch<SetStateAction<ReviewWithImageType[]>>;
}) => {
  const [activeVariant, setActiveVariant] = useState<VariantInfoType>(
    variantsInfo[0]
  );

  const [images, setImages] = useState<{ url: string }[]>([]);
  const [sizes, setSizes] = useState<{ name: string; value: string }[]>([]);

  const form = useForm<z.infer<typeof AddReviewSchema>>({
    mode: "onChange",
    resolver: zodResolver(AddReviewSchema),
    defaultValues: {
      variantName: data?.variant || activeVariant.variantName || "",
      rating: data?.rating || 0,
      size: data?.size || "",
      review: data?.review || "",
      quantity: data?.quantity || undefined,
      images: data?.images || [],
      color: data?.color || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const errors = form.formState.errors;

  const handleSubmit = async (values: z.infer<typeof AddReviewSchema>) => {
    try {
      const response = await upsertReview(productId, {
        id: data?.id || v4(),
        variant: values.variantName,
        images: values.images,
        quantity: values.quantity,
        rating: values.rating,
        review: values.review,
        size: values.size,
        color: values.color,
      });

      if (response.id) {
        const rev = reviews.filter((rev) => rev.id !== response.id);
        setReviews([...rev, response]);
        toast.success("Review added successfully");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.toString());
    }
  };

  const variants = variantsInfo.map((v) => ({
    name: v.variantName,
    value: v.variantName,
    image: v.variantImage,
    colors: v.colors.map((c) => c.name).join(","),
  }));

  useEffect(() => {
    form.setValue("size", "");
    const name = form.getValues().variantName;
    const variant = variantsInfo.find((v) => v.variantName === name);
    if (variant) {
      const sizesData = variant.sizes.map((s) => ({
        name: s.size,
        value: s.size,
      }));
      setActiveVariant(variant);
      if (sizes) setSizes(sizesData);
      form.setValue("color", variant.colors.join(","));
    }
  }, [form.getValues().variantName]);

  return (
    <div className="p-4 bg-[#F5F5F5] rounded-xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col space-y-4"
        >
          <div className="flex flex-col space-y-4">
            {/* Title */}
            <div className="pt-4">
              <h1 className="font-bold text-2xl">Add a review</h1>
            </div>
            {/* Form items */}
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="flex items-center gap-x-2">
                        <ReactStars
                          count={5}
                          value={field.value}
                          onChange={field.onChange}
                          color="#E2DFDF"
                          activeColor="#FFD804"
                          isHalf={true}
                          edit={true}
                          size={15}
                          char="★"
                        />
                        <span>
                          ({form.getValues().rating.toFixed(1)} out of 5.0)
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex flex-wrap gap-x-4">
                <div className="flex items-center flex-wrap gap-2">
                  <FormField
                    control={form.control}
                    name="variantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            options={variants}
                            placeholder="Select product"
                            subPlaceholder="Please select a product"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          options={sizes}
                          placeholder="Select size"
                          subPlaceholder="Please select a size"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          name="quantity"
                          type="number"
                          value={field.value ? field.value.toString() : ""}
                          onChange={(value) => {
                            field.onChange(value.toString());
                          }}
                          placeholder="Quantity (optional)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        className="min-h-32 p-4 w-full rounded-xl focus:outline-none ring-1 ring-[transparent] focus:ring-[#11BE86]"
                        placeholder="Write your review..."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="w-full xl:border-r">
                    <FormControl>
                      <ImageUploadStore
                        value={field.value.map((image) => image.url)}
                        disabled={isLoading}
                        onChange={(url) => {
                          setImages((prevImages) => {
                            const updatedImages = [...prevImages, { url }];
                            if (updatedImages.length <= 3) {
                              field.onChange(updatedImages);
                              return updatedImages;
                            } else {
                              return prevImages;
                            }
                          });
                        }}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url
                            ),
                          ])
                        }
                        maxImages={3}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2 text-destructive">
              {errors.rating && <p>{errors.rating.message}</p>}
              {errors.size && <p>{errors.size.message}</p>}
              {errors.review && <p>{errors.review.message}</p>}
            </div>
            <div className="w-full flex justify-end">
              <Button type="submit" className="w-36 h-12">
                {isLoading ? <SyncLoader color="#fff" size={10} /> : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReviewDetails;
