import StoreDetails from "@/components/dashboard/forms/StoreDetails";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

const SelletStoreSettingsPage = async ({
  params,
}: {
  params: { storeUrl: string };
}) => {
  const { storeUrl } = await params;
  const storeDetails = await db.store.findUnique({
    where: {
      url: storeUrl,
    },
  });
  if (!storeDetails) redirect("/dashboard/seller/stores");
  return (
    <div>
      <StoreDetails data={storeDetails} />{" "}
    </div>
  );
};

export default SelletStoreSettingsPage;
