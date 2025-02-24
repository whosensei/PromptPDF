import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import fs from "fs";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {RecursiveCharacterTextSplitter, Document} from "@pinecone-database/doc-splitter"
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import {convertToAscii} from "../utils";


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

    const documents = await Promise.all(pages.map(prepareDocument));
    // Check if documents exist and are not empty before processing
    if (!documents || documents.length === 0) {
        return [];
    }
    
    const flattenedDocs = documents.filter(Boolean).flat();
    const vectors = await Promise.all(flattenedDocs.map(embedDocument));

    const client = await getPineconeClient();
    const Index = client.Index("pdfgenie-yt");
    const namespace = Index.namespace(convertToAscii(file_key));
    console.log("inserting vectors into pinecone");
    await namespace.upsert(vectors);
    return documents[0];
    
}

async function truncateStringByBytes(str : string , bytes: number) {
    const encoder = new TextEncoder();
    return new TextDecoder("utf-8").decode(encoder.encode(str).slice(0, bytes));
}

async function embedDocument (doc: Document) {
    try{
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);
        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber,
            },
        } as PineconeRecord;

    }catch(error){
        console.log("Error embedding document", error);
        throw error;
    }
}

async function prepareDocument(page: PDFPage){
    let {pageContent, metadata} = page;
    pageContent = pageContent.replace(/\n/g, "");

    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata :{
                pageNumber : metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000),
            }
        }) 
    ]);
    return docs;
}