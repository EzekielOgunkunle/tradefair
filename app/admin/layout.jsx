import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "TradeFair - Admin Dashboard",
    description: "TradeFair - Platform administration and management",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
