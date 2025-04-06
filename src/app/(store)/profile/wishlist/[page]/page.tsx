import WishlistContainer from "@/components/store/profile/wishlist/Container";
import { getUserWishlist } from "@/queries/profile";
import React from "react";

const ProfileWishlistPage = async ({
  params,
}: {
  params: { page: string };
}) => {
  const page = params.page;
  const wishlistData = await getUserWishlist(Number(page));
  const { wishlist, totalPages } = wishlistData;
  return (
    <div className="bg-white py-4 px-6">
      <h1 className="text-lg mb-3 font-bold">
        {wishlist.length > 0 ? (
          <WishlistContainer
            products={wishlist}
            page={Number(page)}
            totalPages={totalPages}
          />
        ) : (
          "No items in wishlist"
        )}
      </h1>
    </div>
  );
};

export default ProfileWishlistPage;
