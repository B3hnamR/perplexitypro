const SMSIR_API_KEY = process.env.SMSIR_API_KEY || "";
const ADMIN_MOBILE = process.env.ADMIN_MOBILE || "";

// شناسه‌های قالب از فایل env خوانده می‌شوند
const TEMPLATE_IDS = {
    VERIFY: Number(process.env.SMSIR_VERIFY_TEMPLATE_ID || 815845),
    ORDER: Number(process.env.SMSIR_ORDER_TEMPLATE_ID || 525554),
    ADMIN: Number(process.env.SMSIR_ADMIN_ALERT_TEMPLATE_ID || 839588),
};

async function sendSmsRequest(mobile: string, templateId: number, parameters: { name: string, value: string }[]) {
    if (!SMSIR_API_KEY) return false;

    try {
        const response = await fetch("https://api.sms.ir/v1/send/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": SMSIR_API_KEY,
            },
            body: JSON.stringify({
                mobile,
                templateId,
                parameters,
            }),
        });
        const data = await response.json();
        return data.status === 1;
    } catch (error) {
        console.error("SMS Error:", error);
        return false;
    }
}

// 1. ارسال کد تایید (OTP)
export async function sendOTP(mobile: string, code: string) {
    if (process.env.NODE_ENV !== "production") console.log(`🔐 OTP: ${code}`);
    return sendSmsRequest(mobile, TEMPLATE_IDS.VERIFY, [{ name: "code", value: code }]);
}

// 2. پیامک موفقیت خرید به مشتری
export async function sendOrderNotification(mobile: string, trackingCode: string) {
    return sendSmsRequest(mobile, TEMPLATE_IDS.ORDER, [{ name: "trackingCode", value: trackingCode }]);
}

// 3. پیامک فروش جدید به مدیر
export async function sendAdminAlert(amount: number) {
    if (!ADMIN_MOBILE) return false;
    // مبلغ را ۳ رقم ۳ رقم جدا می‌کنیم
    const formattedAmount = amount.toLocaleString("fa-IR");
    return sendSmsRequest(ADMIN_MOBILE, TEMPLATE_IDS.ADMIN, [{ name: "amount", value: formattedAmount }]);
}