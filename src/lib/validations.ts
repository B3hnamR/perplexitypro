import { z } from "zod";

export const paymentSchema = z.object({
    amount: z.number().min(1000, "مبلغ باید حداقل ۱۰۰۰ تومان باشد"),
    description: z.string().min(2),
    email: z.string().email().optional().or(z.literal("")),
    mobile: z.string().min(10).regex(/^09[0-9]{9}$/, "شماره موبایل نامعتبر است"),
    customData: z.any().optional(),
    quantity: z.number().min(1).default(1),
    couponCode: z.string().optional(),
});

export const couponSchema = z.object({
    code: z.string().min(2, "کد تخفیف باید حداقل ۲ کاراکتر باشد").regex(/^[A-Za-z0-9_-]+$/, "کد فقط شامل حروف و اعداد انگلیسی باشد"),
    type: z.enum(["PERCENTAGE", "FIXED"]),
    value: z.number().min(1, "مقدار تخفیف باید بیشتر از ۰ باشد"),
    minOrderPrice: z.number().optional().nullable(),
    maxDiscount: z.number().optional().nullable(),
    maxUses: z.number().int().optional().nullable(),
    maxUsesPerUser: z.number().int().optional().nullable(), // ✅ اضافه شد
    expiresAt: z.string().optional().nullable().or(z.literal("")),
    isActive: z.boolean().default(true),
});