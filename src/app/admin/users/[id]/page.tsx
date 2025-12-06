"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User, Phone, Mail, Calendar, ShoppingBag, CheckCircle, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function UserDetailsPage() {
    const { id } = useParams();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/admin/users/${id}`)
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="p-10 text-center text-gray-500">در حال بارگذاری...</div>;
    if (!user || user.error) return <div className="p-10 text-center text-red-400">کاربر یافت نشد.</div>;

    return (
        <div className="animate-fade-in max-w-5xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/users" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                    <ArrowRight size={20} />
                </Link>
                <h1 className="text-2xl font-black text-white">پروفایل کاربر</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* اطلاعات کاربری */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6 shadow-lg text-center">
                        <div className="w-20 h-20 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold border border-cyan-500/20">
                            {(user.firstName?.[0] || user.lastName?.[0]) || <User />}
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">
                            {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">کاربر عادی</p>
                        
                        <div className="space-y-3 text-right">
                            <div className="bg-[#0f172a] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                                <span className="text-gray-400 text-xs flex items-center gap-1"><Phone size={12}/> موبایل</span>
                                <span className="text-white dir-ltr font-mono text-sm">{user.mobile}</span>
                            </div>
                            <div className="bg-[#0f172a] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                                <span className="text-gray-400 text-xs flex items-center gap-1"><Mail size={12}/> ایمیل</span>
                                <span className="text-white font-mono text-xs truncate max-w-[150px]">{user.email || "---"}</span>
                            </div>
                            <div className="bg-[#0f172a] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                                <span className="text-gray-400 text-xs flex items-center gap-1"><Calendar size={12}/> عضویت</span>
                                <span className="text-white text-xs">{new Date(user.createdAt).toLocaleDateString('fa-IR')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* تاریخچه سفارشات و لینک‌ها */}
                <div className="lg:col-span-2">
                    <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6 shadow-lg min-h-[400px]">
                        <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                            <ShoppingBag className="text-purple-400" size={20} />
                            تاریخچه سفارش‌ها ({user.orders.length})
                        </h3>

                        {user.orders.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">هیچ سفارشی ثبت نشده است.</div>
                        ) : (
                            <div className="space-y-4">
                                {user.orders.map((order: any) => (
                                    <div key={order.id} className="bg-[#0f172a] border border-white/5 rounded-xl overflow-hidden">
                                        {/* Order Header */}
                                        <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 mb-1">کد پیگیری: <span className="text-white font-mono">{order.trackingCode}</span></span>
                                                <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs px-2 py-1 rounded font-bold ${order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {order.status === 'PAID' ? 'پرداخت شده' : 'ناموفق'}
                                                </span>
                                                <p className="text-sm font-bold text-white mt-1">{order.amount.toLocaleString()} ت</p>
                                            </div>
                                        </div>

                                        {/* Links */}
                                        {order.links && order.links.length > 0 && (
                                            <div className="p-4 bg-black/20">
                                                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><CheckCircle size={10}/> لینک‌های تحویل شده:</p>
                                                <div className="space-y-2">
                                                    {order.links.map((link: any) => (
                                                        <div key={link.id} className="flex items-center justify-between bg-[#1e293b] p-2 rounded border border-white/5">
                                                            <code className="text-xs text-cyan-400 font-mono truncate dir-ltr">{link.url}</code>
                                                            <a href={link.url} target="_blank" className="text-gray-400 hover:text-white p-1">
                                                                <ExternalLink size={14} />
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}