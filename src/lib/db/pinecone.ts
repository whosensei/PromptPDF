import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import fs from "fs";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export const getPineconeClient = () => {
    if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
        throw new Error('PINECONE_ENVIRONMENT and PINECONE_API_KEY must be set in environment variables');
    }
    
    return new Pinecone({
        assistantRegion: process.env.PINECONE_ENVIRONMENT,
        apiKey: process.env.PINECONE_API_KEY,
    });
};

type PDFPage = {
    pageContent: string;
    metadata: {
        loc: { pageNumber: number };
    };
};

export async function loadS3intoPinecone (file_key : string){
    console.log("Downloading from S3...")
    const file_name = await downloadFromS3(file_key);
    if(!file_name){
        throw new Error("Could not download from S3");
    }
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];
    return pages;
}
