import ThemeToggle from "@/components/shared/theme-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <div className="p-5">
        <div className="w-100 flex gap-x-4 justify-end">
          <UserButton />
          <ThemeToggle />
        </div>
        <h1>Hello World</h1>
      </div>
    </>
  );
}
