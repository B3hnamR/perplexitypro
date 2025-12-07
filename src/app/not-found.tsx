import Link from "next/link";
import { Search, Home, ArrowRight, Brain } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد | Perplexity Pro",
  description: "صفحه مورد نظر شما وجود ندارد.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* 404 Graphic */}
        <div className="relative mb-8 mx-auto w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="bg-[#1e293b] border border-white/10 p-6 rounded-3xl shadow-2xl relative">
                <Search size={48} className="text-cyan-400" />
                <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg border-2 border-[#0f172a]">
                    404
                </div>
            </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          صفحه مورد نظر <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">پیدا نشد</span>
        </h1>
        
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه حذف شده باشد.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            <Home size={20} />
            بازگشت به خانه
          </Link>

          <Link 
            href="/contact" 
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-8 py-3.5 rounded-xl font-medium transition-all"
          >
            تماس با پشتیبانی <ArrowRight size={18} />
          </Link>
        </div>

        {/* Footer Text */}
        <div className="mt-12 flex items-center justify-center gap-2 text-gray-500 text-sm opacity-60">
            <Brain size={14} />
            <span>Perplexity Pro</span>
        </div>
      </div>
    </div>
  );
}