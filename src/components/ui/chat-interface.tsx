"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, Smile, Menu, X, ChevronRight } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your PDF assistant. Upload a PDF or ask me anything about your documents.",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarHover, setSidebarHover] = useState(false)
  const [sidebarLocked, setSidebarLocked] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm analyzing your question. Here's what I found in your PDF...",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleSidebar = () => {
    setSidebarLocked(!sidebarLocked)
    setSidebarOpen(!sidebarOpen)
  }

  // Handle mouse movement for sidebar hover effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sidebarLocked) {
      const threshold = 280 // pixels from left edge
      setSidebarHover(e.clientX <= threshold)
    }
  }

  return (
    <div className="flex h-screen bg-zinc-900 relative" onMouseMove={handleMouseMove}>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-20 transition-all duration-300 ease-in-out ${
          sidebarOpen || sidebarHover ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "280px" }}
      >
        <div className="h-full bg-zinc-900/90 backdrop-blur-sm border-r border-zinc-800 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white">PDF Chats</h2>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-zinc-400 hover:text-white">
              {sidebarLocked ? <X className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-2">
              <p className="text-sm text-zinc-500">Recent PDFs</p>
              {["Research Paper.pdf", "Financial Report.pdf", "Study Notes.pdf"].map((pdf, index) => (
                <div
                  key={index}
                  className="p-2 rounded-md hover:bg-zinc-800 cursor-pointer flex items-center text-zinc-300"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  {pdf}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          (sidebarOpen || sidebarHover) && sidebarLocked ? "ml-[280px]" : "ml-0"
        }`}
      >
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center px-4">
          {!sidebarOpen && !sidebarHover && (
            <Button variant="ghost" size="icon" className="mr-2 text-zinc-400 hover:text-white" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold text-white">Financial Report.pdf</h1>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 bg-gradient-to-b from-zinc-900 to-black">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="flex items-center mb-2">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-zinc-700 text-zinc-300">AI</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-zinc-400">PDF Assistant</span>
                    </div>
                  )}
                  <p>{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-primary-foreground/70" : "text-zinc-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-zinc-800 p-4 bg-zinc-900/90 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-zinc-800 rounded-lg p-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about your PDF..."
                  className="border-0 bg-transparent focus-visible:ring-0 text-zinc-200 placeholder:text-zinc-500"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
