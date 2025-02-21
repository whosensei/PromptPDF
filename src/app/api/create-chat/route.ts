import { NextResponse } from "next/server";

export async function POST (req : Request , res : Response) {

    try {
        const data = await req.json();
        const {file_key, file_name} = data;

    }
    catch(error){
        console.error(error);
        NextResponse.json({error: "Internal Server Error"} ,{status : 500})
    }
}