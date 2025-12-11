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

export const paymentProvider = {
    // 1. درخواست ایجاد تراکنش
    request: async ({ gateway, amount, description, mobile, callbackUrl, email }: PaymentRequest) => {
        const amountInRials = amount * 10;

        console.log(`🚀 Payment Request [${gateway}]:`, { amountInRials, callbackUrl });

        // --- زرین پال ---
        if (gateway === "ZARINPAL") {
            try {
                const response = await axios.post("https://api.zarinpal.com/pg/v4/payment/request.json", {
                    merchant_id: process.env.ZARINPAL_MERCHANT_ID,
                    amount: amountInRials,
                    description: description,
                    callback_url: callbackUrl,
                    metadata: { mobile, email }
                });

                console.log("✅ Zarinpal Response:", response.data);

                if (response.data.data.code === 100) {
                    return {
                        url: `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`,
                        authority: response.data.data.authority
                    };
                }
                throw new Error(`Zarinpal Error Code: ${response.data.errors?.code || "Unknown"}`);
            } catch (error: any) {
                console.error("❌ Zarinpal Axios Error:", error.response?.data || error.message);
                throw new Error(error.response?.data?.errors?.message || "خطا در اتصال به زرین‌پال");
            }
        }

        // --- زیبال ---
        if (gateway === "ZIBAL") {
            try {
                const response = await axios.post("https://gateway.zibal.ir/v1/request", {
                    merchant: process.env.ZIBAL_MERCHANT_ID,
                    amount: amountInRials,
                    description: description,
                    callbackUrl: callbackUrl,
                    mobile: mobile,
                });

                console.log("✅ Zibal Response:", response.data);

                if (response.data.result === 100) {
                    return {
                        url: `https://gateway.zibal.ir/start/${response.data.trackId}`,
                        authority: response.data.trackId
                    };
                }
                throw new Error(`Zibal Error Code: ${response.data.result}`);
            } catch (error: any) {
                console.error("❌ Zibal Axios Error:", error.response?.data || error.message);
                throw new Error("خطا در اتصال به زیبال");
            }
        }
    },

    // 2. تایید تراکنش
    verify: async ({ gateway, amount, authority }: PaymentVerify) => {
        const amountInRials = amount * 10;

        if (gateway === "ZARINPAL") {
            try {
                const response = await axios.post("https://api.zarinpal.com/pg/v4/payment/verify.json", {
                    merchant_id: process.env.ZARINPAL_MERCHANT_ID,
                    amount: amountInRials,
                    authority: authority
                });
                
                if (response.data.data.code === 100) {
                    return { success: true, refId: response.data.data.ref_id };
                }
            } catch (error) {
                console.error("Zarinpal Verify Error:", error);
            }
            return { success: false };
        }

        if (gateway === "ZIBAL") {
            try {
                const response = await axios.post("https://gateway.zibal.ir/v1/verify", {
                    merchant: process.env.ZIBAL_MERCHANT_ID,
                    trackId: authority
                });

                if (response.data.result === 100) {
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