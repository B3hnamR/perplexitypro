"use client";

import { useState, useEffect } from "react";
import { Save, Megaphone, Tag, Layout, Power, Trash2, Plus, Edit2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

export default function SettingsPage() {
    const [maintenance, setMaintenance] = useState(false);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form State
    const [form, setForm] = useState({
        id: "",
        type: "BANNER",
        title: "",
        message: "",
        link: "",
        linkText: "",
        isActive: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [settingsRes, announcementsRes] = await Promise.all([
                axios.get("/api/admin/settings"),
                axios.get("/api/admin/announcements")
            ]);
            setMaintenance(settingsRes.data.maintenance);
            setAnnouncements(announcementsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleMaintenance = async () => {
        const newState = !maintenance;
        setMaintenance(newState);
        await axios.post("/api/admin/settings", { maintenance: newState });
    };

    const handleSaveAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post("/api/admin/announcements", form);
        resetForm();
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if(!confirm("حذف شود؟")) return;
        await axios.delete(`/api/admin/announcements?id=${id}`);
        fetchData();
    };

    const handleEdit = (item: any) => {
        setForm(item);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setForm({ id: "", type: "BANNER", title: "", message: "", link: "", linkText: "", isActive: true });
        setIsEditing(false);
    };

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* --- Maintenance Section --- */}
            <div className={`p-6 rounded-3xl border transition-colors ${maintenance ? "bg-red-500/10 border-red-500/30" : "bg-[#1e293b] border-white/5"}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <Power className={maintenance ? "text-red-500" : "text-emerald-500"} />
                            حالت تعمیرات
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {maintenance 
                                ? "⛔ سایت هم‌اکنون برای کاربران عادی از دسترس خارج است." 
                                : "✅ سایت در دسترس عموم است."}
                        </p>
                    </div>
                    <button 
                        onClick={toggleMaintenance}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            maintenance 
                            ? "bg-red-500 text-white shadow-lg shadow-red-500/20" 
                            : "bg-white/5 text-gray-300 hover:bg-emerald-500 hover:text-white"
                        }`}
                    >
                        {maintenance ? "غیرفعال کردن" : "فعال کردن تعمیرات"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Form Section --- */}
                <div className="lg:col-span-1">
                    <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 sticky top-6">
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                            {isEditing ? <Edit2 size={18} className="text-yellow-400"/> : <Plus size={18} className="text-cyan-400"/>}
                            {isEditing ? "ویرایش اعلان" : "افزودن اعلان جدید"}
                        </h3>

                        <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">نوع نمایش</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: "BANNER", icon: Layout, label: "نوار بالا" },
                                        { id: "MODAL_DISCOUNT", icon: Tag, label: "تخفیف" },
                                        { id: "MODAL_NEWS", icon: Megaphone, label: "خبر" },
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setForm({...form, type: type.id})}
                                            className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all text-xs ${
                                                form.type === type.id 
                                                ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" 
                                                : "bg-[#0f172a] border-white/5 text-gray-400 hover:bg-white/5"
                                            }`}
                                        >
                                            <type.icon size={18} />
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {form.type !== "BANNER" && (
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">عنوان (برای پاپ‌آپ)</label>
                                    <input 
                                        type="text" 
                                        value={form.title} 
                                        onChange={e => setForm({...form, title: e.target.value})}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="مثلاً: جشنواره پاییزه"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">متن پیام</label>
                                <textarea 
                                    value={form.message} 
                                    onChange={e => setForm({...form, message: e.target.value})}
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2 text-white focus:border-cyan-500 focus:outline-none min-h-[100px]"
                                    placeholder="متن اصلی اعلان..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">لینک دکمه</label>
                                    <input 
                                        type="text" 
                                        value={form.link} 
                                        onChange={e => setForm({...form, link: e.target.value})}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-white dir-ltr text-left focus:border-cyan-500 focus:outline-none"
                                        placeholder="/pricing"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">متن دکمه</label>
                                    <input 
                                        type="text" 
                                        value={form.linkText} 
                                        onChange={e => setForm({...form, linkText: e.target.value})}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="مشاهده"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input 
                                    type="checkbox" 
                                    checked={form.isActive} 
                                    onChange={e => setForm({...form, isActive: e.target.checked})} 
                                    className="w-4 h-4 accent-cyan-500"
                                />
                                <span className="text-sm text-gray-300">نمایش در سایت</span>
                            </div>

                            <div className="flex gap-2 pt-2">
                                {isEditing && (
                                    <button type="button" onClick={resetForm} className="bg-white/10 hover:bg-white/20 text-white px-3 rounded-xl transition-colors">
                                        <XCircle size={20} />
                                    </button>
                                )}
                                <button type="submit" className={`flex-1 ${isEditing ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-cyan-600 hover:bg-cyan-500'} text-white py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2`}>
                                    <Save size={18}/> {isEditing ? "ذخیره تغییرات" : "ایجاد اعلان"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- List Section --- */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Megaphone size={18} className="text-purple-400"/> لیست اعلانات
                    </h3>
                    
                    {loading ? <p className="text-gray-500">در حال بارگذاری...</p> : 
                     announcements.length === 0 ? <p className="text-gray-500">هیچ اعلانی وجود ندارد.</p> : (
                        <div className="grid gap-4">
                            {announcements.map(item => (
                                <div key={item.id} className={`bg-[#1e293b] p-4 rounded-2xl border flex items-center justify-between group ${item.isActive ? "border-emerald-500/30" : "border-white/5 opacity-60"}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#0f172a] flex items-center justify-center text-gray-400">
                                            {item.type === 'BANNER' && <Layout size={20}/>}
                                            {item.type === 'MODAL_DISCOUNT' && <Tag size={20}/>}
                                            {item.type === 'MODAL_NEWS' && <Megaphone size={20}/>}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-white text-sm">{item.title || "بدون عنوان (نوار بالا)"}</span>
                                                <span className={`text-[10px] px-2 rounded-md ${item.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                                                    {item.isActive ? "فعال" : "غیرفعال"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 line-clamp-1">{item.message}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg"><Edit2 size={16}/></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}