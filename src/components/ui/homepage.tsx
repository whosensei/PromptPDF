"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, LogIn } from "lucide-react"

export function HeroSection() {
    // Mock authentication state - in a real app, use a proper auth solution
    const [isSignedIn, setIsSignedIn] = useState(false)
    const router = useRouter()

    const handleAuth = () => {
        if (isSignedIn) {
            router.push("/chats")
        } else {
            // Redirect to sign in page
            router.push("/signin")
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handle file upload logic here
        console.log("File selected:", e.target.files?.[0])
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black to-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white max-w-3xl">Chat with Any PDF</h1>
                    <p className="text-xl text-zinc-200 max-w-[600px]">
                        Join millions of students, researchers and professionals to instantly answer questions and understand
                        research with AI
                    </p>

                    {!isSignedIn ? (
                        <div className="space-y-8 w-full max-w-md">
                            <div className="flex flex-col gap-4">
                                <Button
                                    size="lg"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={handleAuth}
                                >
                                    Login to get started
                                    <LogIn className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 w-full max-w-md">
                            <div className="relative border-2 border-dashed border-zinc-700 rounded-lg p-8 hover:border-primary/50 transition-colors">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                />
                                <div className="flex flex-col items-center space-y-4">
                                    <Upload className="h-10 w-10 text-zinc-400" />
                                    <p className="text-zinc-300">Upload your PDF file</p>
                                    <p className="text-zinc-500 text-sm">Drag and drop or click to browse</p>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={handleAuth}
                            >
                                Go to Chats
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
