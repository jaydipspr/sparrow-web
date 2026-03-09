"use client";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLayout = ({ children }) => {
	const pathname = usePathname();
	const isLoginPage = pathname === "/admin/login";
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		
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
			{isMounted && (
				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
			)}
		</div>
	);
};

export default AdminLayout;
