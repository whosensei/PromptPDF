import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";

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
