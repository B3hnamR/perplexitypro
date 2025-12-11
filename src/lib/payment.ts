import axios from "axios";

interface PaymentRequest {
    gateway: "ZARINPAL" | "ZIBAL";
    amount: number;
    description: string;
    mobile: string;
    callbackUrl: string;
    email?: string;
}

interface PaymentVerify {
    gateway: "ZARINPAL" | "ZIBAL";
    amount: number;
    authority: string;
}

// تنظیمات هوشمند محیط تست و واقعی
const isSandbox = process.env.PAYMENT_MODE === "sandbox";

const ZARINPAL_CONFIG = {
    url: isSandbox ? "https://sandbox.zarinpal.com/pg/v4/payment" : "https://api.zarinpal.com/pg/v4/payment",
    merchant: isSandbox ? "41560e45-4217-437d-90fe-270293791227" : process.env.ZARINPAL_MERCHANT_ID, // مرچنت عمومی تست زرین‌پال
    payUrl: isSandbox ? "https://sandbox.zarinpal.com/pg/StartPay" : "https://www.zarinpal.com/pg/StartPay",
};

export const paymentProvider = {
    // 1. درخواست ایجاد تراکنش
    request: async ({ gateway, amount, description, mobile, callbackUrl, email }: PaymentRequest) => {
        const amountInRials = amount * 10;

        console.log(`🚀 Payment Request [${gateway}] - Mode: ${isSandbox ? 'SANDBOX' : 'PRODUCTION'}`);

        // --- زرین پال ---
        if (gateway === "ZARINPAL") {
            try {
                const response = await axios.post(`${ZARINPAL_CONFIG.url}/request.json`, {
                    merchant_id: ZARINPAL_CONFIG.merchant,
                    amount: amountInRials,
                    description: description,
                    callback_url: callbackUrl,
                    metadata: { mobile, email }
                });

                if (response.data.data.code === 100) {
                    return {
                        url: `${ZARINPAL_CONFIG.payUrl}/${response.data.data.authority}`,
                        authority: response.data.data.authority
                    };
                }
                throw new Error(`Zarinpal Error: ${response.data.errors?.code}`);
            } catch (error: any) {
                console.error("❌ Zarinpal Error:", error.response?.data || error.message);
                throw new Error("خطا در اتصال به زرین‌پال (بررسی کنید Sandbox فعال باشد)");
            }
        }

        // --- زیبال (زیبال سندباکس ندارد، فقط روی سرور اصلی کار می‌کند) ---
        if (gateway === "ZIBAL") {
            if (isSandbox) {
                throw new Error("زیبال حالت تست ندارد. لطفا از زرین‌پال برای تست روی لوکال استفاده کنید.");
            }
            
            try {
                const response = await axios.post("https://gateway.zibal.ir/v1/request", {
                    merchant: process.env.ZIBAL_MERCHANT_ID,
                    amount: amountInRials,
                    description: description,
                    callbackUrl: callbackUrl,
                    mobile: mobile,
                });

                if (response.data.result === 100) {
                    return {
                        url: `https://gateway.zibal.ir/start/${response.data.trackId}`,
                        authority: response.data.trackId
                    };
                }
                throw new Error(`Zibal Error: ${response.data.result}`);
            } catch (error: any) {
                console.error("❌ Zibal Error:", error.response?.data || error.message);
                throw new Error("خطا در اتصال به زیبال (آی‌پی مجاز نیست)");
            }
        }
    },

    // 2. تایید تراکنش
    verify: async ({ gateway, amount, authority }: PaymentVerify) => {
        const amountInRials = amount * 10;

        // --- زرین پال ---
        if (gateway === "ZARINPAL") {
            try {
                const response = await axios.post(`${ZARINPAL_CONFIG.url}/verify.json`, {
                    merchant_id: ZARINPAL_CONFIG.merchant,
                    amount: amountInRials,
                    authority: authority
                });
                
                // در سندباکس کد موفقیت ممکن است متفاوت باشد، اما معمولاً 100 یا 101 است
                if (response.data.data.code === 100 || response.data.data.code === 101) {
                    return { success: true, refId: response.data.data.ref_id };
                }
            } catch (error) {
                console.error("Zarinpal Verify Error:", error);
            }
            return { success: false };
        }

        // --- زیبال ---
        if (gateway === "ZIBAL") {
            try {
                const response = await axios.post("https://gateway.zibal.ir/v1/verify", {
                    merchant: process.env.ZIBAL_MERCHANT_ID,
                    trackId: authority
                });

                if (response.data.result === 100 || response.data.result === 201) {
                    return { success: true, refId: response.data.refNumber };
                }
            } catch (error) {
                console.error("Zibal Verify Error:", error);
            }
            return { success: false };
        }

        return { success: false };
    }
};