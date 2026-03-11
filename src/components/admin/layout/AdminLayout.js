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
	const [isNotFound, setIsNotFound] = useState(false);

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

	useEffect(() => {
		// Check if this is a not-found page
		const isValidAdminRoute = (path) => {
			const exactRoutes = [
				"/admin",
				"/admin/login",
				"/admin/blogs",
				"/admin/services",
				"/admin/portfolio",
				"/admin/technology",
				"/admin/contacts",
				"/admin/careers",
				"/admin/activities",
				"/admin/settings",
				"/admin/team"
			];
			
			if (exactRoutes.includes(path)) {
				return true;
			}
			
			const dynamicPatterns = [
				/^\/admin\/blogs\/[^/]+$/,
				/^\/admin\/services\/[^/]+$/,
				/^\/admin\/portfolio\/[^/]+$/,
				/^\/admin\/technology\/[^/]+$/,
				/^\/admin\/team\/[^/]+$/
			];
			
			return dynamicPatterns.some(pattern => pattern.test(path));
		};
		
		const isNotFoundPage = pathname.startsWith("/admin/") && 
			pathname !== "/admin/login" &&
			!isValidAdminRoute(pathname);
		
		setIsNotFound(isNotFoundPage);
	}, [pathname]);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const closeSidebar = () => {
		if (isMobile) {
			setSidebarOpen(false);
		}
	};

	// Initial check for not-found (before useEffect runs)
	const isValidAdminRoute = (path) => {
		const exactRoutes = [
			"/admin",
			"/admin/login",
			"/admin/blogs",
			"/admin/services",
			"/admin/portfolio",
			"/admin/technology",
			"/admin/contacts",
			"/admin/careers",
			"/admin/activities",
			"/admin/settings",
			"/admin/team"
		];
		
		if (exactRoutes.includes(path)) {
			return true;
		}
		
		const dynamicPatterns = [
			/^\/admin\/blogs\/[^/]+$/,
			/^\/admin\/services\/[^/]+$/,
			/^\/admin\/portfolio\/[^/]+$/,
			/^\/admin\/technology\/[^/]+$/,
			/^\/admin\/team\/[^/]+$/
		];
		
		return dynamicPatterns.some(pattern => pattern.test(path));
	};
	
	const initialIsNotFound = pathname.startsWith("/admin/") && 
		pathname !== "/admin/login" &&
		!isValidAdminRoute(pathname);

	// Don't render sidebar/header for login page or not-found page
	if (isLoginPage || isNotFound || initialIsNotFound) {
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
