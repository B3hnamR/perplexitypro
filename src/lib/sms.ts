const API_KEY = process.env.SMSIR_API_KEY || "";
const ADMIN_MOBILE = process.env.ADMIN_MOBILE || "";

// آیدی قالب‌ها از فایل env خوانده می‌شود
const TEMPLATES = {
    VERIFY: process.env.SMSIR_VERIFY_TEMPLATE_ID, // 815845
    ORDER: process.env.SMSIR_ORDER_TEMPLATE_ID,   // 525554
    ADMIN: process.env.SMSIR_ADMIN_ALERT_TEMPLATE_ID // 839588
};

async function sendSmsIrVerify(mobile: string, templateId: string | undefined, parameters: { name: string; value: string }[]) {
    if (!API_KEY || !templateId) {
        console.error("❌ SMS.ir API Key or Template ID is missing!");
        return false;
    }

    try {
        const response = await fetch("https://api.sms.ir/v1/send/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
            },
            body: JSON.stringify({
                mobile: mobile,
                templateId: Number(templateId),
                parameters: parameters,
            }),
        });

        const data = await response.json();
        
        if (data.status === 1) {
            return true;
        } else {
            console.error("SMS.ir Error:", data);
            return false;
        }
    } catch (error) {
        console.error("SMS.ir Network Error:", error);
        return false;
    }
}

// 1. ارسال کد تایید (OTP)
export async function sendOTP(mobile: string, code: string) {
    if (process.env.NODE_ENV !== "production") console.log(`🔐 OTP: ${code}`);
    
    // فرض بر این است که در قالب 815845 متغیری به نام Code دارید
    return sendSmsIrVerify(mobile, TEMPLATES.VERIFY, [
        { name: "Code", value: code }
    ]);
}

// 2. پیامک موفقیت خرید به مشتری
export async function sendOrderNotification(mobile: string, trackingCode: string) {
    // فرض بر این است که در قالب 525554 متغیری به نام id دارید
    return sendSmsIrVerify(mobile, TEMPLATES.ORDER, [
        { name: "id", value: trackingCode }
    ]);
}

// 3. پیامک فروش جدید به مدیر
export async function sendAdminAlert(amount: number) {
    if (!ADMIN_MOBILE) return false;
    const formattedAmount = amount.toLocaleString("fa-IR");
    
    // فرض بر این است که در قالب 839588 متغیری به نام value دارید
    return sendSmsIrVerify(ADMIN_MOBILE, TEMPLATES.ADMIN, [
        { name: "value", value: formattedAmount }
    ]);
}