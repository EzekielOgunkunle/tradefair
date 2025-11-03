import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "TradeFair - Store Dashboard",
    description: "TradeFair - Manage your store and listings",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
