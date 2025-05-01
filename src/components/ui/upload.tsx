"use client"
import { Button } from "./button"
import { useRouter } from "next/navigation"
import { Upload, MessageCircle } from "lucide-react"
import { useState, useCallback } from "react"
import { FadeUp } from "./fade-up"
import debounce from "lodash/debounce"
import axios from "axios"
import { uploadToS3 } from "@/lib/s3"
import { toast } from "react-hot-toast"

export function UploadFile() {
    const router = useRouter()
    const [isNavigating, setIsNavigating] = useState(false)
    const [uploading, setUploading] = useState(false)

    const handleFileUpload = useCallback(
        debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (!file) return

            if (file.size > 10 * 1024 * 1024) {
                toast.error("Please upload a file less than 10MB")
                return
            }

            try {
                setUploading(true)
                const data = await uploadToS3(file)
                console.log("file uploaded", data)

                if (!data?.file_key || !data.file_name) {
                    toast.error("Something went wrong")
                    return
                }

                try {
                    const response = await axios.post("/api/create-chat", {
                        file_key: data.file_key,
                        file_name: data.file_name
                    })
                    const { chat_id } = response.data
                    toast.success("File uploaded successfully!")
                    router.push(`/chat/${chat_id}`)
                } catch (error) {
                    console.error(error)
                    toast.error("Error creating chat")
                }
            } catch (error) {
                console.error(error)
                toast.error("Failed to upload file")
            } finally {
                setUploading(false)
            }
        }, 300),
        [router]
    )

    const handleGoToChats = () => {
        setIsNavigating(true)
        setTimeout(() => {
            router.push("/chats")
        }, 300)
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black to-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

            <FadeUp delay={0.2}>
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white max-w-3xl">Chat with Any PDF</h1>
                        <p className="text-xl text-zinc-200 max-w-[600px]">
                            Join millions of students, researchers and professionals to instantly answer questions and understand
                            research with AI
                        </p>
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
                                onClick={handleGoToChats}
                                loading={isNavigating}
                                loadingText="Loading chats..."
                            >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Go to Chats
                            </Button>
                        </div>
                    </div>
                </div>
            </FadeUp>

        </section>
    )
}
