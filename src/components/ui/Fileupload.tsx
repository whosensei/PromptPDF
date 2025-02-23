"use client";
import React from "react"
import { useDropzone} from "react-dropzone"
import {Inbox, Loader2} from "lucide-react"
import { uploadToS3 } from "@/lib/db/s3";
import {useMutation} from "@tanstack/react-query"
import axios from "axios"
import {Toaster, toast} from "react-hot-toast"
import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Fileupload = () => {

    const [upload,setuploading] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn : async ({file_key,file_name} : {file_key:string,file_name :string})=>{
            const response = await axios.post("/api/create-chat" , {file_key,file_name});
            return response.data;
        },
    });

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
                toast.error("please upload a file less than 10mb")
                return
            }
            try{
                setuploading(true);
                const data = await uploadToS3(file);
                if(!data?.file_key || !data.file_name){
                    toast.error("something went wrong")
                    return;
                }

                mutate(data , {
                    onSuccess: (data) =>{
                        // toast.success(data.message)
                        console.log(data)
                    },
                    onError: (error)=>{
                        toast.error("error creating chat")
                    }
                })
                console.log("File uploaded successfully")
                console.log("data", data)
            }
            catch(error){
                console.log(error)
            }finally{
                setuploading(false);
            }
        }
    };

    // Initialize dropzone with configuration
    const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);
    return (

        <Button {...getRootProps()} className="w-full flex items-center">
            <input {...getInputProps()} />
            {upload || isPending ? (
                <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <p className="text-sm">
                        Uploading...
                    </p>
                </>
            ) : (
                <>
                    <p className=" text-sm">Upload Your File Here</p>
                    <Upload className="h-6 w-6" />
                </>
            )}
        </Button>




        // <div className=" bg-slate-100 rounded-xl p-2">
        //     <div {...getRootProps()} className= "bg-slate-100 border-slate-400 border-dashed border-2 rounded-xl flex justify-center items-center flex-col cursor-pointer">
        //         <input {...getInputProps()} />
        //         {(upload || isPending) ? (
        //             <>
        //             <Loader2 className = "w-12 h-12 p-2 color-slate-200 text-slate-500 mt-2 animate-spin" />
        //             <p className = "mt-2 text-slate-400">
        //                 uploading...
        //             </p>
        //             </>
        //         ) :(
        //         <>
        //         <Inbox className = " w-12 h-12 p-2 color-slate-200 text-slate-500 mt-2" />
        //         <div className = "px-2 ml-2 mr-2 mb-2 text-slate-500">Drop Your File here</div>
        //         </>)}
        //     </div>
        // </div>
    )
}