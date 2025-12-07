import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;

        const coupon = await prisma.discountCode.findUnique({
            where: { id },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: { firstName: true, lastName: true, mobile: true, email: true }
                        }
                    }
                }
            }
        });

        if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

        return NextResponse.json(coupon);
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}