"use client";

import { cn } from "@/lib/utils";
import { followStore } from "@/queries/user";
import { useUser } from "@clerk/nextjs";
import { Check, MessageSquareMore, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  store: {
    id: string | undefined;
    url: string | undefined;
    name: string | undefined;
    logo: string | undefined;
    followersCount: number;
    isUserFollowingStore: boolean;
  };
}

const StoreCard: FC<Props> = ({ store }) => {
  const { id, name, logo, url, followersCount, isUserFollowingStore } = store;
  const [isFollowing, setIsFollowing] = useState<boolean>(isUserFollowingStore);
  const [storeFollowerCount, setStoreFollowerCount] =
    useState<number>(followersCount);

  const user = useUser();
  const router = useRouter();

  const handleStoreFollow = async () => {
    if (!user.isSignedIn) router.push("/sign-in");

    try {
      const res = await followStore(id!);
      setIsFollowing(res);
      if (res) {
        setStoreFollowerCount((prev) => prev + 1);
        toast.success(`You are now following ${name} store`);
      } else {
        setStoreFollowerCount((prev) => prev - 1);
        toast.error(`You unfollowed ${name} store`);
      }
    } catch {
      toast.error("Failed to follow store");
    }
  };
  return (
    <div className="w-full">
      <div className="bg-[#f5f5f5] flex items-center justify-between rounded-xl py-1 px-4">
        <div className="flex">
          <Link href={`/store/${url}`}>
            <Image
              className="w-12 h-12 object-cover rounded-full"
              src={logo}
              alt={name}
              width={50}
              height={50}
            />
          </Link>
          <div className="mx-2">
            <div className="text-xl font-bold leading-6">
              <Link href={`/store/${url}`}>{name}</Link>
            </div>
            <div className="text-sm leading-5 mt-1">
              <span className="font-bold">100%</span>
              <span>Positive Feedback</span>&nbsp; &nbsp;|&nbsp;
              <span className="font-bold">{storeFollowerCount}</span>&nbsp;
              <span>Followers</span>&nbsp;&nbsp;
            </div>
          </div>
        </div>
        <div className="flex">
          <div
            className={cn(
              "flex items-center border border-black rounded-full  cursor-pointer text-base font-bold h-9 mx-2 px-4 hover:bg-black hover:text-white  transition-all duration-300 ease-in-out",
              {
                "bg-black text-white": isFollowing,
              }
            )}
            onClick={handleStoreFollow}
          >
            {isFollowing ? (
              <Check className="w-4 me-2" />
            ) : (
              <Plus className="w-4 me-2" />
            )}
            <span>{isFollowing ? "Following" : "Follow"}</span>
          </div>
          <div className="flex items-center border border-black rounded-full cursor-pointer text-base font-bold h-9 mx-2 px-4 hover:bg-black hover:text-white transition-all duration-300 ease-in-out">
            <MessageSquareMore className="w-4 me-2" />
            <span>Message</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
