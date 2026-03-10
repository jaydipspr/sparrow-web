"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";

const AdminHeader = ({ toggleSidebar }) => {
	const pathname = usePathname();
	const [notifOpen, setNotifOpen] = useState(false);
	const [notifLoading, setNotifLoading] = useState(false);
	const [notifications, setNotifications] = useState({
		contacts: [],
		careers: [],
		all: [],
		totalUnread: 0,
	});
	const notifRef = useRef(null);

	// Generate breadcrumb items based on pathname
	const getBreadcrumbs = () => {
		const breadcrumbs = [
			{ label: "Dashboard", href: "/admin" },
		];

		if (pathname === "/admin") {
			return breadcrumbs;
		}

		const pathParts = pathname.split("/").filter(Boolean);
		
		// Remove "admin" from path parts
		const routeParts = pathParts.slice(1);

		if (routeParts.length === 0) {
			return breadcrumbs;
		}

		// Map route names to display names
		const routeLabels = {
			services: "Services",
			technology: "Technology",
			blogs: "Blogs",
			portfolio: "Portfolio",
			contacts: "Contacts",
			careers: "Careers",
			team: "Team",
			settings: "Settings",
		};

		// Handle dynamic routes like /admin/services/[slug] or /admin/services/[id]
		if (routeParts.length === 2) {
			const [section, id] = routeParts;
			const sectionLabel = routeLabels[section] || section.charAt(0).toUpperCase() + section.slice(1);
			
			// Check if it's a details page (slug or MongoDB ObjectId)
			if (id) {
				// It's a details page
				breadcrumbs.push({
					label: sectionLabel,
					href: `/admin/${section}`,
				});
				
				// Add details label based on section
				const detailsLabels = {
					services: "Service Details",
					technology: "Technology Details",
					blogs: "Blog Details",
					portfolio: "Portfolio Details",
					careers: "Career Details",
					team: "Team Details",
				};
				
				breadcrumbs.push({
					label: detailsLabels[section] || "Details",
					href: null, // Current page, not a link
				});
			} else {
				// Regular nested route
				breadcrumbs.push({
					label: sectionLabel,
					href: `/admin/${section}`,
				});
				breadcrumbs.push({
					label: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " "),
					href: null,
				});
			}
		} else if (routeParts.length === 1) {
			// Single level route like /admin/services
			const section = routeParts[0];
			const sectionLabel = routeLabels[section] || section.charAt(0).toUpperCase() + section.slice(1);
			breadcrumbs.push({
				label: sectionLabel,
				href: null, // Current page
			});
		}

		return breadcrumbs;
	};

	const breadcrumbs = getBreadcrumbs();

	// Format notification time
	const formatNotificationTime = (dateStr) => {
		if (!dateStr) return "";
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	};

	useEffect(() => {
		let ignore = false;

		const fetchNotifications = async () => {
			try {
				setNotifLoading(true);
				const res = await api.get("/api/admin/notifications");
				if (ignore) return;
				if (res.data?.success) {
					setNotifications(res.data.data);
				}
			} catch (e) {
				// silent fail (header should still work)
			} finally {
				if (!ignore) setNotifLoading(false);
			}
		};

		fetchNotifications();
		const interval = setInterval(fetchNotifications, 30000); // refresh every 30s

		return () => {
			ignore = true;
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (!notifRef.current) return;
			if (!notifRef.current.contains(e.target)) {
				setNotifOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<header className="admin-header">
			<div className="admin-header-inner">
				<div className="admin-header-left">
					<button
						className="admin-sidebar-toggle"
						onClick={toggleSidebar}
						aria-label="Toggle sidebar"
					>
						<i className="fa-light fa-bars"></i>
					</button>
					<div className="admin-breadcrumb">
						{breadcrumbs.map((crumb, index) => (
							<span key={index}>
								{index > 0 && <span className="breadcrumb-separator">/</span>}
								{crumb.href ? (
									<Link href={crumb.href} className="breadcrumb-link">
										{crumb.label}
									</Link>
								) : (
									<span className="breadcrumb-current">{crumb.label}</span>
								)}
							</span>
						))}
					</div>
				</div>
				<div className="admin-header-right">
					<div className="admin-header-actions">
						<div className="admin-notifications" ref={notifRef}>
							<button
								type="button"
								className="admin-header-btn admin-notif-btn"
								onClick={() => setNotifOpen((v) => !v)}
								aria-label="Notifications"
							>
								<i className="fa-light fa-bell"></i>
								{notifications.totalUnread > 0 && (
									<span className="admin-notif-badge">
										{notifications.totalUnread > 99 ? "99+" : notifications.totalUnread}
									</span>
								)}
							</button>

							{notifOpen && (
								<div className="admin-notif-dropdown">
									<div className="admin-notif-dropdown-header">
										<span>Notifications</span>
										{notifLoading ? (
											<span className="admin-notif-loading">
												<i className="fa-light fa-spinner fa-spin"></i>
											</span>
										) : null}
									</div>
									<div className="admin-notif-items">
										{!notifications.all || notifications.all.length === 0 ? (
											<div className="admin-notif-empty">
												<i className="fa-light fa-bell-slash"></i>
												<span>No new notifications</span>
											</div>
										) : (
											<>
												{notifications.all.map((notif) => (
													<Link
														key={`${notif.type}-${notif.id}`}
														className="admin-notif-item"
														href={notif.type === "contact" ? "/admin/contacts" : "/admin/careers"}
														onClick={() => setNotifOpen(false)}
													>
														<div className="admin-notif-item-content">
															<i
																className={`fa-light ${
																	notif.type === "contact" ? "fa-envelope" : "fa-briefcase"
																} admin-notif-item-icon`}
															></i>
															<div className="admin-notif-item-text">
																<span className="admin-notif-item-name">{notif.name}</span>
																<span className="admin-notif-item-message">
																	{notif.type === "contact"
																		? "is trying to contact us"
																		: `applied for ${notif.designation || "a position"}`}
																</span>
															</div>
														</div>
														<span className="admin-notif-item-time">
															{formatNotificationTime(notif.createdAt)}
														</span>
													</Link>
												))}
											</>
										)}
									</div>
									{(notifications.contacts.length > 0 || notifications.careers.length > 0) && (
										<div className="admin-notif-dropdown-footer">
											<Link
												href="/admin/contacts"
												onClick={() => setNotifOpen(false)}
												className="admin-notif-view-all"
											>
												View All
											</Link>
										</div>
									)}
								</div>
							)}
						</div>

						<div className="admin-user-menu">
							<div className="admin-user-avatar">
								<i className="fa-light fa-user"></i>
							</div>
							<div className="admin-user-info">
								<span className="admin-user-name">Admin User</span>
								<span className="admin-user-role">Administrator</span>
							</div>
							<button className="admin-user-dropdown">
								<i className="fa-light fa-chevron-down"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default AdminHeader;
