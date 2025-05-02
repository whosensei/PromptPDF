"use client"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import ChatSideBar from "./ChatSideBar"
import PDFViewer from "./PDFViewer"
import ChatComponent from "./ChatComponent"
import type { DrizzleChat } from "@/lib/db/schema"

type ResizablePanelsLayoutProps = {
  chats: DrizzleChat[]
  chatId: number
  pdfUrl: string
}

const ResizablePanelsLayout = ({ chats, chatId, pdfUrl }: ResizablePanelsLayoutProps) => {
  return (
    <PanelGroup direction="horizontal">
      <Panel defaultSize={20} minSize={15}>
        <div className="h-full">
          <ChatSideBar chats={chats} chatId={chatId} />
        </div>
      </Panel>
      <PanelResizeHandle className="w-1.5 bg-orange/10 hover:bg-orange/30 transition-colors duration-300" />
      <Panel defaultSize={50} minSize={30}>
        <div className="h-full">
          <PDFViewer pdf_url={pdfUrl} />
        </div>
      </Panel>
      <PanelResizeHandle className="w-1.5 bg-orange/10 hover:bg-orange/30 transition-colors duration-300" />
      <Panel defaultSize={30} minSize={20}>
        <div className="h-full">
          <ChatComponent chatId={chatId} />
        </div>
      </Panel>
    </PanelGroup>
  )
}

export default ResizablePanelsLayout
