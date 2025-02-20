import { S3 } from "aws-sdk";

export async function uploadToS3(file: File): Promise<{ file_key: string; file_name: string }> {
    return new Promise((resolve, reject) => {
        try {
            //S3 Client Configuration
            const s3 = new S3({
                region: "eu-north-1",
                credentials: {
                    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!
                }
            });

            // Convert File to Buffer
            const fileReader = new FileReader();
            fileReader.onload = async () => {
                const file_key = "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

                const params = {
                    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
                    Key: file_key,
                    Body: Buffer.from(fileReader.result as ArrayBuffer),
                    ContentType: file.type
                };

                s3.putObject(params, (err, data) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }
                    resolve({
                        file_key,
                        file_name: file.name,
                    });
                });
            };

            fileReader.onerror = (error) => {
                reject(error);
            };

            fileReader.readAsArrayBuffer(file);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}