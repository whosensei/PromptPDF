import { NextResponse } from "next/server";
import {loadS3intoPinecone} from "../../../lib/db/pinecone";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getS3Url } from "@/lib/db/s3";
import { chats } from "@/lib/db/schema";

export async function POST (req : Request , res : Response) {
    const {userId} = await auth();
    if(!userId){
        return NextResponse.json({error: "Unauthorized"},{status : 401})
    }
    try {
        const data = await req.json();
        const {file_key, file_name} = data;
        console.log(file_key, file_name);
        await loadS3intoPinecone(file_key);
        const chat_id = await db.insert(chats).values({
            filekey: file_key,
            pdfName:file_name,
            pdfUrl : getS3Url(file_key),
            userId,
        }).returning({
            insertedId : chats.id,
        })

        return NextResponse.json({chat_id :chat_id[0].insertedId}, {status : 200})
    }
    catch(error){
        console.error(error);
        return NextResponse.json({error: "Internal Server Error"} ,{status : 500})
    }
}