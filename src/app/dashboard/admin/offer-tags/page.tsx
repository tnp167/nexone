import DataTable from "@/components/ui/data-table";
import React from "react";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import OfferTagDetails from "@/components/dashboard/Forms/OfferTagDetails";
import { getAllOfferTags } from "@/queries/offer-tag";
const page = async () => {
  const offerTags = await getAllOfferTags();
  return (
    <DataTable
      actionButtonText={
        <>
          <Plus />
          Add Offer Tag
        </>
      }
      modalChildren={<OfferTagDetails />}
      columns={columns}
      data={offerTags}
      filterValue={"name"}
      searchPlaceholder={"Search offer tags"}
    />
  );
};

export default page;
