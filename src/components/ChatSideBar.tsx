"use client"
import type { DrizzleChat } from "@/lib/db/schema"
import Link from "next/link"
import React from "react"
import { Button } from "./ui/button"
import { FileText, PlusCircle } from 'lucide-react'
import { cn } from "@/lib/utils"

type Props = {
  chats: DrizzleChat[]
  chatId: number
}

const ChatSideBar = ({ chats, chatId }: Props) => {
  const [loading, setLoading] = React.useState(false)

  return (
    <div className="w-full h-full flex flex-col bg-orange/5 dark:bg-black-800 p-4 text-charcoal dark:text-white">
      <Link href="/" className="mb-6 flex items-center">
        <span className="text-2xl font-semibold text-orange">PromptPDF</span>
      </Link>

      <Link href="/upload">
        <Button className="w-full bg-orange hover:bg-orange-light text-white border-none rounded-md transition-all duration-300 shadow-md hover:shadow-lg">
          <FileText className="mr-2 w-4 h-4" />
          New Document
        </Button>
      </Link>

      <div className="mt-8 mb-3">
        <h3 className="text-sm font-medium text-charcoal/80 dark:text-gray-300 uppercase tracking-wider">YOUR DOCUMENTS</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-md p-3 mt-2 flex items-center transition-all duration-200", {
                "bg-orange text-white": chat.id === chatId,
                "bg-white dark:bg-black-700 text-charcoal dark:text-white hover:bg-orange/10 dark:hover:bg-black-600": chat.id !== chatId,
              })}
            >
              <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">{chat.pdfName}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-orange/20 dark:border-gray-600">
        <div className="text-xs text-charcoal/60 dark:text-gray-400 mb-2">© {new Date().getFullYear()} PromptPDF</div>
      </div>
    </div>
  )
}

export default ChatSideBar
