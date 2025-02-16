import { getAllCategories } from "@/queries/category";
import React from "react";
import DataTable from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import CategoryDetails from "@/components/dashboard/Forms/CategoryDetails";

const AdminCategoriesPage = async () => {
  const categories = await getAllCategories();
  if (!categories) return null;

  const CLOUDINARY_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;
  if (!CLOUDINARY_KEY) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Category
        </>
      }
      modalChildren={<CategoryDetails cloudinary_key={CLOUDINARY_KEY} />}
      filterValue="name"
      data={categories}
      searchPlaceholder="Search category name"
      columns={[]}
    />
  );
};

export default AdminCategoriesPage;
