import Link from "next/link";

export default function PaymentResultPage({
    searchParams,
}: {
    searchParams: { status?: string; message?: string; orderId?: string };
}) {
    const status = searchParams.status || "unknown";
    const message = decodeURIComponent(searchParams.message || "");
    const orderId = searchParams.orderId;

    const isSuccess = status === "success";

    return (
        <main className="min-h-screen bg-[#0f172a] text-white font-sans flex items-center justify-center px-4 py-16">
            <div className="max-w-xl w-full bg-[#111827] border border-white/10 rounded-3xl p-8 text-center shadow-2xl shadow-cyan-500/10">
                <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-2xl mb-6 ${isSuccess ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    {isSuccess ? "✓" : "!"}
                </div>
                <h1 className="text-2xl font-black mb-4">
                    {isSuccess ? "پرداخت موفق بود" : "پرداخت ناموفق بود"}
                </h1>
                {orderId && (
                    <p className="text-sm text-gray-400 mb-2">
                        کد سفارش: <span className="text-white font-bold">{orderId}</span>
                    </p>
                )}
                {message && (
                    <p className="text-gray-300 mb-6 leading-relaxed">{message}</p>
                )}
                {!message && !isSuccess && (
                    <p className="text-gray-400 mb-6">پرداخت توسط کاربر لغو شد یا خطایی رخ داد.</p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="flex-1 min-w-[140px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold transition-all text-center"
                    >
                        بازگشت به خانه
                    </Link>
                    <Link
                        href="/contact"
                        className="flex-1 min-w-[140px] bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-all text-center border border-white/10"
                    >
                        تماس با پشتیبانی
                    </Link>
                </div>
            </div>
        </main>
    );
}
