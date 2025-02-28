"use client";

import { OfferTag } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { OfferTagFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { upsertProduct } from "@/queries/product";

import { getAllCategoriesForCategory } from "@/queries/category";
import { upsertOfferTag } from "@/queries/offer-tag";

interface OfferTagDetailsProps {
  data?: OfferTag;
}

const OfferTagDetails: FC<OfferTagDetailsProps> = ({ data }) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof OfferTagFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(OfferTagFormSchema),
    defaultValues: {
      name: data?.name || "",
      url: data?.url || "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({ name: data?.name, url: data?.url });
    }
  }, [data, form]);

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof OfferTagFormSchema>) => {
    try {
      const response = await upsertOfferTag({
        id: data?.id || uuidv4(),
        name: values.name,
        url: values.url,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast({
        title: data?.id
          ? "Offer tag updated"
          : `Offer tag ${response?.name} has been created`,
      });

      if (data?.id) {
        router.refresh();
      } else {
        router.push(`/dashboard/admin/offer-tags`);
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
          <CardTitle>Offer Tag Details</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} offer tag information`
              : "Create a new offer tag"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Offer Tag Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Offer Tag URL</FormLabel>
                      <FormControl>
                        <Input placeholder="URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

export default OfferTagDetails;
