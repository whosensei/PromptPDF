"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { toast } from "react-hot-toast"

export function SignUpForm() {
  const [email, setEmail] = useState("")
  const [username, setuserName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const SignupResponse = await axios.post("/api/sign-up", {
        email, username, password
      })

      if (SignupResponse.status === 201) {
        const token = SignupResponse.data.token
        document.cookie = `token=${token}; path=/; max-age=86400; secure; samesite=strict`
        toast.success("Account created successfully!")
        router.push("/uploadfile")
      }
    } catch (error: any) {
      console.error("Authentication error:", error)
      toast.error(error.response?.data?.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white">Sign up</CardTitle>
        <CardDescription className="text-zinc-400">
          Enter your email, username and password to create your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-zinc-700 bg-zinc-800/50 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-primary"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-zinc-300">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="John Doe"
              value={username}
              onChange={(e) => setuserName(e.target.value)}
              required
              className="border-zinc-700 bg-zinc-800/50 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-300">
                Password
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-zinc-700 bg-zinc-800/50 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-primary pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-zinc-400 hover:text-zinc-300"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            loading={isLoading}
            loadingText="Creating account..."
            disabled={isLoading}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign up
          </Button>
          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:text-primary/90 font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
