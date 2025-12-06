"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ShoppingBag, CheckCircle, Clock, XCircle, Loader2, Download } from "lucide-react";
import Link from "next/link";

interface Order {
    id: string;
    trackingCode: string;
    amount: number;
    status: string;
    createdAt: string;
    downloadToken: string | null;
}

export default function ProfileClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
            return;
        }
        if (status === "authenticated") {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/user/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PAID": return <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> موفق</span>;
            case "PENDING": return <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12} /> در انتظار</span>;
            default: return <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12} /> ناموفق</span>;
        }
    };

    const handlePreOrder = () => {
        router.push("/cart");
    };

    if (status === "loading" || loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-cyan-400"><Loader2 className="animate-spin" size={40} /></div>;

    return (
        <main className="min-h-screen bg-[#0f172a] font-sans text-white pb-20">
            <Navbar onPreOrder={handlePreOrder} />
            
            <div className="pt-32 max-w-4xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">حساب کاربری</h1>
                        <p className="text-gray-400 text-sm">تاریخچه سفارشات و لایسنس‌های شما</p>
                    </div>
                    <div className="bg-[#1e293b] px-4 py-2 rounded-xl border border-white/10 text-sm flex items-center gap-2">
                        <span className="text-gray-400">شماره موبایل:</span> 
                        {/* ✅ اصلاح تایپ‌اسکریپت: استفاده از as any */}
                        <span className="text-white font-mono dir-ltr">{(session?.user as any)?.mobile}</span>
                    </div>
                </div>

                <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    {orders.length === 0 ? (
                        <div className="p-10 text-center text-gray-500 flex flex-col items-center gap-4">
                            <ShoppingBag size={48} className="opacity-50" />
                            <p>هنوز سفارشی ثبت نکرده‌اید.</p>
                            <Link href="/" className="text-cyan-400 hover:underline text-sm">مشاهده محصولات</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {orders.map((order) => (
                                <div key={order.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/10 font-bold text-lg ${order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#0f172a] text-gray-400'}`}>
                                            {order.status === 'PAID' ? '✓' : '#'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white mb-1 flex items-center gap-2">
                                                سفارش <span className="font-mono text-cyan-400">{order.trackingCode}</span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString('fa-IR')} • {order.amount.toLocaleString()} تومان
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                        {getStatusBadge(order.status)}
                                        
                                        {order.status === "PAID" && order.downloadToken && (
                                            <Link 
                                                href={`/delivery/${order.downloadToken}`}
                                                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
                                            >
                                                <Download size={14} /> مشاهده لایسنس
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}