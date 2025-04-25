"use client";
import React from "react"
import { useDropzone} from "react-dropzone"
import {Inbox, Loader2, Router, Upload} from "lucide-react"
import { uploadToS3 } from "@/lib/db/s3";
import {useMutation} from "@tanstack/react-query"
import axios from "axios"
import {Toaster, toast} from "react-hot-toast"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {useRouter} from "next/navigation"
import debounce from 'lodash/debounce'

export const Fileupload = () => {
    const router = useRouter();
    const [upload, setUploading] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: async ({file_key, file_name}: {file_key: string, file_name: string}) => {
            const response = await axios.post("/api/create-chat", {file_key, file_name});
            return response.data;
        },
    });

    const handleFileUpload = useCallback(
        debounce(async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;
            
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Please upload a file less than 10MB");
                return;
            }

            try {
                setUploading(true);
                const data = await uploadToS3(file);
                
                if (!data?.file_key || !data.file_name) {
                    toast.error("Something went wrong");
                    return;
                }

                mutate(data, {
                    onSuccess: ({chat_id}) => {
                        toast.success("File uploaded successfully!");
                        router.push(`/chat/${chat_id}`);
                    },
                    onError: (error) => {
                        toast.error("Error creating chat");
                    }
                });
            } catch (error) {
                console.error(error);
                toast.error("Failed to upload file");
            } finally {
                setUploading(false);
            }
        }, 300),
        []
    );

    const dropzoneOptions = {
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        onDrop: handleFileUpload
    };

    const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

    return (
        <Button 
            {...getRootProps()} 
            className="w-full flex items-center"
            loading={upload || isPending}
            loadingText="Uploading..."
        >
            <input {...getInputProps()} />
            {!upload && !isPending && (
                <>
                    <p className="text-sm">Upload Your File Here</p>
                    <Upload className="h-6 w-6" />
                </>
            )}
        </Button>
    );
};