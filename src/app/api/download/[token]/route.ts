import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        // 1. اعتبارسنجی توکن
        const order = await prisma.order.findUnique({
            where: { downloadToken: token },
            include: { links: true } // دریافت لینک‌های محصول
        });

        if (!order || order.status !== "PAID") {
            return new NextResponse("Link Expired or Invalid", { status: 403 });
        }

        // 2. تولید محتوای فایل در حافظه (بدون ذخیره روی دیسک)
        // محتوای فایل متنی شامل لینک‌های خریداری شده
        const fileContent = `
سپاس از خرید شما از Perplexity Pro
------------------------------------------------
شماره سفارش: ${order.trackingCode}
تاریخ: ${new Date(order.createdAt).toLocaleDateString('fa-IR')}
------------------------------------------------
لایسنس‌های شما:
${order.links.map((l, i) => `${i + 1}. ${l.url}`).join('\n')}
------------------------------------------------
با تشکر
        `.trim();

        // 3. آپدیت تعداد دانلود (اختیاری)
        await prisma.order.update({
            where: { id: order.id },
            data: { downloadCount: { increment: 1 } }
        });

        // 4. ارسال فایل به کاربر
        return new NextResponse(fileContent, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Content-Disposition": `attachment; filename="PerplexityPro-License-${order.trackingCode}.txt"`,
            },
        });

    } catch (error) {
        console.error("Download Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}