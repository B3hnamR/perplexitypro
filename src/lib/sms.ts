const SMSIR_API_KEY = process.env.SMSIR_API_KEY || "";
// یک عدد الکی می‌گذاریم چون فعلاً قالب ندارید، اما برای جلوگیری از خطا لازم است
const VERIFY_TEMPLATE_ID = Number(process.env.SMSIR_VERIFY_TEMPLATE_ID || 100000);

export async function sendOTP(mobile: string, code: string) {
    console.log("------------------------------------------------");
    console.log(`🚀 [SMS SIMULATION] Mobile: ${mobile} | Code: ${code}`);
    console.log("------------------------------------------------");

    // اگر کلید API دارید، سعی می‌کنیم بفرستیم (شاید برای تست پنل داشته باشید)
    // اما اگر خطا داد هم مهم نیست، ما true برمی‌گردانیم تا لاگین متوقف نشود.
    if (SMSIR_API_KEY) {
        try {
            const response = await fetch("https://api.sms.ir/v1/send/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": SMSIR_API_KEY,
                },
                body: JSON.stringify({
                    mobile: mobile,
                    templateId: VERIFY_TEMPLATE_ID,
                    parameters: [
                        { name: "code", value: code }
                    ],
                }),
            });

            // نتیجه واقعی را لاگ می‌کنیم تا اگر بعداً قالب درست شد بفهمید
            const data = await response.json();
            console.log("SMS Provider Response:", data);
        } catch (error) {
            console.error("SMS Send Error (Ignored):", error);
        }
    }

    // ✅ همیشه true برمی‌گردانیم تا کاربر به مرحله وارد کردن کد برود
    // شما کد را از بخش "لاگ‌های لیارا" برمی‌دارید.
    return true;
}

export async function sendOrderNotification(mobile: string, trackingCode: string) {
    console.log("------------------------------------------------");
    console.log(`📢 [ORDER NOTIF] Mobile: ${mobile} | Tracking: ${trackingCode}`);
    console.log("------------------------------------------------");
    return true;
}