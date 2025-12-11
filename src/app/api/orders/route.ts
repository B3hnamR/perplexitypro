// ... imports
export async function POST(req: Request) {
    // ... session checks

    const body = await req.json();
    const { items, gateway, couponCode } = body; // items و کد تخفیف را بگیرید

    // 1. محاسبه قیمت واقعی از دیتابیس
    let calculatedAmount = 0;
    
    // فرض بر این است که فقط یک محصول دارید، اما برای آینده حلقه می‌زنیم
    for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.id } });
        if (product) {
            calculatedAmount += product.price * item.quantity;
        }
    }

    // 2. اعمال کد تخفیف در سمت سرور (اگر ارسال شده بود)
    let discountId = null;
    if (couponCode) {
        const coupon = await prisma.discountCode.findUnique({ where: { code: couponCode } });
        // ... لاجیک بررسی اعتبار کد تخفیف و کسر مبلغ ...
        // calculatedAmount = calculatedAmount - discountAmount;
    }

    // 3. استفاده از calculatedAmount به جای totalAmount ارسالی کاربر
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            amount: calculatedAmount, // ✅ قیمت مطمئن
            // ...
        }
    });
    // ...
}