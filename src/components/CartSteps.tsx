"use client";

import { ShoppingCart, User, CreditCard, CheckCircle } from "lucide-react";
import styles from "./CartSteps.module.css";

interface CartStepsProps {
    currentStep: 1 | 2 | 3 | 4;
}

export default function CartSteps({ currentStep }: CartStepsProps) {
    const steps = [
        { id: 1, label: "بررسی سبد خرید", icon: ShoppingCart },
        { id: 2, label: "اطلاعات ارسال", icon: User }, // Using User as placeholder for Info
        { id: 3, label: "نحوه پرداخت", icon: CreditCard },
        { id: 4, label: "پایان خرید", icon: CheckCircle },
    ];

    const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className={styles.stepsContainer}>
            <div className={styles.track}>
                <div className={styles.trackActive} style={{ width: `${progressPercent}%` }} />
            </div>
            {steps.map((step) => (
                <div key={step.id} className={`${styles.step} ${currentStep >= step.id ? styles.active : ""}`}>
                    <div className={styles.iconWrapper}>
                        <step.icon size={24} />
                    </div>
                    <span className={styles.label}>{step.label}</span>
                </div>
            ))}
        </div>
    );
}
