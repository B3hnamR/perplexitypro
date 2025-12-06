import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "Tracking code is required" }, { status: 400 });
    }

    try {
        const order = await prisma.order.findUnique({
            where: { trackingCode: code },
            select: {
                trackingCode: true,
                status: true,
                amount: true,
                createdAt: true,
                customerEmail: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
