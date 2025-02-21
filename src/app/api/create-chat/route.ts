import { NextResponse } from "next/server";

export async function POST (req : Request , res : Response) {

    try {
        const data = await req.json();
        const {file_key, file_name} = data;
        console.log(file_key, file_name);
        return NextResponse.json({message : "success at backend"},{status : 200})

    }
    catch(error){
        console.error(error);
        return NextResponse.json({error: "Internal Server Error"} ,{status : 500})
    }
}