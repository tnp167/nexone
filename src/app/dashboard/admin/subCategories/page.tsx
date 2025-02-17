import React from "react";
import { getAllSubCategories } from "@/queries/subCategory";
import { getAllCategories } from "@/queries/category";
import DataTable from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import SubCategoryDetails from "@/components/dashboard/Forms/SubCategoryDetails";

const AdminSubCategoriesPage = async () => {
  const subCategories = await getAllSubCategories();
  if (!subCategories) return null;

  const categories = await getAllCategories();

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Sub Category
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories} />}
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search sub category name"
      columns={columns}
    />
  );
};

export default AdminSubCategoriesPage;
