import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { paymentProvider } from "@/lib/payment";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function getGatewayFromOrder(order: any): "ZARINPAL" | "ZIBAL" {
    if (order?.customData) {
        try {
            const data = JSON.parse(order.customData);
            if (data.gateway === "ZIBAL") return "ZIBAL";
        } catch {
            // ignore parse errors
        }
    }
    return "ZARINPAL";
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const authority = body.Authority || body.trackId || body.authority;
        const statusFlag = body.Status ?? body.status ?? body.success;

        if (!authority) {
            return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: { refId: authority },
            include: { links: true }
        });

        if (!order) {
            return NextResponse.json({ error: "Order Not Found" }, { status: 404 });
        }

        if (order.status === "PAID") {
            return NextResponse.json({ message: "Already Paid" });
        }

        const gateway = getGatewayFromOrder(order);
        const isStatusOk =
            gateway === "ZIBAL"
                ? statusFlag === 1 || statusFlag === "1"
                : statusFlag === "OK";

        if (!isStatusOk) {
            await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
            return NextResponse.json({ status: "Failed" });
        }

        const verification = await paymentProvider.verify({
            gateway,
            amount: order.amount,
            authority: authority
        });

        if (!verification.success) {
            await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
            return NextResponse.json({ status: "Failed" });
        }

        const downloadToken = order.downloadToken || crypto.randomBytes(32).toString("hex");
        const quantityNeeded = order.quantity || 1;

        try {
            await prisma.$transaction(async (tx) => {
                const availableLinks = await tx.downloadLink.findMany({
                    where: { status: "AVAILABLE" },
                    take: quantityNeeded,
                    select: { id: true }
                });

                if (availableLinks.length < quantityNeeded) {
                    throw new Error("INSUFFICIENT_LINKS");
                }

                const linkIds = availableLinks.map((l) => l.id);
                const updated = await tx.downloadLink.updateMany({
                    where: { id: { in: linkIds }, status: "AVAILABLE" },
                    data: {
                        status: "USED",
                        orderId: order.id,
                        consumedAt: new Date()
                    }
                });

                if (updated.count !== linkIds.length) {
                    throw new Error("LINK_RACE_CONDITION");
                }

                await tx.order.update({
                    where: { id: order.id },
                    data: {
                        status: "PAID",
                        refId: verification.refId ? String(verification.refId) : order.refId,
                        downloadToken
                    }
                });

                if (order.discountCodeId) {
                    await tx.discountCode.update({
                        where: { id: order.discountCodeId },
                        data: { usedCount: { increment: 1 } }
                    });
                }
            });

            return NextResponse.json({ status: "Success", refId: verification.refId });
        } catch (txError: any) {
            if (txError?.message === "INSUFFICIENT_LINKS") {
                await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
                return NextResponse.json({ error: "No links available" }, { status: 409 });
            }
            console.error("Transaction Error:", txError);
            return NextResponse.json({ error: "Transaction Failed" }, { status: 500 });
        }

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
