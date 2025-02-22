"use client";

import { Category } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ProductFormSchema } from "@/lib/schemas";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import ImageUpload from "../Shared/ImageUpload";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { upsertStore } from "@/queries/store";
import { ProductWithVariantType } from "@/lib/types";
import ImagePreviewGrid from "../Shared/ImagesPreviewGrid";
import ClickToAddInputs from "./ClickToAddInputs";
import { getAllCategoriesForCategory } from "@/queries/category";
import { WithOutContext as ReactTags } from "react-tag-input";

interface ProductDetailsProps {
  data?: ProductWithVariantType;
  categories: Category[];
  storeUrl: string;
}

const ProductDetails: FC<ProductDetailsProps> = ({
  data,
  categories,
  storeUrl,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [colors, setColors] = useState<{ color: string }[]>([{ color: "" }]);

  const [sizes, setSizes] = useState<
    { size: string; price: number; quantity: number; discount: number }[]
  >([{ size: "", price: 0.01, quantity: 1, discount: 0 }]);

  const [images, setImages] = useState<{ url: string }[]>([]);

  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description,
      variantName: data?.variantName,
      variantDescription: data?.variantDescription,
      images: data?.images || [],
      categoryId: data?.categoryId,
      subCategoryId: data?.subCategoryId,
      brand: data?.brand,
      sku: data?.sku,
      colors: data?.colors || [{ color: "" }],
      sizes: data?.sizes,
      keywords: data?.keywords || [],
      isSale: data?.isSale,
    },
  });

  const errors = form.formState.errors;

  //Get sub categories when user pick/change a category
  useEffect(() => {
    const getSubCategories = async () => {
      const res = await getAllCategoriesForCategory(form.watch().categoryId);
      setSubCategories(res);
    };
    getSubCategories();
  }, [form.watch().categoryId]);

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name || "",
        description: data?.description,
        variantName: data?.variantName,
        variantDescription: data?.variantDescription ?? undefined,
        images: data?.images || [],
        categoryId: data?.categoryId,
        subCategoryId: data?.subCategoryId,
        brand: data?.brand,
        sku: data?.sku,
        colors: data?.colors || [{ color: "" }],
        sizes: data?.sizes,
        keywords: data?.keywords || [],
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      const response = await upsertStore({
        id: data?.id ? data.id : uuidv4(),
        name: values.name,
        description: values.description,
        email: values.email,
        phone: values.phone,
        logo: values.logo[0].url,
        cover: values.cover[0].url,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast({
        title: data?.id
          ? "Store updated"
          : `Store ${response?.name} has been created`,
      });

      if (data?.id) {
        router.refresh();
      } else {
        router.push(`/dashboard/seller/stores/${response.url}`);
      }
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.toString(),
      });
    }
  };

  interface Keyword {
    id: string;
    text: string;
  }
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleAddition = (keyword: Keyword) => {
    if (keywords.length === 10) return;
    if (!keywords.some((k) => k.toLowerCase() === keyword.text.toLowerCase())) {
      setKeywords([...keywords, keyword.text]);
    } else {
      toast({
        variant: "destructive",
        title: "Duplicate keyword",
        description: "This keyword has already been added",
      });
    }
  };

  const handleDeleteKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => index !== i));
  };

  //Whenever colors,sizes update the form
  useEffect(() => {
    form.setValue("colors", colors);
    form.setValue("sizes", sizes);
    form.setValue("keywords", keywords);
  }, [colors, sizes, keywords]);

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            {data?.productId && data?.variantId
              ? `Update ${data?.name} product information`
              : "Create a new product"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Images and Colors */}
              <div className="flex flex-col gap-y-6 xl:flex-row">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <ImagePreviewGrid
                            images={form.getValues().images}
                            onRemove={(url) => {
                              const updatedImages = images.filter(
                                (img) => img.url != url
                              );
                              setImages(updatedImages);
                              field.onChange(updatedImages);
                            }}
                            colors={colors}
                            setColors={setColors}
                          />
                          <FormMessage className="!mt-4" />
                          <ImageUpload
                            dontShowPreview={true}
                            type="standard"
                            value={field.value.map((image) => image.url)}
                            disabled={isLoading}
                            onChange={(url) =>
                              setImages((prev) => {
                                const updatedImages = [...prev, { url }];
                                field.onChange(updatedImages);
                                return updatedImages;
                              })
                            }
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (current) => current.url !== url
                                ),
                              ])
                            }
                          />
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Colors */}
                <div className="w-full flex flex-col gap-y-3 xl:pl-5">
                  <ClickToAddInputs
                    details={colors}
                    setDetails={setColors}
                    initialDetail={{ color: "" }}
                    header="Colors"
                    colorPicker
                  />
                  {errors.colors && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.colors.message}
                    </span>
                  )}
                </div>
              </div>
              {/* Name */}
              <div className="flex flex-col gap-4 lg:flex-row">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="variantName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Description */}
              <div className="flex flex-col gap-4 lg:flex-row">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="variantDescription"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Category - Sub Category */}
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Category</FormLabel>
                      <FormControl>
                        <Select
                          disabled={isLoading || categories?.length === 0}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select a category"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch().categoryId && (
                  <FormField
                    control={form.control}
                    name="subCategoryId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Product Sub Category</FormLabel>
                        <FormControl>
                          <Select
                            disabled={isLoading || categories?.length === 0}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select a category"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subCategories?.map((subCategory) => (
                                <SelectItem
                                  key={subCategory.id}
                                  value={subCategory.id}
                                >
                                  {subCategory.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              {/* Brand, Sku */}
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Sku</FormLabel>
                      <FormControl>
                        <Input placeholder="Sku" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Keywords */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Keywords</FormLabel>
                      <FormControl>
                        <ReactTags
                          handleAddition={handleAddition}
                          placeholder="Add a keyword"
                          classNames={{
                            tagInputField:
                              "bg-background border rounded-md p-2 w-full focus:outline-none",
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap gap-1">
                  {keywords.map((keyword, idx) => (
                    <div
                      key={idx}
                      className="text-xs inline-flex items-center px-3 py-1 bg-blue-200 text-blue-700 rounded-full gap-2"
                    >
                      <span>{keyword}</span>
                      <span
                        className="cursor-pointer"
                        onClick={() => handleDeleteKeyword(idx)}
                      >
                        x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Sizes */}
              <div className="w-full flex flex-col gap-y-3">
                <ClickToAddInputs
                  details={sizes}
                  setDetails={setSizes}
                  initialDetail={{
                    size: "",
                    price: 0.01,
                    quantity: 1,
                    discount: 0,
                  }}
                  header="Sizes, Quantity, Price, Discount"
                />
                {errors.sizes && (
                  <span className="text-sm font-medium text-destructive">
                    {errors.sizes.message}
                  </span>
                )}
              </div>
              {/* Is On Slae */}
              <FormField
                control={form.control}
                name="isSale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md ">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>On Sale</FormLabel>
                      <FormDescription>
                        Is this product on sale?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : data?.productId && data.variantId
                  ? "Update"
                  : "Create"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ProductDetails;
