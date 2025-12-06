import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 100,
            include: {
                links: true,
                user: { // ✅ اضافه کردن اطلاعات کاربر
                    select: { firstName: true, lastName: true, email: true, mobile: true }
                }
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}