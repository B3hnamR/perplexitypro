"use client";

import { useState } from 'react';
import { Search, Sparkles, Loader, Zap, Brain, Shield } from 'lucide-react';

export default function SmartSearchDemo() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult('');
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResponses = [
          "هوش مصنوعی مولد (Generative AI) شاخه‌ای از هوش مصنوعی است که می‌تواند محتوای جدیدی تولید کند.",
          "پرپلکسیتی (Perplexity) یک موتور پاسخگویی هوشمند است که با ترکیب جستجوی وب و مدل‌های زبانی پاسخ‌های دقیق می‌دهد."
      ];
      setResult(mockResponses[Math.floor(Math.random() * mockResponses.length)]);
    } catch (err) {
      setError('متاسفانه در برقراری ارتباط مشکلی پیش آمد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="demo" className="py-12 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Sparkles className="text-cyan-400 animate-pulse" />
              تجربه قدرت Gemini
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              همین حالا سوال خود را بپرسید و پاسخ هوشمند دریافت کنید.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="مثلاً: آینده هوش مصنوعی چگونه خواهد بود؟"
              className="w-full bg-[#0f172a] text-white border border-white/10 rounded-2xl px-6 py-4 pr-12 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <button 
              type="submit" 
              disabled={loading || !query}
              className="absolute left-2 top-2 bottom-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  <span>تحلیل...</span>
                </>
              ) : (
                <>
                  <Zap size={18} fill="currentColor" />
                  <span>بپرس ✨</span>
                </>
              )}
            </button>
          </form>

          {(result || error) && (
            <div className="bg-[#0f172a]/80 rounded-2xl p-6 border border-white/5 animate-fade-in text-right">
              {error ? (
                <div className="text-red-400 flex items-center gap-2">
                  <Shield size={18} />
                  {error}
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className="flex items-center gap-2 mb-3 text-cyan-400 text-sm font-medium">
                    <Brain size={16} />
                    <span>پاسخ هوش مصنوعی:</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap select-text">{result}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}