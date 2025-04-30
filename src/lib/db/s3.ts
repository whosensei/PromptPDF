import axios from "axios";

//access s3url just from the file_key
export function getS3Url(file_key: string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`;
    return url;
}

/**
 * Uploads a file to S3 by fetching a presigned URL via axios, then PUTting the file.
 */
export async function uploadToS3(file: File): Promise<{ file_key: string; file_name: string }> {
  // Request a presigned upload URL using axios
  const presignResult = await axios.post('/api/upload-url', {
    fileName: file.name,
    fileType: file.type,
  });
  if (presignResult.status !== 200) {
    throw new Error(presignResult.data?.error || 'Failed to get upload URL');
  }
  const { url, key: file_key } = presignResult.data;

  // Upload the file to S3 using the presigned URL
  const uploadResult = await axios.put(url, file, {
    headers: { 'Content-Type': file.type },
  });
  if (uploadResult.status !== 200) {
    throw new Error('Failed to upload file to S3');
  }
  return { file_key, file_name: file.name };
}