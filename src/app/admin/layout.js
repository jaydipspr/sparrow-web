import AdminLayout from "@/components/admin/layout/AdminLayout";

export const metadata = {
	title: "Admin Panel - Sparrow Softtech",
	description: "Admin panel for managing website content",
};

export default function AdminLayoutWrapper({ children }) {
	return <AdminLayout>{children}</AdminLayout>;
}
