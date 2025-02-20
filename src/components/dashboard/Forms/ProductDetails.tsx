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
import { Input } from "@/components/ui/input";
import ImageUpload from "../Shared/ImageUpload";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { upsertStore } from "@/queries/store";
import { ProductWithVariantType } from "@/lib/types";
import ImagePreviewGrid from "../Shared/ImagesPreviewGrid";
import ClickToAdd from "./ClickToAdd";

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

  //State for colors
  //const [colors, setColors] = useState<{color: string}[]>([{color:"", hex:""}]);

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
              <div className="flex flex-col gap-y-6 xl:flex-row">
                {/* Images */}
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
                            // colors={colors}
                            // setColors={setColors}
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
                {/* <div className="w-full flex flex-col gap-y-3" xl:pl-5>
                  <ClickToAdd
                    details={colors}
                    setDetails={setColors}
                    initialDetail={{color:""}}
                    header="Colors"
                  />
                 </div> */}
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
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
