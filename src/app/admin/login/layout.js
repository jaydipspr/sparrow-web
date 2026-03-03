export const metadata = {
	title: "Admin Login - Sparrow Softtech",
	description: "Admin login page for accessing the admin panel",
};

// This layout overrides the parent /admin/layout.js
// to prevent the AdminLayout wrapper from being applied to the login page
export default function AdminLoginLayout({ children }) {
	return <>{children}</>;
}
