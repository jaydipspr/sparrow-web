"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
	const [stats, setStats] = useState({
		totalServices: 0,
		totalBlogs: 0,
		totalContacts: 0,
		totalPortfolio: 0,
	});

	useEffect(() => {
		// Fetch stats from API
		const fetchStats = async () => {
			try {
				// You can add API calls here later
				setStats({
					totalServices: 14,
					totalBlogs: 8,
					totalContacts: 25,
					totalPortfolio: 12,
				});
			} catch (error) {
				console.error("Error fetching stats:", error);
			}
		};

		fetchStats();
	}, []);

	const statCards = [
		{
			id: 1,
			title: "Total Services",
			value: stats.totalServices,
			icon: "fa-light fa-briefcase",
			color: "primary",
		},
		{
			id: 2,
			title: "Total Blogs",
			value: stats.totalBlogs,
			icon: "fa-light fa-blog",
			color: "success",
		},
		{
			id: 3,
			title: "Total Contacts",
			value: stats.totalContacts,
			icon: "fa-light fa-envelope",
			color: "warning",
		},
		{
			id: 4,
			title: "Portfolio Items",
			value: stats.totalPortfolio,
			icon: "fa-light fa-folder-open",
			color: "info",
		},
	];

	return (
		<div className="admin-dashboard">
			<div className="admin-page-header">
				<h1 className="admin-page-title">Dashboard</h1>
				<p className="admin-page-subtitle">Welcome back! Here's what's happening today.</p>
			</div>

			<div className="admin-stats-grid">
				{statCards.map((card) => (
					<div key={card.id} className={`admin-stat-card admin-stat-card-${card.color}`}>
						<div className="admin-stat-card-icon">
							<i className={card.icon}></i>
						</div>
						<div className="admin-stat-card-content">
							<h3 className="admin-stat-card-value">{card.value}</h3>
							<p className="admin-stat-card-title">{card.title}</p>
						</div>
					</div>
				))}
			</div>

			<div className="admin-dashboard-content">
				<div className="admin-dashboard-row">
					<div className="admin-dashboard-col">
						<div className="admin-card">
							<div className="admin-card-header">
								<h3 className="admin-card-title">Recent Activities</h3>
							</div>
							<div className="admin-card-body">
								<div className="admin-activity-list">
									<div className="admin-activity-item">
										<div className="admin-activity-icon">
											<i className="fa-light fa-plus"></i>
										</div>
										<div className="admin-activity-content">
											<p className="admin-activity-text">
												New service <strong>AI Solutions</strong> added
											</p>
											<span className="admin-activity-time">2 hours ago</span>
										</div>
									</div>
									<div className="admin-activity-item">
										<div className="admin-activity-icon">
											<i className="fa-light fa-edit"></i>
										</div>
										<div className="admin-activity-content">
											<p className="admin-activity-text">
												Blog post <strong>Technology Trends</strong> updated
											</p>
											<span className="admin-activity-time">5 hours ago</span>
										</div>
									</div>
									<div className="admin-activity-item">
										<div className="admin-activity-icon">
											<i className="fa-light fa-envelope"></i>
										</div>
										<div className="admin-activity-content">
											<p className="admin-activity-text">
												New contact form submission received
											</p>
											<span className="admin-activity-time">1 day ago</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="admin-dashboard-col">
						<div className="admin-card">
							<div className="admin-card-header">
								<h3 className="admin-card-title">Quick Actions</h3>
							</div>
							<div className="admin-card-body">
								<div className="admin-quick-actions">
									<a href="/admin/services" className="admin-quick-action-btn">
										<i className="fa-light fa-plus"></i>
										<span>Add New Service</span>
									</a>
									<a href="/admin/blogs" className="admin-quick-action-btn">
										<i className="fa-light fa-plus"></i>
										<span>Add New Blog</span>
									</a>
									<a href="/admin/portfolio" className="admin-quick-action-btn">
										<i className="fa-light fa-plus"></i>
										<span>Add Portfolio Item</span>
									</a>
									<a href="/admin/contacts" className="admin-quick-action-btn">
										<i className="fa-light fa-envelope"></i>
										<span>View Contacts</span>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
