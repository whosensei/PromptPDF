import { NextResponse } from "next/server";
import {loadS3intoPinecone} from "../../../lib/db/pinecone";

export async function POST (req : Request , res : Response) {

    try {
        const data = await req.json();
        const {file_key, file_name} = data;
        console.log(file_key, file_name);
        const pages = await loadS3intoPinecone(file_key);
        return NextResponse.json({pages})

    }
    catch(error){
        console.error(error);
        return NextResponse.json({error: "Internal Server Error"} ,{status : 500})
    }
}