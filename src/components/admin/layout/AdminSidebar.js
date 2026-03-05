"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const AdminSidebar = ({ isOpen, onClose }) => {
	const pathname = usePathname();
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 992);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const handleLinkClick = () => {
		if (isMobile && onClose) {
			onClose();
		}
	};

	const menuItems = [
		{
			id: 1,
			title: "Dashboard",
			icon: "fa-light fa-house",
			path: "/admin",
		},
		{
			id: 2,
			title: "Services",
			icon: "fa-light fa-briefcase",
			path: "/admin/services",
		},
		{
			id: 3,
			title: "Blogs",
			icon: "fa-light fa-blog",
			path: "/admin/blogs",
		},
		{
			id: 4,
			title: "Technology",
			icon: "fa-light fa-microchip",
			path: "/admin/technology",
		},
		{
			id: 5,
			title: "Portfolio",
			icon: "fa-light fa-folder-open",
			path: "/admin/portfolio",
		},
		{
			id: 6,
			title: "Contacts",
			icon: "fa-light fa-envelope",
			path: "/admin/contacts",
		},
		{
			id: 7,
			title: "Team",
			icon: "fa-light fa-users",
			path: "/admin/team",
		},
		{
			id: 8,
			title: "Settings",
			icon: "fa-light fa-gear",
			path: "/admin/settings",
		},
	];

	return (
		<aside className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
			<div className="admin-sidebar-inner">
				<div className="admin-logo">
					<Link href="/admin" className="admin-logo-link" onClick={handleLinkClick}>
						<i className="fa-light fa-shield-check"></i>
						{isOpen && <span className="admin-logo-text">Admin Panel</span>}
					</Link>
				</div>
				<nav className="admin-nav">
					<ul className="admin-nav-list">
						{menuItems.map((item) => {
							const isActive = pathname === item.path;
							return (
								<li key={item.id} className="admin-nav-item">
									<Link
										href={item.path}
										className={`admin-nav-link ${isActive ? "active" : ""}`}
										onClick={handleLinkClick}
									>
										<i className={item.icon}></i>
										{isOpen && <span className="admin-nav-text">{item.title}</span>}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
				<div className="admin-sidebar-footer">
					<Link href="/admin/login" className="admin-back-link" onClick={handleLinkClick}>
						<i className="fa-light fa-arrow-left"></i>
						{isOpen && <span>Logout</span>}
					</Link>
				</div>
			</div>
		</aside>
	);
};

export default AdminSidebar;
