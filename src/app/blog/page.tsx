import Navbar from "@/components/Navbar"; // این از Layout میاد ولی برای این صفحه خاص شاید بخواهید layout جدا داشته باشید، اما طبق layout اصلی کار میکند
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "وبلاگ Perplexity Pro | آخرین اخبار و آموزش‌های هوش مصنوعی",
    description: "مقالات تخصصی درباره GPT-5، Claude 3 و ترفندهای استفاده از هوش مصنوعی.",
};

export const revalidate = 60; // آپدیت هر ۱ دقیقه

export default async function BlogPage() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" }
    });

    return (
        <main className="min-h-screen bg-[#0f172a] text-white font-sans pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">وبلاگ <span className="text-cyan-400">تخصصی</span></h1>
                    <p className="text-gray-400 text-lg">جدیدترین اخبار و آموزش‌های دنیای هوش مصنوعی</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <Link href={`/blog/${post.slug}`} key={post.id} className="group bg-[#1e293b] rounded-3xl overflow-hidden border border-white/5 hover:border-cyan-500/30 transition-all hover:-translate-y-1 shadow-lg">
                            <div className="relative h-48 w-full overflow-hidden">
                                {post.coverImage ? (
                                    <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-cyan-900 to-blue-900 flex items-center justify-center text-white/20 font-black text-4xl">PRO</div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(post.createdAt).toLocaleDateString('fa-IR')}</span>
                                    <span className="flex items-center gap-1"><Clock size={12}/> {post.readingTime} دقیقه</span>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">{post.title}</h2>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                                <span className="text-cyan-500 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                    ادامه مطلب <ArrowLeft size={16} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}