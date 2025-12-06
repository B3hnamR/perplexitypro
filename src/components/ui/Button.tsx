"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
}: ButtonProps) {
    return (
        <motion.button
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {children}
        </motion.button>
    );
}
