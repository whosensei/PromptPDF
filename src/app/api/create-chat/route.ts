import { NextResponse } from "next/server";
import { loadS3intoPinecone } from "@/lib/db/pinecone";
import { db } from "@/lib/db";
import { getS3Url } from "@/lib/db/s3";
import { chats } from "@/lib/db/schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // Authenticate user via JWT cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const secret = process.env.JWT_SECRET || "fallback_secret";
    const payload = jwt.verify(token, secret) as { userId: string };
    const userId = parseInt(payload.userId, 10);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { file_key, file_name } = await req.json();
    // Load PDF into Pinecone
    try{
        await loadS3intoPinecone(file_key);
    }catch(e){
        console.log(e)
    }
    
    // Insert chat record
    const result = await db.insert(chats).values({
      filekey: file_key,
      pdfName: file_name,
      pdfUrl: getS3Url(file_key),
      userId,
    }).returning({ insertedId: chats.id });

    return NextResponse.json({ chat_id: result[0].insertedId }, { status: 200 });
  } catch (err) {
    console.error("Error in create-chat route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}