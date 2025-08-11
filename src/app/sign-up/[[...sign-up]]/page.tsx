import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignUp />
      </div>
    </div>
  );
}