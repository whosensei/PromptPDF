import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import Providers from "@/components/Providers"
import { Toaster } from "react-hot-toast"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "PromptPDF | AI-Native Document Assistant",
  description:
    "Chat with any PDF in real time. PromptPDF is an AI-native document assistant that helps you extract insights from your documents instantly.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <Providers>
        <Analytics />
        <html lang="en" className="scroll-smooth">
          <body className={`${inter.variable} font-sans antialiased`}>
            {/* <ConditionalNavbarFooter> */}
            <main>{children}</main>
            {/* </ConditionalNavbarFooter> */}
            <Toaster position="bottom-right" />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  )
}
