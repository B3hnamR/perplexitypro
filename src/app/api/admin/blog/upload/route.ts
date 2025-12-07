import { auth } from "@/auth";
import { uploadToS3 } from "@/lib/s3";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadToS3(buffer, file.name, file.type);

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}