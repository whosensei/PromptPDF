"use client";
import React from "react"
import { useDropzone} from "react-dropzone"
import {Inbox} from "lucide-react"
import { uploadToS3 } from "@/lib/db/s3";

export const Fileupload = () => {

    // Define accepted file types and dropzone configuration
    const dropzoneOptions = {
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        onDrop: async (acceptedFiles: File[]) => {
            console.log(acceptedFiles);
            const file = acceptedFiles[0];
            if(file.size >10*1024*1024){
                alert("please upload a file less than 10mb")
                return
            }
            try{
                const data = await uploadToS3(file);
                console.log("File uploaded successfully")
                console.log("data", data)
            }
            catch(error){
                console.log(error)
            }
        }
    };
y

    // Initialize dropzone with configuration
    const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);
    return (
        <div className="bg-slate-100 rounded-xl p-2">
            <div {...getRootProps()} className= " bg-slate-100 border-slate-400 border-dashed border-2 rounded-xl flex justify-center items-center flex-col cursor-pointer">
                <input {...getInputProps()} />
                <>
                <Inbox className = " w-12 h-12 p-2 color-slate-200 text-slate-500 mt-2" />
                <div className = "px-2 ml-2 mr-2 mb-2 text-slate-500">Drop Your File here</div>
                </>
            </div>
        </div>
    )
}