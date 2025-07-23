import { getAllStores } from "@/queries/store";
import React from "react";
import DataTable from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import CategoryDetails from "@/components/dashboard/forms/CategoryDetails";
import { columns } from "./columns";

export const dynamic = "force-dynamic";

const AdminStoresPage = async () => {
  const stores = await getAllStores();
  if (!stores) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Category
        </>
      }
      modalChildren={<CategoryDetails />}
      newTabLink="/dashboard/admin/categories/new"
      filterValue="name"
      data={stores}
      searchPlaceholder="Search store name"
      columns={columns}
    />
  );
};

export default AdminStoresPage;
