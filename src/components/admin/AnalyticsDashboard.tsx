"use client";

import { useEffect, useState } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, Legend
} from "recharts";
import {
    TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart,
    Activity, Package, AlertTriangle, Download, Calendar
} from "lucide-react";
import axios from "axios";

export default function AnalyticsDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("/api/admin/analytics");
            setData(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!data) return;
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Date,Sales\n"
            + data.charts.sales.map((e: any) => `${e.date},${e.sales}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sales_report.csv");
        document.body.appendChild(link);
        link.click();
    };

    if (loading) return <div className="p-10 text-center text-gray-400">در حال تحلیل داده‌ها...</div>;
    if (!data) return <div className="p-10 text-center text-red-400">خطا در دریافت اطلاعات</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white">داشبورد هوشمند</h2>
                    <p className="text-gray-400 text-sm">گزارش جامع وضعیت فروشگاه</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#334155] text-gray-300 px-4 py-2 rounded-xl transition-colors border border-white/5 text-sm">
                        <Calendar size={16} /> 30 روز گذشته
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-xl transition-colors border border-cyan-500/20 text-sm">
                        <Download size={16} /> خروجی اکسل
                    </button>
                </div>
            </div>

            {/* 1. Top Cards (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="فروش کل"
                    value={`${data.financials.totalRevenue.toLocaleString()} ت`}
                    icon={DollarSign}
                    trend={data.financials.growthRate}
                    color="cyan"
                />
                <KPICard
                    title="میانگین سفارش (AOV)"
                    value={`${Math.round(data.financials.aov).toLocaleString()} ت`}
                    icon={ShoppingCart}
                    subtext="ارزش هر کاربر"
                    color="purple"
                />
                <KPICard
                    title="نرخ تبدیل"
                    value={`${data.funnel.rate.toFixed(1)}%`}
                    icon={Activity}
                    subtext={`${data.funnel.paid} از ${data.funnel.total} سفارش`}
                    color="emerald"
                />
                <KPICard
                    title="وضعیت انبار"
                    value={`${data.inventory.available} عدد`}
                    icon={Package}
                    subtext={data.inventory.daysRemaining < 7 ? "⚠️ نیاز به شارژ فوری" : `${data.inventory.daysRemaining} روز تا اتمام`}
                    color={data.inventory.daysRemaining < 7 ? "red" : "blue"}
                />
            </div>

            {/* 2. Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">روند فروش (۳۰ روز اخیر)</h3>
                    <div className="h-[300px] w-full dir-ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.charts.sales}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(str) => str.slice(5)} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                    formatter={(value: number) => [`${value.toLocaleString()} تومان`, "فروش"]}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Funnel / Marketing */}
                <div className="space-y-6">
                    {/* Marketing Codes */}
                    <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl h-full">
                        <h3 className="text-lg font-bold text-white mb-4">برترین کدهای تخفیف</h3>
                        <div className="space-y-4">
                            {data.marketing.topCoupons.length === 0 ? (
                                <p className="text-gray-500 text-sm">هنوز کدی استفاده نشده است.</p>
                            ) : (
                                data.marketing.topCoupons.map((coupon: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center bg-[#0f172a] p-3 rounded-xl">
                                        <div>
                                            <span className="text-cyan-400 font-mono font-bold block">{coupon.code}</span>
                                            <span className="text-gray-500 text-xs">{coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `${coupon.value}T`}</span>
                                        </div>
                                        <div className="text-white font-bold text-sm bg-white/10 px-2 py-1 rounded-lg">
                                            {coupon.usedCount} استفاده
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Bottom Row: Customers & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Customers */}
                <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Users className="text-purple-400" size={20} /> مشتریان وفادار
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                            <thead className="text-gray-500 border-b border-white/5">
                                <tr>
                                    <th className="pb-3">ایمیل</th>
                                    <th className="pb-3">تعداد خرید</th>
                                    <th className="pb-3 text-left">مجموع خرید</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.customers.topSpenders.map((user: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="py-3 text-gray-300 font-mono dir-ltr text-right">{user.customerEmail || "Guest"}</td>
                                        <td className="py-3 text-white">{user._count.id}</td>
                                        <td className="py-3 text-emerald-400 font-bold dir-ltr text-left">{(user._sum.amount || 0).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity Logs */}
                <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="text-blue-400" size={20} /> آخرین فعالیت‌ها
                    </h3>
                    <div className="space-y-0 relative">
                        {/* Timeline line */}
                        <div className="absolute top-0 bottom-0 right-2 w-0.5 bg-white/5"></div>

                        {data.logs.length === 0 ? (
                            <p className="text-gray-500 text-sm">هنوز فعالیتی ثبت نشده است.</p>
                        ) : (
                            data.logs.map((log: any, idx: number) => (
                                <div key={idx} className="relative pr-8 py-3">
                                    <div className="absolute right-0 top-4 w-4 h-4 bg-[#1e293b] border-2 border-cyan-500 rounded-full z-10"></div>
                                    <p className="text-white text-sm font-medium">{log.action}</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        توسط <span className="text-cyan-400">{log.adminEmail}</span> • {new Date(log.createdAt).toLocaleTimeString('fa-IR')}
                                    </p>
                                </div>
                            ))
                        )}

                        {/* Dummy data for preview if empty */}
                        {data.logs.length === 0 && (
                            <div className="opacity-50 blur-[1px]">
                                <div className="relative pr-8 py-3">
                                    <div className="absolute right-0 top-4 w-4 h-4 bg-[#1e293b] border-2 border-gray-500 rounded-full z-10"></div>
                                    <p className="text-white text-sm">ورود به پنل</p>
                                    <p className="text-gray-500 text-xs mt-1">System • همین الان</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, icon: Icon, trend, subtext, color }: any) {
    const colorClasses: any = {
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        red: "text-red-400 bg-red-500/10 border-red-500/20",
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    };

    return (
        <div className={`p-6 rounded-3xl border ${colorClasses[color] || colorClasses.cyan} transition-transform hover:scale-[1.02]`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className={`text-2xl font-black ${colorClasses[color]?.split(" ")[0]}`}>{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
            {(trend !== undefined || subtext) && (
                <div className="flex items-center gap-2 text-xs">
                    {trend !== undefined && (
                        <span className={`flex items-center gap-1 font-bold ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {Math.abs(trend).toFixed(1)}%
                        </span>
                    )}
                    <span className="text-gray-500">{subtext || "نسبت به ماه قبل"}</span>
                </div>
            )}
        </div>
    );
}