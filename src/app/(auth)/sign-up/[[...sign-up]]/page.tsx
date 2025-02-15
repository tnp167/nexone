import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="grid h-screen w-full place-items-center">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
