"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface Discount {
    code: string;
    type: "PERCENTAGE" | "FIXED";
    value: number;
    maxDiscount?: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    applyDiscount: (discount: Discount | null) => void; // تابع جدید
    discount: Discount | null;
    count: number;
    total: number;      // مبلغ نهایی (قابل پرداخت)
    subtotal: number;   // مبلغ کل قبل از تخفیف
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [discount, setDiscount] = useState<Discount | null>(null);

    // لود کردن سبد از لوکال استوریج
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) setItems(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addItem = (product: Omit<CartItem, "quantity">) => {
        setItems(curr => {
            const existing = curr.find(i => i.id === product.id);
            if (existing) {
                return curr.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...curr, { ...product, quantity: 1 }];
        });
    };

    const removeItem = (id: string) => {
        setItems(curr => curr.filter(i => i.id !== id));
        // اگر سبد خالی شد، تخفیف هم بپرد
        if (items.length <= 1) setDiscount(null); 
    };

    const updateQuantity = (id: string, qty: number) => {
        if (qty < 1) return;
        setItems(curr => curr.map(i => i.id === id ? { ...i, quantity: qty } : i));
    };

    const clearCart = () => {
        setItems([]);
        setDiscount(null);
        localStorage.removeItem("cart");
    };

    // محاسبات مالی
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let discountAmount = 0;
    if (discount) {
        if (discount.type === "FIXED") {
            discountAmount = discount.value;
        } else {
            // درصدی
            discountAmount = (subtotal * discount.value) / 100;
            if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
                discountAmount = discount.maxDiscount;
            }
        }
    }

    // مبلغ نهایی نباید منفی شود
    const total = Math.max(0, subtotal - discountAmount);

    return (
        <CartContext.Provider value={{ 
            items, addItem, removeItem, updateQuantity, clearCart, 
            count: items.reduce((c, i) => c + i.quantity, 0),
            total, 
            subtotal,
            discount,
            applyDiscount: setDiscount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);