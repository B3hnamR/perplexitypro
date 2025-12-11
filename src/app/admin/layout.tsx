import { auth } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/auth/login");
    }

    return (
        <div className="flex min-h-screen bg-[#0f172a] text-white font-sans select-text">
            <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="fixed inset-y-0 w-64">
                    <AdminSidebar />
                </div>
            </div>
            <main className="flex-1 p-4 md:p-8 lg:mr-0 min-w-0 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
