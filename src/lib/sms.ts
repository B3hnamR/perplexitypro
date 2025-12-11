const API_KEY = process.env.SMSIR_API_KEY || "";
const ADMIN_MOBILE = process.env.ADMIN_MOBILE || "";

const TEMPLATES = {
    VERIFY: process.env.SMSIR_VERIFY_TEMPLATE_ID, 
    ORDER: process.env.SMSIR_ORDER_TEMPLATE_ID,   
    ADMIN: process.env.SMSIR_ADMIN_ALERT_TEMPLATE_ID 
};

async function sendSmsIrVerify(mobile: string, templateId: string | undefined, parameters: { name: string; value: string }[]) {
    if (!API_KEY || !templateId) {
        console.error("❌ SMS.ir Config Missing");
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
                mobile,
                templateId: Number(templateId),
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

export async function sendOTP(mobile: string, code: string) {
    if (process.env.NODE_ENV !== "production") console.log(`🔐 OTP: ${code}`);
    return sendSmsIrVerify(mobile, TEMPLATES.VERIFY, [{ name: "Code", value: code }]);
}

export async function sendOrderNotification(mobile: string, trackingCode: string) {
    return sendSmsIrVerify(mobile, TEMPLATES.ORDER, [{ name: "id", value: trackingCode }]);
}

export async function sendAdminAlert(amount: number) {
    if (!ADMIN_MOBILE) return false;
    return sendSmsIrVerify(ADMIN_MOBILE, TEMPLATES.ADMIN, [{ name: "value", value: amount.toLocaleString("fa-IR") }]);
}