import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    // این روت برای استفاده عمومی (بدون سشن) هم باز است تا کلاینت بتواند وضعیت را چک کند
    // اما برای امنیت بیشتر، نوشتن فقط با سشن است.
    
    const maintenance = await prisma.setting.findUnique({ where: { key: "maintenance_mode" } });
    return NextResponse.json({ 
        maintenance: maintenance?.value === "true" 
    });
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { maintenance } = await req.json();
    
    await prisma.setting.upsert({
        where: { key: "maintenance_mode" },
        update: { value: String(maintenance) },
        create: { key: "maintenance_mode", value: String(maintenance) }
    });

    return NextResponse.json({ success: true });
}