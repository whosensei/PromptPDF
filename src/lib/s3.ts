import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client once
const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  try {
    const file_key = "uploads/" + Date.now().toString() + "-" + file.name.replace(/\s+/g, "-");
    
    // Convert File to ArrayBuffer
    const fileArrayBuffer = await file.arrayBuffer();
    
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: Buffer.from(fileArrayBuffer),
      ContentType: file.type,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

export function getS3Url(file_key: string) {
  // Use the correct region here as well
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`;
  return url;
}