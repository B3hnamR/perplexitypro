import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const products = await prisma.product.findMany();
        return NextResponse.json(products);
    } catch (error) {
        // ✅ اصلاح خطا: مشخص کردن نوع ارور با (error as Error) یا (error as any)
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}