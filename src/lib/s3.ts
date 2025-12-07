import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "default",
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY || "",
        secretAccessKey: process.env.LIARA_SECRET_KEY || "",
    },
});

export async function uploadToS3(file: Buffer, filename: string, contentType: string) {
    const key = `blog/${Date.now()}-${filename}`;
    
    const params = {
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: "public-read" as const, // فایل عمومی باشد
    };

    await s3Client.send(new PutObjectCommand(params));
    
    // ساخت لینک عمومی فایل
    return `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${key}`;
}