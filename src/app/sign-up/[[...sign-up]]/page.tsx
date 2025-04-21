import { SignUpForm } from "@/components/ui/signup"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-zinc-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold text-white">
          PDF<span className="text-primary">Chat</span>
        </h1>
      </div>

      <div className="relative z-10">
        <SignUpForm />
      </div>
    </div>
  )
}
