"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Ticket, User, Calendar, ShoppingBag, Eye } from "lucide-react";

export default function CouponDetailsPage() {
    const { id } = useParams();
    const [coupon, setCoupon] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/admin/coupons/${id}`)
            .then(res => res.json())
            .then(data => {
                setCoupon(data);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="p-10 text-center text-gray-500">در حال بارگذاری...</div>;
    if (!coupon || coupon.error) return <div className="p-10 text-center text-red-400">کد تخفیف یافت نشد.</div>;

    return (
        <div className="animate-fade-in max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/coupons" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                    <ArrowRight size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-2">
                        <Ticket className="text-cyan-400"/>
                        تاریخچه کد: <span className="font-mono text-cyan-300">{coupon.code}</span>
                    </h1>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1e293b] border border-white/5 p-6 rounded-2xl">
                    <p className="text-gray-400 text-xs mb-1">نوع تخفیف</p>
                    <p className="text-xl font-bold text-white">
                        {coupon.type === "PERCENTAGE" ? `${coupon.value}٪` : `${coupon.value.toLocaleString()} تومان`}
                    </p>
                </div>
                <div className="bg-[#1e293b] border border-white/5 p-6 rounded-2xl">
                    <p className="text-gray-400 text-xs mb-1">تعداد استفاده</p>
                    <p className="text-xl font-bold text-white">
                        {coupon.usedCount} <span className="text-sm text-gray-500 font-normal">/ {coupon.maxUses || "∞"}</span>
                    </p>
                </div>
                <div className="bg-[#1e293b] border border-white/5 p-6 rounded-2xl">
                    <p className="text-gray-400 text-xs mb-1">وضعیت</p>
                    <p className={`text-xl font-bold ${coupon.isActive ? "text-emerald-400" : "text-red-400"}`}>
                        {coupon.isActive ? "فعال" : "غیرفعال"}
                    </p>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
                <div className="p-5 border-b border-white/5 flex items-center gap-2">
                    <ShoppingBag size={18} className="text-gray-400"/>
                    <h3 className="font-bold text-white">لیست سفارش‌های استفاده شده ({coupon.orders.length})</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                        <thead className="bg-[#0f172a] text-gray-400">
                            <tr>
                                <th className="p-4">کاربر</th>
                                <th className="p-4">تاریخ</th>
                                <th className="p-4">مبلغ اصلی</th>
                                <th className="p-4">مبلغ پرداختی (با تخفیف)</th>
                                <th className="p-4 text-center">مشاهده</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {coupon.orders.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">هنوز هیچ استفاده‌ای نشده است.</td></tr>
                            ) : (
                                coupon.orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                                    <User size={14}/>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-xs">
                                                        {order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}` : "مهمان"}
                                                    </span>
                                                    <span className="text-gray-500 text-[10px] dir-ltr text-right">
                                                        {order.customerPhone || order.customerEmail}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 font-mono text-xs">
                                            {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                                        </td>
                                        <td className="p-4 text-gray-500 line-through decoration-red-500/50">
                                            {(order.originalAmount || order.amount).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-emerald-400 font-bold">
                                            {order.amount.toLocaleString()} <span className="text-[10px] font-normal text-gray-500">تومان</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Link 
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}