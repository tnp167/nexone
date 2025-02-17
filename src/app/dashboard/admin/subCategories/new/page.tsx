import React from "react";
import SubCategoryDetails from "@/components/dashboard/Forms/SubCategoryDetails";
import { getAllCategories } from "@/queries/category";

const AdminNewSubCategoryPage = async () => {
  const categories = await getAllCategories();
  return <SubCategoryDetails categories={categories} />;
};

export default AdminNewSubCategoryPage;
