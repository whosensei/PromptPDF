import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client with server-side credentials and region
const s3Client = new S3Client({
  // Use region from env
  region: process.env.NEXT_PUBLIC_S3_REGION!,
  credentials: {
    // Swap mapping: user provided secret in ACCESS_KEY_ID and id in SECRET_ACCESS_KEY
    accessKeyId: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
  },
});

export async function POST(req: Request) {
  try {
    const { fileName, fileType } = await req.json();
    if (!fileName || !fileType) {
      return NextResponse.json({ error: "Missing fileName or fileType" }, { status: 400 });
    }

    // Generate a unique S3 object key
    const key = `uploads/${Date.now().toString()}-${fileName.replace(/\s+/g, "-")}`;

    // Prepare PutObject command for presigning
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    // Generate presigned URL valid for 1 hour
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ url, key }, { status: 200 });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json({ error: "Could not generate upload URL" }, { status: 500 });
  }
} 