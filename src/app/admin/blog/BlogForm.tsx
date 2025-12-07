"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import RichEditor from "@/components/admin/RichEditor";
import { Save, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BlogForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: initialData?.title || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        coverImage: initialData?.coverImage || "",
        published: initialData?.published || false,
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("file", file);
            
            const res = await axios.post("/api/admin/blog/upload", formData);
            setForm({ ...form, coverImage: res.data.url });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/admin/blog/posts", { 
                ...form, 
                id: initialData?.id 
            });
            router.push("/admin/blog");
        } catch (error) {
            alert("خطا در ذخیره‌سازی");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <Link href="/admin/blog" className="flex items-center gap-2 text-gray-400 hover:text-white">
                    <ArrowRight size={20}/> بازگشت
                </Link>
                <h1 className="text-2xl font-black text-white">
                    {initialData ? "ویرایش مقاله" : "نوشتن مقاله جدید"}
                </h1>
                <button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={18}/> انتشار</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <input 
                        type="text" 
                        placeholder="عنوان مقاله را اینجا بنویسید..." 
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold text-white focus:border-cyan-500 focus:outline-none"
                        required
                    />
                    
                    <RichEditor 
                        content={form.content} 
                        onChange={content => setForm({...form, content})} 
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
                        <label className="block text-sm font-bold text-gray-300 mb-3">تصویر شاخص</label>
                        <div className="relative aspect-video bg-[#0f172a] rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group">
                            {form.coverImage ? (
                                <Image src={form.coverImage} alt="Cover" fill className="object-cover" />
                            ) : (
                                <span className="text-gray-500 text-sm">انتخاب تصویر</span>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                        </div>
                    </div>

                    <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
                        <label className="block text-sm font-bold text-gray-300 mb-3">خلاصه (SEO)</label>
                        <textarea 
                            value={form.excerpt}
                            onChange={e => setForm({...form, excerpt: e.target.value})}
                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 focus:outline-none h-32"
                            placeholder="توضیحات کوتاه برای گوگل..."
                        />
                    </div>

                    <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 flex items-center gap-3">
                        <input 
                            type="checkbox" 
                            checked={form.published} 
                            onChange={e => setForm({...form, published: e.target.checked})}
                            className="w-5 h-5 accent-cyan-500"
                        />
                        <span className="text-white font-medium">انتشار در سایت</span>
                    </div>
                </div>
            </div>
        </form>
    );
}