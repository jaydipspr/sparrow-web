"use client";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const AdminLayout = ({ children }) => {
	const pathname = usePathname();
	const isLoginPage = pathname === "/admin/login";
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 992);
			if (window.innerWidth < 992) {
				setSidebarOpen(false);
			} else {
				setSidebarOpen(true);
			}
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const closeSidebar = () => {
		if (isMobile) {
			setSidebarOpen(false);
		}
	};

	// Don't render sidebar/header for login page
	if (isLoginPage) {
		return <>{children}</>;
	}

	return (
		<div className="admin-wrapper">
			{isMobile && sidebarOpen && (
				<div className="admin-sidebar-overlay" onClick={closeSidebar}></div>
			)}
			<AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
			<div className={`admin-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
				<AdminHeader toggleSidebar={toggleSidebar} />
				<main className="admin-content">
					{children}
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
