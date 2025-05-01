import { cn } from "@/lib/utils"
import type { Message } from "ai/react"
import { Loader2 } from "lucide-react"

type Props = {
  isLoading: boolean
  messages: Message[]
}

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 text-orange animate-spin" />
      </div>
    )
  }
  if (!messages) return <></>
  return (
    <div className="flex flex-col gap-3 py-4 w-full">
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "assistant" || message.role === "system",
            })}
          >
            <div
              className={cn("rounded-lg px-4 py-2.5 text-sm shadow-md", {
                "bg-orange text-white": message.role === "user",
                "bg-gray-100 text-charcoal": message.role === "assistant" || message.role === "system",
              })}
            >
              <p className="leading-relaxed">{message.content}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList
