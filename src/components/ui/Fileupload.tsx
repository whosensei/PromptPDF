"use client";
import React from "react"
import { useDropzone} from "react-dropzone"
import {Inbox} from "lucide-react"

export const Fileupload = () => {

    // Define accepted file types and dropzone configuration
    const dropzoneOptions = {
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        onDrop: (acceptedFiles: File[]) => {
            console.log(acceptedFiles);
        }
    };

    // Initialize dropzone with configuration
    const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);
    return (
        <div className="bg-slate-100 rounded-xl p-2">
            <div {...getRootProps} className= " bg-slate-200 border-slate-400 border-dashed border-2 rounded-xl flex justify-center items-center flex-col cursor-pointer">
                <Inbox className = " w-12 h-12 p-2 color-slate-200 text-slate-500 mt-2" />
                <div className = "px-2 ml-2 mr-2 mb-2">Drop Your File here</div>
                <input {...getInputProps()} />
            </div>
        </div>
    )
}