import { getAllCategories } from "@/queries/category";
import React from "react";
import DataTable from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import CategoryDetails from "@/components/dashboard/forms/CategoryDetails";
import { columns } from "./columns";
const AdminCategoriesPage = async () => {
  const categories = await getAllCategories();
  if (!categories) return null;

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
      data={categories}
      searchPlaceholder="Search category name"
      columns={columns}
    />
  );
};

export default AdminCategoriesPage;
