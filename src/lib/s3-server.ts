import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import fs from "fs";
import path from "path";

// Initialize S3 client once
const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {

    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey:process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  },
});


export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      };

      // Create command and send request
      const command = new GetObjectCommand(params);
      const response = await s3Client.send(command);
      
      // Ensure tmp directory exists
      const tmpDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      
      // Create file path
      const file_name = path.join(tmpDir, `dips${Date.now().toString()}.pdf`);
      
      // Handle the response body as a stream
      if (response.Body instanceof Readable) {
        // Create write stream
        const writeStream = fs.createWriteStream(file_name);
        
        // Handle stream completion
        writeStream.on("finish", () => {
          resolve(file_name);
        });
        
        // Pipe the data stream to the file
        response.Body.pipe(writeStream);
      } else {
        // For Node.js environments, convert response body to buffer and write to file
        // @ts-ignore: Body may be any type of data
        const responseBodyBuffer = await response.Body?.transformToByteArray();
        if (responseBodyBuffer) {
          fs.writeFileSync(file_name, Buffer.from(responseBodyBuffer));
          resolve(file_name);
        } else {
          reject(new Error("Failed to transform response body to buffer"));
        }
      }
    } catch (error) {
      console.error("Error downloading from S3:", error);
      reject(error);
    }
  });
}