import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="grid h-screen w-full place-items-center">
      <SignIn />
    </div>
  );
};

export default SignInPage;
