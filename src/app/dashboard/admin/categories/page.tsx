import { getAllCategories } from "@/queries/category";
import React from "react";
import DataTable from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import CategoryDetails from "@/components/dashboard/Forms/CategoryDetails";
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
      filterValue="name"
      data={categories}
      searchPlaceholder="Search category name"
      columns={columns}
    />
  );
};

export default AdminCategoriesPage;
