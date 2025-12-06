import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ✅ محافظت شده
export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // دریافت اولین محصول (چون فقط یک محصول داریم)
    const product = await prisma.product.findFirst();
    return NextResponse.json(product || {});
}

// ✅ پشتیبانی از POST و PUT برای ذخیره
export async function PUT(req: Request) {
    return handleSave(req);
}

export async function POST(req: Request) {
    return handleSave(req);
}

async function handleSave(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        
        // پیدا کردن محصول موجود
        const existingProduct = await prisma.product.findFirst();

        let product;
        if (existingProduct) {
            // آپدیت
            product = await prisma.product.update({
                where: { id: existingProduct.id },
                data: {
                    name: body.name,
                    description: body.description,
                    price: body.price,
                    imageUrl: body.imageUrl,
                    fileUrl: body.fileUrl,
                },
            });
        } else {
            // ایجاد
            product = await prisma.product.create({
                data: {
                    name: body.name,
                    description: body.description,
                    price: body.price,
                    imageUrl: body.imageUrl,
                    fileUrl: body.fileUrl,
                },
            });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Product Save Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}