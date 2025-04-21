"use client"

import type React from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"

export function HeroSection() {

    const router = useRouter()
    
    useEffect(() => {
        // Check if user is signed in by checking for token cookie
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))
        const isAuthenticated = !!token
        
        // If user is already signed in, scroll to file upload section
        if (isAuthenticated) {
            const uploadSection = document.getElementById('upload-section')
            if (uploadSection) {
                uploadSection.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }, [])

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

                        <div className="space-y-8 w-full max-w-md">
                            <div className="flex flex-col gap-4">
                                <Button
                                    size="lg"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={()=>router.push("/sign-in")}
                                >
                                    Login to get started
                                    <LogIn className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                </div>
            </div>
        </section>
    )
}
