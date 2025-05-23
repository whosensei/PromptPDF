"use client"
import React, { useState, useEffect } from "react"
import { Input } from "./ui/input"
import { useChat } from "ai/react"
import { Button } from "./ui/button"
import { Send } from "lucide-react"
import MessageList from "./MessageList"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import type { Message } from "ai"

type Props = { chatId: number }

const ChatComponent = ({ chatId }: Props) => {
  const queryClient = useQueryClient()
  const [messageSent, setMessageSent] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      })
      return response.data
    },
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  })

  const {
    input,
    handleInputChange,
    messages: aiMessages,
    handleSubmit: originalHandleSubmit,
    isLoading: isChatLoading,
  } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  })

  const allMessages = React.useMemo(() => {
    if (!data) return aiMessages

    const newestMessages = aiMessages.filter(
      (msg) => !data.some((dbMsg) => dbMsg.content === msg.content && dbMsg.role === msg.role),
    )

    return [...data, ...newestMessages]
  }, [data, aiMessages])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setMessageSent(true)
    await originalHandleSubmit(e)
  }

  useEffect(() => {
    if (messageSent) {
      const interval = setInterval(() => {
        refetch()
      }, 1000)

      const timeout = setTimeout(() => {
        clearInterval(interval)
        setMessageSent(false)
      }, 10000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [messageSent, refetch])

  useEffect(() => {
    if (messageSent && !isChatLoading) {
      refetch()
      setTimeout(() => setMessageSent(false), 1000)
    }
  }, [isChatLoading, messageSent, refetch])

  useEffect(() => {
    const messageContainer = document.getElementById("message-container")
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [allMessages])

  return (
    <div className="flex flex-col h-full" id="message-container">
      <div className="sticky top-0 inset-x-0 p-4 bg-white border-b border-orange/10 z-10 shadow-sm">
        <h3 className="text-lg font-medium text-charcoal">Chat with Document</h3>
        <p className="text-sm text-charcoal/60">Ask questions about your PDF</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <MessageList messages={allMessages} isLoading={isLoading || (messageSent && isChatLoading)} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-4 py-4 bg-white border-t border-orange/10 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question about your document..."
            className="w-full border-gray-200 focus:border-orange focus:ring-orange rounded-md shadow-sm"
          />
          <Button
            type="submit"
            className="ml-2 bg-orange hover:bg-orange-light text-white rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
            disabled={isChatLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatComponent
