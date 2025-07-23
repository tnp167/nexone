import FollowingContainer from "@/components/store/profile/following/Container";
import { getUserFollowedStores } from "@/queries/profile";
import React from "react";

const ProfileFollowingPage = async ({
  params,
}: {
  params: Promise<{ page: string }>;
}) => {
  const { page } = await params;
  const response = await getUserFollowedStores(Number(page));
  return (
    <div className="bg-white py-4 px-5">
      <h1 className="texxt-lg mb-3 font-bold">Stores you follow</h1>
      <FollowingContainer
        stores={response.stores}
        page={Number(page)}
        totalPages={response.totalPages}
      />
    </div>
  );
};

export default ProfileFollowingPage;
