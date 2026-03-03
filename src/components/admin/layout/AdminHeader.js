"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminHeader = ({ toggleSidebar }) => {
	const pathname = usePathname();

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
						<Link href="/admin" className="breadcrumb-link">
							Dashboard
						</Link>
						{pathname !== "/admin" && (
							<>
								<span className="breadcrumb-separator">/</span>
								<span className="breadcrumb-current">
									{pathname.split("/").pop().replace(/-/g, " ")}
								</span>
							</>
						)}
					</div>
				</div>
				<div className="admin-header-right">
					<div className="admin-header-actions">
						<button className="admin-header-btn" title="Notifications">
							<i className="fa-light fa-bell"></i>
							<span className="admin-badge">3</span>
						</button>
						<button className="admin-header-btn" title="Messages">
							<i className="fa-light fa-envelope"></i>
							<span className="admin-badge">5</span>
						</button>
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
