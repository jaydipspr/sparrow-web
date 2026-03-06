"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminHeader = ({ toggleSidebar }) => {
	const pathname = usePathname();

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
			team: "Team",
			settings: "Settings",
		};

		// Handle dynamic routes like /admin/services/[id]
		if (routeParts.length === 2) {
			const [section, id] = routeParts;
			const sectionLabel = routeLabels[section] || section.charAt(0).toUpperCase() + section.slice(1);
			
			// Check if it's a details page (has an ID that looks like MongoDB ObjectId)
			if (id && id.length === 24) {
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
