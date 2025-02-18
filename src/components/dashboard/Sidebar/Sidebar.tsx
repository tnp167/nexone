import { currentUser } from "@clerk/nextjs/server";
import { FC } from "react";
import Logo from "@/components/shared/logo";
import UserInfo from "./UserInfo";
import { SidebarNavAdmin } from "./NavAdmin";
import {
  adminDashboardSidebarOptions,
  sellerDashboardSidebarOptions,
} from "@/constants/data";
import { Store } from "@prisma/client";
import { SidebarNavSeller } from "./NavSeller";
import StoreSwitcher from "./StoreSwitcher";

interface SidebarProps {
  isAdmin: boolean;
  stores?: Store[];
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin, stores }) => {
  const user = await currentUser();
  return (
    <div className="w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
      <Logo width="100%" height="180px" />
      <span className="mt-3" />
      {user && <UserInfo user={user} />}
      {!isAdmin && stores && <StoreSwitcher stores={stores} />}
      {isAdmin ? (
        <SidebarNavAdmin options={adminDashboardSidebarOptions} />
      ) : (
        <SidebarNavSeller options={sellerDashboardSidebarOptions} />
      )}
    </div>
  );
};

export default Sidebar;
