"use client";

import { useState, useEffect } from "react";
import { 
    Plus, Trash2, Link as LinkIcon, Loader2, 
    CheckCircle, Archive, ArrowRight, ArrowLeft, User 
} from "lucide-react";

export default function LinksPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [newLink, setNewLink] = useState("");
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [activeTab, setActiveTab] = useState<"AVAILABLE" | "USED">("AVAILABLE");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
    const [stats, setStats] = useState({ available: 0, used: 0 });

    const fetchLinks = async (status = activeTab, pageNum = page) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/links?status=${status}&page=${pageNum}&limit=10`);
            const data = await res.json();
            
            if (data.links) {
                setLinks(data.links);
                setPagination(data.pagination);
                setStats(data.stats);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // وقتی تب عوض میشه، برگرد به صفحه ۱ و دیتا رو بگیر
    useEffect(() => {
        setPage(1);
        fetchLinks(activeTab, 1);
    }, [activeTab]);

    // وقتی صفحه عوض میشه، دیتا رو بگیر
    useEffect(() => {
        fetchLinks(activeTab, page);
    }, [page]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLink.trim()) return;
        setAdding(true);
        try {
            const lines = newLink.split('\n').filter(line => line.trim() !== '');
            await fetch("/api/admin/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ links: lines }),
            });
            setNewLink("");
            // رفرش کردن لیست موجودی
            if (activeTab === "AVAILABLE") fetchLinks();
            else setActiveTab("AVAILABLE"); // اگر در تب فروخته شده بود، برود به موجود
        } catch (error) {
            alert("خطا در افزودن لینک");
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("آیا مطمئن هستید؟")) return;
        await fetch(`/api/admin/links?id=${id}`, { method: "DELETE" });
        fetchLinks();
    };

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
                        <LinkIcon className="text-cyan-400" /> مدیریت انبار
                    </h1>
                    <p className="text-gray-400 text-sm">افزودن و مدیریت لایسنس‌های تحویل آنی</p>
                </div>
                
                {/* Tabs Header */}
                <div className="bg-[#1e293b] p-1 rounded-xl flex items-center gap-1 border border-white/10">
                    <button
                        onClick={() => setActiveTab("AVAILABLE")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === "AVAILABLE" 
                            ? "bg-emerald-500 text-white shadow-lg" 
                            : "text-gray-400 hover:text-white"
                        }`}
                    >
                        <CheckCircle size={16} />
                        موجود ({stats.available})
                    </button>
                    <button
                        onClick={() => setActiveTab("USED")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === "USED" 
                            ? "bg-purple-500 text-white shadow-lg" 
                            : "text-gray-400 hover:text-white"
                        }`}
                    >
                        <Archive size={16} />
                        فروخته شده ({stats.used})
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Form (Only visible in AVAILABLE tab or always visible? Let's keep it visible) */}
                <div className="lg:col-span-1">
                    <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl sticky top-8">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Plus size={18} className="text-cyan-400" /> شارژ انبار
                        </h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="relative">
                                <textarea
                                    value={newLink}
                                    onChange={(e) => setNewLink(e.target.value)}
                                    placeholder="لینک‌ها را اینجا Paste کنید..."
                                    // اصلاح مشکل راست‌چین بودن لینک‌ها
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white text-sm focus:border-cyan-500 focus:outline-none min-h-[200px] font-mono dir-ltr text-left placeholder:text-right"
                                    style={{ direction: 'ltr', textAlign: 'left' }}
                                />
                                <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-[10px] text-gray-400">
                                    هر خط یک لینک
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={adding || !newLink.trim()}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-cyan-500/20"
                            >
                                {adding ? <Loader2 className="animate-spin" size={18}/> : "افزودن به انبار"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="bg-[#1e293b] rounded-3xl border border-white/5 overflow-hidden shadow-xl flex flex-col min-h-[500px]">
                        <div className="p-5 border-b border-white/5 bg-[#0f172a]/30 flex justify-between items-center">
                            <h3 className="font-bold text-gray-200">
                                {activeTab === "AVAILABLE" ? "لیست لینک‌های آماده فروش" : "آرشیو لینک‌های فروخته شده"}
                            </h3>
                            <span className="text-xs text-gray-500">صفحه {page} از {pagination.totalPages}</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-3">
                                    <Loader2 className="animate-spin text-cyan-400" size={32} />
                                    <span>در حال بارگذاری...</span>
                                </div>
                            ) : links.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                                    <p>موردی یافت نشد.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {links.map((link) => (
                                        <div key={link.id} className="p-4 hover:bg-white/5 transition-colors group">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    {/* Link URL */}
                                                    <div className="bg-[#0f172a] p-3 rounded-lg border border-white/5 font-mono text-xs text-cyan-300 break-all dir-ltr text-left mb-2 select-all">
                                                        {link.url}
                                                    </div>
                                                    
                                                    {/* Meta Info */}
                                                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
                                                        <span className="font-mono">
                                                            {new Date(link.createdAt).toLocaleDateString('fa-IR')}
                                                        </span>
                                                        
                                                        {link.status === "USED" && link.order && (
                                                            <>
                                                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                                                <span className="flex items-center gap-1 text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/10">
                                                                    <User size={10} />
                                                                    {link.order.customerEmail || "مشتری"}
                                                                </span>
                                                                <span className="font-mono text-gray-400">
                                                                    #{link.order.trackingCode}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(link.id)}
                                                    className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    title="حذف"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="p-4 border-t border-white/5 bg-[#0f172a]/30 flex justify-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                >
                                    <ArrowRight size={18} />
                                </button>
                                <span className="px-4 py-2 bg-white/5 rounded-lg text-sm font-mono">{page}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={page === pagination.totalPages}
                                    className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}