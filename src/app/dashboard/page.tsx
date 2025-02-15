import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await currentUser();
  console.log(user?.privateMetadata);
  if (user?.privateMetadata?.role === "USER" || !user?.privateMetadata)
    redirect("/");
  if (user?.privateMetadata?.role === "ADMIN") redirect("/dashboard/admin");
  if (user?.privateMetadata?.role === "SELLER") redirect("/dashboard/seller");
  return <div>DashboardPage</div>;
};

export default DashboardPage;
