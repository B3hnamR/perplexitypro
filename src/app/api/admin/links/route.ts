import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    // ... (همان کد قبلی مربوط به GET بدون تغییر) ...
    // برای خلاصه شدن کد اینجا نیاوردم، همان کد قبلی را نگه دارید
    // فقط بخش POST تغییر می‌کند
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "AVAILABLE";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const [availableCount, usedCount] = await Promise.all([
            prisma.downloadLink.count({ where: { status: "AVAILABLE" } }),
            prisma.downloadLink.count({ where: { status: "USED" } })
        ]);

        const links = await prisma.downloadLink.findMany({
            where: { status: status },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: skip,
            include: {
                order: {
                    select: { id: true, customerEmail: true, trackingCode: true }
                }
            }
        });

        return NextResponse.json({
            links,
            stats: { available: availableCount, used: usedCount },
            pagination: {
                page,
                totalPages: Math.ceil((status === "AVAILABLE" ? availableCount : usedCount) / limit),
                total: status === "AVAILABLE" ? availableCount : usedCount
            }
        });

    } catch (error) {
        console.error("Links API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { links } = body; 

        if (!links || !Array.isArray(links) || links.length === 0) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        // ✅ بهینه‌سازی برای MariaDB: استفاده از createMany (خیلی سریع‌تر)
        await prisma.downloadLink.createMany({
            data: links.map((url: string) => ({
                url: url.trim(),
                status: "AVAILABLE",
            })),
            skipDuplicates: true, // اگر لینکی تکراری بود نادیده بگیر (اختیاری)
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Link Create Error:", error);
        return NextResponse.json({ error: "Database Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    // ... (همان کد قبلی DELETE) ...
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.downloadLink.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
    }
}