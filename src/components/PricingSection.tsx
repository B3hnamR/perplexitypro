const UsageProgressCard = () => {
    return (
        <div className="relative max-w-4xl mx-auto mb-24 animate-fade-in">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] blur-xl opacity-30"></div>
            <div className="relative bg-[#0f172a] border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden group">
                
                {/* پس‌زمینه زنده */}
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-all duration-1000"></div>

                <div className="z-10 flex-1 text-center md:text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        فعال‌سازی آنی و خودکار
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
                        چرا محدودیت؟ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">آزادانه</span> جستجو کنید.
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                        نسخه رایگان فقط نوک کوه یخ است. با نسخه پرو، موتور جستجوی شما به یک ابررایانه تبدیل می‌شود. دسترسی نامحدود به GPT-5 و Claude 3، تحلیل فایل‌های سنگین و جستجوی عمیق بدون وقفه.
                    </p>
                </div>

                <div className="relative z-10 flex-shrink-0">
                    <div className="w-full md:w-auto bg-white/5 border border-white/10 rounded-2xl p-1 flex items-center backdrop-blur-md">
                         <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg shadow-lg flex items-center gap-2">
                            <Zap size={20} className="fill-white" />
                            قدرت نهایی
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};