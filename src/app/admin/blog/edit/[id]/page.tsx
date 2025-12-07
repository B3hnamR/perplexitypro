import { prisma } from "@/lib/db";
import BlogForm from "../../BlogForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });
    return <BlogForm initialData={post} />;
}