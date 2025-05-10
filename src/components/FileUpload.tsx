"use client"
import { uploadToS3 } from "@/lib/s3"
import { FileText, Loader2, Upload } from "lucide-react"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"


const FileUpload = () => {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDrop: async (acceptedFiles) => {
      setDragActive(false)
      const file = acceptedFiles[0]
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large (max 10MB)")
        return
      }

      try {
        setUploading(true)
        const data = await uploadToS3(file)
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong with the upload")
          return
        }

        const response = await axios.post("/api/create-chat", {
          file_key: data.file_key,
          file_name: data.file_name,
        })

        const { chat_id } = response.data
        toast.success("PDF uploaded successfully!")
        router.push(`/chat/${chat_id}`)
      } catch (error) {
        toast.error("Error creating chat session")
        console.error(error)
      } finally {
        setUploading(false)
      }
    },
  })

  return (
    <>
    <div className="w-full h-full">
      <div
        {...getRootProps({
          className: `
            relative border-2 border-dashed rounded-xl transition-all duration-300 
            ${dragActive ? "border-orange bg-orange/5" : "border-orange/30 bg-white"} 
            hover:border-orange hover:bg-orange/5 cursor-pointer p-8 md:p-12
            shadow-lg hover:shadow-xl
          `,
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          {uploading ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <Loader2 className="h-12 w-12 text-orange animate-spin mb-4" />
              <h3 className="text-xl font-medium text-charcoal mb-2">Processing your PDF</h3>
              <p className="text-charcoal/70">We're preparing your document for AI analysis...</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="mb-4 p-4 bg-orange/10 rounded-full shadow-md">
                <FileText className="h-10 w-10 text-orange" />
              </div>
              <h3 className="text-xl font-medium text-charcoal mb-2">Upload your PDF</h3>
              <p className="text-charcoal/70 mb-4 max-w-md">
                Drag and drop your PDF file here, or click to browse your files
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-orange text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300">
                <Upload className="h-4 w-4 mr-2" />
                <span>Select PDF file</span>
              </div>
              <p className="mt-4 text-xs text-charcoal/50">Maximum file size: 10MB</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
    </>
    
  )
}

export default FileUpload
