"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Ticket, Loader2, Edit2, X } from "lucide-react";
import axios from "axios";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [form, setForm] = useState({
        code: "",
        type: "PERCENTAGE",
        value: 0,
        minOrderPrice: 0,
        maxDiscount: 0,
        maxUses: 0,
        maxUsesPerUser: 0, // ✅
        isActive: true
    });

    useEffect(() => { fetchCoupons(); }, []);

    const fetchCoupons = () => {
        axios.get("/api/admin/coupons").then(res => {
            setCoupons(res.data);
            setLoading(false);
        });
    };

    const handleEdit = (coupon: any) => {
        setEditId(coupon.id);
        setForm({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minOrderPrice: coupon.minOrderPrice || 0,
            maxDiscount: coupon.maxDiscount || 0,
            maxUses: coupon.maxUses || 0,
            maxUsesPerUser: coupon.maxUsesPerUser || 0, // ✅
            isActive: coupon.isActive
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setForm({ code: "", type: "PERCENTAGE", value: 0, minOrderPrice: 0, maxDiscount: 0, maxUses: 0, maxUsesPerUser: 0, isActive: true });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            await axios.post("/api/admin/coupons", { ...form, id: editId });
            fetchCoupons();
            handleCancelEdit();
            alert(editId ? "کد تخفیف ویرایش شد" : "کد تخفیف ساخته شد");
        } catch (err) {
            alert("خطا در ذخیره سازی");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("حذف شود؟")) return;
        await axios.delete(`/api/admin/coupons?id=${id}`);
        setCoupons(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-3 mb-8">
                <Ticket className="text-cyan-400" size={32} />
                <h1 className="text-3xl font-black text-white">مدیریت کدهای تخفیف</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl sticky top-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            {editId ? <Edit2 size={18} className="text-yellow-400" /> : <Plus size={18} className="text-cyan-400" />}
                            {editId ? "ویرایش کد" : "افزودن کد جدید"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">کد تخفیف</label>
                                <input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })}
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2 text-white dir-ltr text-left font-bold tracking-widest uppercase focus:border-cyan-500 focus:outline-none"
                                    placeholder="NEWYEAR" required />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">نوع</label>
                                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-2 py-2 text-white text-sm focus:outline-none">
                                        <option value="PERCENTAGE">درصدی (%)</option>
                                        <option value="FIXED">مبلغ ثابت</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">مقدار</label>
                                    <input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-white dir-ltr text-left focus:outline-none" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">حداقل خرید</label>
                                    <input type="number" value={form.minOrderPrice} onChange={e => setForm({ ...form, minOrderPrice: Number(e.target.value) })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-white dir-ltr text-left focus:outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">سقف تخفیف</label>
                                    <input type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-white dir-ltr text-left focus:outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">تعداد کل مجاز</label>
                                    <input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: Number(e.target.value) })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-white dir-ltr text-left focus:outline-none" placeholder="∞" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">سقف برای هر نفر</label>
                                    <input type="number" value={form.maxUsesPerUser} onChange={e => setForm({ ...form, maxUsesPerUser: Number(e.target.value) })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-white dir-ltr text-left focus:outline-none border-dashed border-cyan-500/50" placeholder="∞" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-cyan-500" />
                                <span className="text-sm text-gray-300">کد فعال باشد</span>
                            </div>

                            <div className="flex gap-2 pt-2">
                                {editId && (
                                    <button type="button" onClick={handleCancelEdit} className="bg-white/10 hover:bg-white/20 text-white px-3 rounded-xl transition-colors">
                                        <X size={18} />
                                    </button>
                                )}
                                <button disabled={isAdding} className={`flex-1 ${editId ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-cyan-600 hover:bg-cyan-500'} text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2`}>
                                    {isAdding ? <Loader2 className="animate-spin" size={18} /> : (editId ? "ذخیره تغییرات" : "ساخت کد")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="bg-[#1e293b] rounded-3xl border border-white/5 overflow-hidden">
                        <div className="divide-y divide-white/5">
                            {loading ? <div className="p-8 text-center text-gray-500">در حال بارگذاری...</div> : (coupons.length === 0 ? <div className="p-8 text-center text-gray-500">هیچ کدی وجود ندارد</div> :
                                coupons.map(c => (
                                    <div key={c.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-white font-bold text-lg">{c.code}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded ${c.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>{c.isActive ? "فعال" : "غیرفعال"}</span>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 flex gap-3 flex-wrap">
                                                <span>{c.type === "PERCENTAGE" ? `${c.value}%` : `${c.value.toLocaleString()} T`}</span>
                                                <span>• کل: {c.usedCount} / {c.maxUses || "∞"}</span>
                                                {c.maxUsesPerUser ? <span className="text-cyan-400 font-bold">• هر نفر: {c.maxUsesPerUser} بار</span> : null}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(c)} className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}