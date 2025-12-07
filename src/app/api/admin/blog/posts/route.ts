import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function GET() {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(posts);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { id, title, content, excerpt, coverImage, published } = body;

        // ساخت اسلاگ تمیز برای URL فارسی
        const slug = slugify(title, { lower: true, strict: true, locale: 'fa' }) + "-" + Date.now().toString().slice(-4);

        // محاسبه زمان مطالعه (هر ۲۰۰ کلمه ۱ دقیقه)
        const wordCount = content.replace(/<[^>]*>?/gm, '').length / 5; // تخمینی
        const readingTime = Math.ceil(wordCount / 200) || 1;

        const data = {
            title,
            slug: id ? undefined : slug, // اسلاگ فقط موقع ساخت ایجاد شود
            content,
            excerpt,
            coverImage,
            published,
            readingTime,
            authorId: session.user?.id
        };

        if (id) {
            const updated = await prisma.post.update({ where: { id }, data });
            return NextResponse.json(updated);
        } else {
            const created = await prisma.post.create({ data: { ...data, slug } });
            return NextResponse.json(created);
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
}