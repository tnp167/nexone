import FollowingContainer from "@/components/store/profile/following/Container";
import { getUserFollowedStores } from "@/queries/profile";
import React from "react";

const ProfileFollowingPage = async ({
  params,
}: {
  params: { page: string };
}) => {
  const page = params.page ? Number(params.page) : 1;
  const response = await getUserFollowedStores(page);
  return (
    <div className="bg-white py-4 px-5">
      <h1 className="texxt-lg mb-3 font-bold">Stores you follow</h1>
      <FollowingContainer
        stores={response.stores}
        page={page}
        totalPages={response.totalPages}
      />
    </div>
  );
};

export default ProfileFollowingPage;
