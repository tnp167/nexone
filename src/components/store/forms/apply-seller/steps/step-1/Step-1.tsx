import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import AnimatedContainer from "../../AnimtedContainer";
import Image from "next/image";
import DefaultUserImg from "@/public/assets/images/default-user.jpg";
import Link from "next/link";
import { Button } from "@/components/store/ui/button";
import UserDetails from "./UserDetails";
const Step1 = ({
  step,
  setStep,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const { isSignedIn } = useUser();
  const [user, setUser] = useState<boolean>(false);

  useEffect(() => {
    if (isSignedIn) {
      setUser(isSignedIn);
    }
  }, [isSignedIn]);

  return (
    <div className="w-full">
      <AnimatedContainer>
        {isSignedIn && user ? (
          <UserDetails />
        ) : (
          <div className="h-full">
            <div className="h-full flex flex-col justify-center space-y-4">
              <div className="w-full bg-blue-100 border border-blue-200 text-sm text-blue-800 rounded-lg dark:bg-blue-800/10 dark:border-blue-900 dark:text-blue-500">
                <div className="flex p-4">Please sign in to continue</div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src={DefaultUserImg}
                alt="Default User"
                width={200}
                height={200}
                className="size-40 object-coveer rounded-full"
              />
            </div>
            <div className="flex flex-col gap-y-3">
              <Link href="/sign-in">
                <Button>Sign in</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="pink">Sign up</Button>
              </Link>
            </div>
          </div>
        )}
      </AnimatedContainer>
      {isSignedIn && (
        <div className="h-[100px] flex pt-4 px-2 justify-between">
          <button
            type="button"
            onClick={() => step > 1 && setStep((prev) => prev - 1)}
            className="h-10 py-2 px-4 rounded-lg shadow-sm text-gray-600 bg-white hover:bg-gray-100 font-medium border"
          >
            Previous
          </button>
          <button
            type="submit"
            onClick={() => step < 4 && setStep((prev) => prev + 1)}
            className="h-10 py-2 px-4 rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-700 font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Step1;
