"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    Eye, Search, CheckCircle, XCircle, Clock, 
    ShoppingBag, Filter, ArrowUpDown, AlertTriangle, Package
} from "lucide-react";

interface User {
    firstName: string | null;
    lastName: string | null;
    mobile: string;
    email: string | null;
}

interface Order {
    id: string;
    customerEmail: string | null;
    customerPhone: string | null;
    amount: number;
    status: string;
    createdAt: string;
    trackingCode: string | null;
    links: any[];
    user: User | null;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sortOrder, setSortOrder] = useState("DESC");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/admin/orders"); 
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const processedOrders = orders
        .filter(order => {
            const searchTerm = search.toLowerCase();
            const userName = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.toLowerCase() : "";
            
            const matchesSearch = 
                (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm)) ||
                (order.id && order.id.includes(searchTerm)) ||
                (order.trackingCode && order.trackingCode.includes(searchTerm)) ||
                userName.includes(searchTerm);

            if (!matchesSearch) return false;

            if (statusFilter === "ALL") return true;
            if (statusFilter === "MANUAL") {
                return (order.status === "PAID" || order.status === "COMPLETED") && (!order.links || order.links.length === 0);
            }
            if (statusFilter === "PAID") {
                 return (order.status === "PAID" || order.status === "COMPLETED");
            }
            return order.status === statusFilter;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "DESC" ? dateB - dateA : dateA - dateB;
        });

    const getStatusBadge = (order: Order) => {
        const isManualDeliveryNeeded = (order.status === "PAID" || order.status === "COMPLETED") && (!order.links || order.links.length === 0);

        if (isManualDeliveryNeeded) {
            return <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit animate-pulse"><AlertTriangle size={12} /> نیازمند تحویل</span>;
        }

        switch (order.status) {
            case "PAID":
            case "COMPLETED": 
                return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12} /> تکمیل شده</span>;
            case "FAILED": 
                return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={12} /> ناموفق</span>;
            default: 
                return <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12} /> در انتظار</span>;
        }
    };

    const getCustomerName = (order: Order) => {
        if (order.user && (order.user.firstName || order.user.lastName)) {
            return `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim();
        }
        return order.customerPhone || order.customerEmail || "کاربر مهمان";
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-2">
                        <ShoppingBag className="text-cyan-400" />
                        مدیریت سفارش‌ها
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">لیست تمامی تراکنش‌ها و وضعیت تحویل</p>
                </div>
            </div>

            <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
                {/* Search Input - Fixed Icon Position */}
                <div className="relative w-full md:w-1/3 group">
                    <input 
                        type="text" 
                        placeholder="جستجو (نام، ایمیل، کد پیگیری)..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        // pl-10 یعنی پدینگ از چپ برای جا دادن آیکون
                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-2.5 px-4 pl-10 text-white focus:border-cyan-500 focus:outline-none transition-colors text-sm placeholder-gray-500"
                    />
                    {/* آیکون absolute left-3 برای قرارگیری دقیق در سمت چپ */}
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-cyan-500 transition-colors" size={18} />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="relative">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-[#0f172a] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-cyan-500 min-w-[160px]"
                        >
                            <option value="ALL">همه وضعیت‌ها</option>
                            <option value="PAID">پرداخت موفق</option>
                            <option value="MANUAL">🔸 نیازمند تحویل</option>
                            <option value="PENDING">در انتظار پرداخت</option>
                            <option value="FAILED">ناموفق</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>

                    <div className="relative">
                        <select 
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="appearance-none bg-[#0f172a] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-cyan-500 min-w-[140px]"
                        >
                            <option value="DESC">جدیدترین</option>
                            <option value="ASC">قدیمی‌ترین</option>
                        </select>
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            <div className="bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-[#0f172a] text-gray-400 font-medium border-b border-white/5">
                            <tr>
                                <th className="p-4 whitespace-nowrap">کد پیگیری</th>
                                <th className="p-4 whitespace-nowrap">مشتری</th>
                                <th className="p-4 whitespace-nowrap">مبلغ</th>
                                <th className="p-4 whitespace-nowrap">تاریخ</th>
                                <th className="p-4 whitespace-nowrap">وضعیت</th>
                                <th className="p-4 text-center whitespace-nowrap">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-gray-500">در حال بارگذاری اطلاعات...</td></tr>
                            ) : processedOrders.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
                                    <Package size={32} opacity={0.5} />
                                    <span>موردی یافت نشد.</span>
                                </td></tr>
                            ) : (
                                processedOrders.map((order) => {
                                    const isManual = (order.status === "PAID" || order.status === "COMPLETED") && (!order.links || order.links.length === 0);
                                    
                                    return (
                                        <tr key={order.id} className={`transition-colors ${isManual ? "bg-orange-500/5 hover:bg-orange-500/10" : "hover:bg-white/5"}`}>
                                            {/* کد پیگیری با دایرکشن LTR برای نمایش صحیح */}
                                            <td className="p-4 font-mono text-white font-bold dir-ltr text-right">
                                                {order.trackingCode || order.id.slice(0, 8)}
                                            </td>
                                            {/* نام مشتری با ساپورت نمایش درست شماره */}
                                            <td className="p-4 text-gray-300 font-medium truncate max-w-[200px]" title={order.customerEmail || ""}>
                                                {order.user && order.user.mobile ? (
                                                    <span className="dir-ltr inline-block">{getCustomerName(order)}</span>
                                                ) : (
                                                    getCustomerName(order)
                                                )}
                                            </td>
                                            <td className="p-4 text-cyan-400 font-bold">
                                                {(order.amount || 0).toLocaleString("fa-IR")} <span className="text-[10px] font-normal text-gray-500">تومان</span>
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                                            </td>
                                            <td className="p-4">{getStatusBadge(order)}</td>
                                            <td className="p-4 text-center">
                                                <Link 
                                                    href={`/admin/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                                                    title="مشاهده جزئیات"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="text-center text-xs text-gray-500">
                تعداد کل سفارش‌ها: {orders.length} | نمایش {processedOrders.length} مورد
            </div>
        </div>
    );
}