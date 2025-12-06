"use client";

import { XCircle, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";
import styles from "./failed.module.css";

export default function PaymentFailedPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <XCircle size={64} className={styles.icon} />
                </div>
                <h1 className={styles.title}>پرداخت ناموفق بود</h1>
                <p className={styles.message}>
                    متاسفانه در پردازش پرداخت شما مشکلی پیش آمد. اگر مبلغی از حساب شما کسر شده، طی ۷۲ ساعت آینده بازخواهد گشت.
                </p>

                <div className={styles.actions}>
                    <Link href="/" className={styles.retryButton}>
                        <RefreshCw size={20} /> تلاش مجدد
                    </Link>
                    <Link href="/" className={styles.homeButton}>
                        بازگشت به صفحه اصلی <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
