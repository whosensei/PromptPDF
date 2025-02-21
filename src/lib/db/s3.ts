import AWS,  {S3} from "aws-sdk";

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

            // Generate unique file key  ,, file name you want to save in S3
            const file_key = "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

            const params = {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
                Key: file_key, 
                Body: file
            };

            s3.putObject(params, (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                resolve({
                    // using these 2 parameters to save in db
                    file_key,
                    file_name: file.name,
                });
            });
        } catch (error) {
            console.error(error);
            // reject(error);
        }
    });
}

//access s3url just from the file_key
export function getS3Url(file_key: string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`;
    return url;
} 