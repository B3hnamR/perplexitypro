"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, FileText, Eye } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function BlogAdminPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const res = await axios.get("/api/admin/blog/posts");
        setPosts(res.data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("آیا مطمئن هستید؟")) return;
        await axios.delete(`/api/admin/blog/posts?id=${id}`);
        fetchPosts();
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <FileText className="text-cyan-400" /> وبلاگ و مقالات
                </h1>
                <Link href="/admin/blog/new" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all">
                    <Plus size={18} /> مطلب جدید
                </Link>
            </div>

            <div className="bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-right text-sm">
                    <thead className="bg-[#0f172a] text-gray-400">
                        <tr>
                            <th className="p-4">عنوان</th>
                            <th className="p-4">وضعیت</th>
                            <th className="p-4">تاریخ</th>
                            <th className="p-4 text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">در حال بارگذاری...</td></tr>
                        ) : posts.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">هیچ مقاله‌ای وجود ندارد.</td></tr>
                        ) : (
                            posts.map(post => (
                                <tr key={post.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-bold">{post.title}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${post.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                            {post.published ? "منتشر شده" : "پیش‌نویس"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{new Date(post.createdAt).toLocaleDateString('fa-IR')}</td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg"><Eye size={16}/></Link>
                                        <Link href={`/admin/blog/edit/${post.id}`} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"><Edit2 size={16}/></Link>
                                        <button onClick={() => handleDelete(post.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}