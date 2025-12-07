import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const activeAnnouncements = await prisma.announcement.findMany({
        where: { isActive: true }
    });
    return NextResponse.json(activeAnnouncements);
}