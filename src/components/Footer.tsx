"use client";

import Link from "next/link";
import { Brain, Instagram, Send, Shield, CreditCard, CheckCircle } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0b1120] border-t border-white/5 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-right">
                    
                    {/* ستون ۱: درباره ما */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                                <Brain size={20} />
                            </div>
                            <span className="text-xl font-bold text-white">Perplexity Pro</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            دسترسی حرفه‌ای به مدل‌های پیشرفته هوش مصنوعی. تجربه‌ای سریع، امن و قانونی برای کاربران ایرانی.
                        </p>
                        
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-gradient-to-tr hover:from-purple-500 hover:to-pink-500 hover:text-white hover:-translate-y-1 group">
                                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-cyan-500 hover:text-white hover:-translate-y-1 group">
                                <Send size={20} className="group-hover:scale-110 transition-transform relative left-[-1px] top-[1px]" />
                            </a>
                        </div>
                    </div>
                    
                    {/* ستون ۲: دسترسی سریع */}
                    <div>
                        <h4 className="font-bold text-white mb-6">دسترسی سریع</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link href="/#features" className="hover:text-cyan-400 transition-colors">ویژگی‌ها</Link></li>
                            <li><Link href="/#pricing" className="hover:text-cyan-400 transition-colors">قیمت‌ها</Link></li>
                            <li><Link href="/track" className="hover:text-cyan-400 transition-colors">پیگیری سفارش</Link></li>
                            <li><Link href="/#faq" className="hover:text-cyan-400 transition-colors">سوالات متداول</Link></li>
                        </ul>
                    </div>

                    {/* ستون ۳: قوانین و پشتیبانی */}
                    <div>
                        <h4 className="font-bold text-white mb-6">قوانین و پشتیبانی</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">تماس با ما</Link></li>
                            <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">قوانین و مقررات</Link></li>
                            <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">حریم خصوصی</Link></li>
                        </ul>
                    </div>

                    {/* ستون ۴: مجوزها (✅ کد اینماد اضافه شد) */}
                    <div>
                        <h4 className="font-bold text-white mb-6">مجوزها و امنیت</h4>
                        <div className="flex flex-wrap gap-3">
                            
                            {/* کد اینماد */}
                            <div className="bg-white p-2 rounded-xl w-fit cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center">
                                <a 
                                    referrerPolicy="origin" 
                                    target="_blank" 
                                    href="https://trustseal.enamad.ir/?id=682960&Code=jkhHkkjPdCAnkpLakFic0YfC3Aizfc89"
                                >
                                    <img 
                                        referrerPolicy="origin" 
                                        src="https://trustseal.enamad.ir/logo.aspx?id=682960&Code=jkhHkkjPdCAnkpLakFic0YfC3Aizfc89" 
                                        alt="نماد اعتماد الکترونیکی" 
                                        style={{ cursor: 'pointer' }}
                                        // @ts-ignore
                                        code="jkhHkkjPdCAnkpLakFic0YfC3Aizfc89"
                                    />
                                </a>
                            </div>

                            {/* جایگاه نماد زرین‌پال */}
                            <div className="bg-white p-2 rounded-xl w-fit cursor-pointer hover:opacity-90 transition-opacity">
                                <div className="w-[110px] h-[110px] flex flex-col items-center justify-center border-2 border-gray-100 rounded-lg text-gray-400 text-[10px] text-center">
                                    <CreditCard size={24} className="mb-1 opacity-50 text-yellow-500"/>
                                    زرین‌پال
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                
                <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© ۱۴۰۳ تمامی حقوق برای <strong className="text-white">Perplexity Pro</strong> محفوظ است.</p>
                    <p className="text-xs opacity-50">Design & Dev by <span className="text-cyan-500">Behnam R</span></p>
                </div>
            </div>
        </footer>
    );
}