import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ArrowLeft, CheckCircle2, FileText, Zap } from "lucide-react"
import Link from "next/link"
import FileUpload from "@/components/FileUpload"

export default async function UploadPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange/5 to-white pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <Link href="/" className="inline-flex items-center text-charcoal/70 hover:text-orange transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">Upload Your PDF</h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Upload any PDF document and start chatting with it instantly. Our AI will analyze the content and help you
            extract insights.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              <FileUpload />
            </div>
          </div>

          <div className="bg-orange/5 p-8 border-t border-orange/10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-medium mb-6 flex items-center">
                <Zap className="h-5 w-5 text-orange mr-2" />
                How It Works
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="bg-orange/10 rounded-full w-10 h-10 flex items-center justify-center text-orange font-medium mb-4 shadow-sm">
                    1
                  </div>
                  <h3 className="font-medium mb-2">Upload PDF</h3>
                  <p className="text-sm text-charcoal/70">
                    Simply drag and drop your PDF file or click to browse your files.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="bg-orange/10 rounded-full w-10 h-10 flex items-center justify-center text-orange font-medium mb-4 shadow-sm">
                    2
                  </div>
                  <h3 className="font-medium mb-2">AI Processing</h3>
                  <p className="text-sm text-charcoal/70">
                    Our AI analyzes your document, understanding its content and structure.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="bg-orange/10 rounded-full w-10 h-10 flex items-center justify-center text-orange font-medium mb-4 shadow-sm">
                    3
                  </div>
                  <h3 className="font-medium mb-2">Start Chatting</h3>
                  <p className="text-sm text-charcoal/70">
                    Ask questions, request summaries, or explore specific sections of your document.
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-medium mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-orange mr-2" />
                  Tips for Best Results
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-orange mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-charcoal/70">
                        <span className="font-medium text-charcoal">Use searchable PDFs</span> - For best results, use
                        PDFs with selectable text rather than scanned images.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-orange mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-charcoal/70">
                        <span className="font-medium text-charcoal">File size matters</span> - Keep your files under
                        10MB for faster processing and better performance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-orange mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-charcoal/70">
                        <span className="font-medium text-charcoal">Ask specific questions</span> - For better results,
                        ask clear and specific questions about the document content.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-orange mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-charcoal/70">
                        <span className="font-medium text-charcoal">Well-structured documents</span> - Documents with
                        clear headings and structure will yield more accurate responses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
