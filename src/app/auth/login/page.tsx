"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Brain, Lock, Loader2, Mail } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("ایمیل یا رمز عبور اشتباه است");
            } else {
                router.push("/admin/dashboard");
            }
        } catch (err) {
            setError("خطایی رخ داد");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 text-white font-sans selection:bg-cyan-500/30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg max-h-lg bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.4)] mb-4 transform rotate-6 hover:rotate-0 transition-all duration-500">
                        <Brain size={36} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">ورود مدیران</h1>
                    <p className="text-gray-400 text-sm">به پنل مدیریت Perplexity Pro خوش آمدید</p>
                </div>

                <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center animate-pulse">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">ایمیل</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3.5 pl-10 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-600 text-left dir-ltr"
                                    placeholder="admin@example.com"
                                    required
                                />
                                <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">رمز عبور</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3.5 pl-10 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-600 text-left dir-ltr"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>در حال ورود...</span>
                                </>
                            ) : (
                                <span>ورود به پنل</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}