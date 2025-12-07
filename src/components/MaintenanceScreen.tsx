import { Hammer, RefreshCw } from "lucide-react";

export default function MaintenanceScreen() {
    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 text-center z-[9999] relative">
            <div className="w-24 h-24 bg-yellow-500/10 rounded-3xl flex items-center justify-center mb-8 border border-yellow-500/20 animate-pulse">
                <Hammer className="text-yellow-500" size={48} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4">سایت در دست تعمیر است</h1>
            <p className="text-gray-400 max-w-lg text-lg leading-relaxed mb-8">
                در حال به‌روزرسانی زیرساخت‌ها هستیم تا تجربه‌ای بهتر برای شما بسازیم.
                <br/>لطفاً ساعاتی دیگر مراجعه کنید.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <RefreshCw size={16} className="animate-spin" />
                در حال انجام عملیات...
            </div>
        </div>
    );
}