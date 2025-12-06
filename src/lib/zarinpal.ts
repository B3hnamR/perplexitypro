export const zarinpalConfig = {
    // اگر متغیر محیطی نبود، یک رشته خالی برمی‌گرداند تا بیلد فیل نشود
    merchantId: process.env.ZARINPAL_MERCHANT_ID || "",
    sandbox: process.env.ZARINPAL_SANDBOX === "true",
};

// تابع کمکی برای بررسی وجود مرچنت آیدی در زمان اجرا (نه زمان بیلد)
function checkMerchantId() {
    if (!zarinpalConfig.merchantId && process.env.NODE_ENV === "production") {
        console.error("⚠️ ZARINPAL_MERCHANT_ID is missing!");
        // اینجا throw نمی‌کنیم تا کل برنامه کرش نکند، فقط لاگ می‌زنیم
        // یا می‌توانیم در توابع requestPayment خطا برگردانیم
    }
}

export async function requestPayment(amount: number, description: string, callbackUrl: string, email?: string, mobile?: string) {
    checkMerchantId(); // بررسی در زمان اجرا
    
    if (!zarinpalConfig.merchantId) {
        throw new Error("Merchant ID is not configured");
    }

    const url = zarinpalConfig.sandbox
        ? "https://sandbox.zarinpal.com/pg/v4/payment/request.json"
        : "https://api.zarinpal.com/pg/v4/payment/request.json";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            merchant_id: zarinpalConfig.merchantId,
            amount,
            currency: "IRT",
            description,
            callback_url: callbackUrl,
            metadata: {
                email: email || undefined,
                mobile: mobile || undefined,
            },
        }),
    });

    const data = await response.json();
    return data;
}

export async function verifyPayment(authority: string, amount: number) {
    checkMerchantId();

    if (!zarinpalConfig.merchantId) {
        throw new Error("Merchant ID is not configured");
    }

    const url = zarinpalConfig.sandbox
        ? "https://sandbox.zarinpal.com/pg/v4/payment/verify.json"
        : "https://api.zarinpal.com/pg/v4/payment/verify.json";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            merchant_id: zarinpalConfig.merchantId,
            amount,
            authority,
        }),
    });

    const data = await response.json();
    return data;
}

export function getPaymentUrl(authority: string) {
    return zarinpalConfig.sandbox
        ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
        : `https://www.zarinpal.com/pg/StartPay/${authority}`;
}