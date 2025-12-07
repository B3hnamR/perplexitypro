import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                mobile: { label: "Mobile", type: "text" },
                code: { label: "Code", type: "text" },
                firstName: { label: "Name", type: "text" },
                lastName: { label: "Family", type: "text" },
            },
            authorize: async (credentials) => {
                // --- روش ۱: ورود ادمین ---
                if (credentials?.email && credentials?.password) {
                    const admin = await prisma.admin.findUnique({
                        where: { email: credentials.email as string },
                    });
                    if (admin && await bcrypt.compare(credentials.password as string, admin.password)) {
                        return { 
                            id: admin.id, 
                            email: admin.email, 
                            name: admin.name, 
                            role: "ADMIN" 
                        };
                    }
                }

                // --- روش ۲: ورود/عضویت کاربر (حالت واقعی) ---
                if (credentials?.mobile && credentials?.code) {
                    const mobile = credentials.mobile as string;
                    const code = credentials.code as string;

                    // بررسی صحت کد OTP از دیتابیس
                    const otpRecord = await prisma.oTP.findUnique({ where: { mobile } });
                    
                    if (!otpRecord || otpRecord.code !== code || otpRecord.expiresAt < new Date()) {
                        throw new Error("کد تایید نامعتبر یا منقضی شده است");
                    }

                    // حذف کد استفاده شده
                    await prisma.oTP.delete({ where: { mobile } });

                    // ثبت نام یا ورود کاربر
                    const user = await prisma.user.upsert({
                        where: { mobile },
                        update: {}, 
                        create: {
                            mobile,
                            firstName: (credentials.firstName as string) || null,
                            lastName: (credentials.lastName as string) || null,
                            email: (credentials.email as string) || null,
                        }
                    });

                    return { 
                        id: user.id, 
                        mobile: user.mobile, 
                        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || "کاربر", 
                        role: "USER" 
                    };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token?.sub && session.user) {
                session.user.id = token.sub;
                // @ts-ignore
                session.user.role = token.role;
                // @ts-ignore
                session.user.mobile = token.mobile;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                // @ts-ignore
                token.role = user.role || "USER";
                // @ts-ignore
                token.mobile = user.mobile;
            }
            return token;
        },
    },
    session: { strategy: "jwt" },
    pages: { 
        signIn: "/auth/login", 
    },
});