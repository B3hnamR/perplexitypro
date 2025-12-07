import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import { Calendar, Clock, User } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) return { title: "Not Found" };
    
    return {
        title: `${post.title} | Perplexity Pro Blog`,
        description: post.excerpt,
        openGraph: {
            images: post.coverImage ? [post.coverImage] : [],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await prisma.post.findUnique({ 
        where: { slug },
        include: { author: { select: { name: true } } }
    });

    if (!post || !post.published) notFound();

    // افزایش بازدید (باید در یک API جداگانه باشد تا صفحه استاتیک بماند، اما برای سادگی اینجا نمی‌گذاریم چون SSR را کند می‌کند)

    return (
        <main className="min-h-screen bg-[#0f172a] text-white font-sans pt-32 pb-20">
            <article className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-4">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(post.createdAt).toLocaleDateString('fa-IR')}</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {post.readingTime} دقیقه مطالعه</span>
                        <span className="flex items-center gap-1"><User size={14}/> {post.author?.name || "ادمین"}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">{post.title}</h1>
                    
                    {post.coverImage && (
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12 border border-white/10">
                            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
                        </div>
                    )}
                </div>

                {/* Content - استفاده از Tailwind Typography */}
                <div 
                    className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-a:text-cyan-400 prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
            <div className="max-w-4xl mx-auto mt-20 px-4">
                 <Footer />
            </div>
        </main>
    );
}