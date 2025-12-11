import axios from "axios";

interface PaymentRequest {
    gateway: "ZARINPAL" | "ZIBAL";
    amount: number; // تومان
    description: string;
    mobile: string;
    callbackUrl: string;
    email?: string;
}

interface PaymentVerify {
    gateway: "ZARINPAL" | "ZIBAL";
    amount: number; // تومان
    authority: string;
}

export const paymentProvider = {
    // 1. درخواست ایجاد تراکنش
    request: async ({ gateway, amount, description, mobile, callbackUrl, email }: PaymentRequest) => {
        const amountInRials = amount * 10; // تبدیل به ریال برای درگاه‌ها

        // --- زرین پال ---
        if (gateway === "ZARINPAL") {
            const response = await axios.post("https://api.zarinpal.com/pg/v4/payment/request.json", {
                merchant_id: process.env.ZARINPAL_MERCHANT_ID,
                amount: amountInRials,
                description: description,
                callback_url: callbackUrl,
                metadata: { mobile, email }
            });

            if (response.data.data.code === 100) {
                return {
                    url: `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`,
                    authority: response.data.data.authority
                };
            }
            throw new Error(`Zarinpal Error: ${response.data.errors?.code || "Unknown"}`);
        }

        // --- زیبال ---
        if (gateway === "ZIBAL") {
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
        }
    },

    // 2. تایید تراکنش (Verify)
    verify: async ({ gateway, amount, authority }: PaymentVerify) => {
        const amountInRials = amount * 10;

        // --- زرین پال ---
        if (gateway === "ZARINPAL") {
            const response = await axios.post("https://api.zarinpal.com/pg/v4/payment/verify.json", {
                merchant_id: process.env.ZARINPAL_MERCHANT_ID,
                amount: amountInRials,
                authority: authority
            });

            if (response.data.data.code === 100) {
                return {
                    success: true,
                    refId: response.data.data.ref_id,
                    cardPan: response.data.data.card_pan
                };
            }
            return { success: false };
        }

        // --- زیبال ---
        if (gateway === "ZIBAL") {
            const response = await axios.post("https://gateway.zibal.ir/v1/verify", {
                merchant: process.env.ZIBAL_MERCHANT_ID,
                trackId: authority
            });

            if (response.data.result === 100) {
                return {
                    success: true,
                    refId: response.data.refNumber,
                    cardPan: response.data.cardNumber
                };
            }
            return { success: false };
        }

        return { success: false };
    }
};