import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

export async function downloadFromS3(file_key: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const s3 = new S3({
                region: "eu-north-1", 
                credentials: {
                    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
                },
                signatureVersion: 'v4',
            });
            const params = {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
                Key: file_key,
            };

            const obj = await s3.getObject(params).promise(); // Added .promise()
            const file_name = path.join(process.cwd(), "tmp", `dips${Date.now().toString()}.pdf`);

            // Ensure the tmp directory exists
            const dir = path.dirname(file_name);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(file_name, obj.Body as Buffer);
            resolve(file_name);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
