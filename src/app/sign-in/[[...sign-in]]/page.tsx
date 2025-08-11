import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}