"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
	const [stats, setStats] = useState({
		totalServices: 0,
		totalBlogs: 0,
		totalContacts: 0,
		totalPortfolio: 0,
		totalCareers: 0,
		totalTechnologies: 0,
		unreadContacts: 0,
		unreadCareers: 0,
	});
	const [recentActivities, setRecentActivities] = useState([]);
	const [monthlyData, setMonthlyData] = useState({
		labels: [],
		contacts: [],
		careers: [],
	});
	const [pageViews, setPageViews] = useState({
		technology: 0,
		portfolio: 0,
		services: 0,
		teams: 0,
		blogs: 0,
		career: 0,
		about: 0,
		contact: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch stats from API
		const fetchStats = async () => {
			try {
				setLoading(true);
				const response = await api.get("/api/admin/stats");
				if (response.data.success) {
					setStats(response.data.data.stats);
					setRecentActivities(response.data.data.recentActivities || []);
					setMonthlyData(response.data.data.monthlyData || { labels: [], contacts: [], careers: [] });
					setPageViews(response.data.data.pageViews || {
						technology: 0,
						portfolio: 0,
						services: 0,
						teams: 0,
						blogs: 0,
						career: 0,
						about: 0,
						contact: 0,
					});
				} else {
					toast.error("Failed to fetch dashboard stats");
				}
			} catch (error) {
				console.error("Error fetching stats:", error);
				toast.error(error.response?.data?.error || "Failed to fetch dashboard stats");
			} finally {
				setLoading(false);
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
			link: "/admin/services",
		},
		{
			id: 2,
			title: "Total Blogs",
			value: stats.totalBlogs,
			icon: "fa-light fa-blog",
			color: "success",
			link: "/admin/blogs",
		},
		{
			id: 3,
			title: "Total Contacts",
			value: stats.totalContacts,
			icon: "fa-light fa-envelope",
			color: "warning",
			link: "/admin/contacts",
			badge: stats.unreadContacts > 0 ? stats.unreadContacts : null,
		},
		{
			id: 4,
			title: "Portfolio Items",
			value: stats.totalPortfolio,
			icon: "fa-light fa-folder-open",
			color: "info",
			link: "/admin/portfolio",
		},
		{
			id: 5,
			title: "Career Applications",
			value: stats.totalCareers,
			icon: "fa-light fa-briefcase",
			color: "primary",
			link: "/admin/careers",
			badge: stats.unreadCareers > 0 ? stats.unreadCareers : null,
		},
		{
			id: 6,
			title: "Technologies",
			value: stats.totalTechnologies,
			icon: "fa-light fa-code",
			color: "success",
			link: "/admin/technology",
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
					<Link
						key={card.id}
						href={card.link}
						className={`admin-stat-card admin-stat-card-${card.color}`}
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<div className="admin-stat-card-icon">
							<i className={card.icon}></i>
						</div>
						<div className="admin-stat-card-content">
							<h3 className="admin-stat-card-value">
								{loading ? (
									<i className="fa-light fa-spinner fa-spin"></i>
								) : (
									<>
										{card.value}
										{card.badge && (
											<span
												style={{
													background: "var(--tj-color-theme-primary)",
													color: "#fff",
													fontSize: "12px",
													padding: "2px 8px",
													borderRadius: "12px",
													marginLeft: "8px",
													fontWeight: 600,
												}}
											>
												{card.badge} new
											</span>
										)}
									</>
								)}
							</h3>
							<p className="admin-stat-card-title">{card.title}</p>
						</div>
					</Link>
				))}
			</div>

			<div className="admin-dashboard-content">
				<div className="admin-dashboard-row">
					<div className="admin-dashboard-col admin-dashboard-col-full">
						<div className="admin-card">
							<div className="admin-card-header">
								<h3 className="admin-card-title">Monthly Statistics</h3>
								<p className="admin-card-subtitle">Contacts and Career Applications (Last 6 Months)</p>
							</div>
							<div className="admin-card-body">
								{loading ? (
									<div className="admin-loading">
										<i className="fa-light fa-spinner fa-spin"></i>
										<span>Loading chart data...</span>
									</div>
								) : (
									<div style={{ height: "300px", position: "relative" }}>
										<Bar
											data={{
												labels: monthlyData.labels,
												datasets: [
													{
														label: "Contacts",
														data: monthlyData.contacts,
														backgroundColor: "rgba(12, 30, 33, 0.8)",
														borderColor: "#0C1E21",
														borderWidth: 1,
													},
													{
														label: "Career Applications",
														data: monthlyData.careers,
														backgroundColor: "rgba(30, 138, 138, 0.8)",
														borderColor: "rgb(30, 138, 138)",
														borderWidth: 1,
													},
												],
											}}
											options={{
												responsive: true,
												maintainAspectRatio: false,
												plugins: {
													legend: {
														position: "top",
													},
													title: {
														display: false,
													},
												},
												scales: {
													y: {
														beginAtZero: true,
														ticks: {
															stepSize: 1,
														},
													},
												},
											}}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="admin-dashboard-row">
					<div className="admin-dashboard-col">
						<div className="admin-card">
							<div className="admin-card-header">
								<h3 className="admin-card-title">Recent Activities</h3>
							</div>
							<div className="admin-card-body">
								{loading ? (
									<div className="admin-loading">
										<i className="fa-light fa-spinner fa-spin"></i>
										<span>Loading activities...</span>
									</div>
								) : recentActivities.length > 0 ? (
									<>
										<div className="admin-activity-list">
											{recentActivities.slice(0, 4).map((activity, index) => (
												<Link
													key={index}
													href={activity.link}
													className="admin-activity-item"
													style={{ textDecoration: "none", color: "inherit" }}
												>
													<div className="admin-activity-icon">
														<i className={activity.icon}></i>
													</div>
													<div className="admin-activity-content">
														<p className="admin-activity-text">{activity.text}</p>
														<span className="admin-activity-time">{activity.time}</span>
													</div>
												</Link>
											))}
										</div>
										{recentActivities.length > 4 && (
											<div style={{ marginTop: "20px", textAlign: "center" }}>
												<Link
													href="/admin/activities"
													className="admin-btn admin-btn-primary"
													style={{ textDecoration: "none" }}
												>
													View More
												</Link>
											</div>
										)}
									</>
								) : (
									<div className="admin-empty-state">
										<i className="fa-light fa-inbox"></i>
										<p>No recent activities</p>
									</div>
								)}
							</div>
						</div>
					</div>
					<div className="admin-dashboard-col">
						<div className="admin-card">
							<div className="admin-card-header">
								<h3 className="admin-card-title">Page Views</h3>
								<p className="admin-card-subtitle">User site page views distribution</p>
							</div>
							<div className="admin-card-body">
								{loading ? (
									<div className="admin-loading">
										<i className="fa-light fa-spinner fa-spin"></i>
										<span>Loading chart data...</span>
									</div>
								) : (() => {
									// Prepare data with labels, values, and colors
									const pageViewData = [
										{ label: "Technology", value: pageViews.technology, bgColor: "rgba(30, 138, 138, 0.8)", borderColor: "rgb(30, 138, 138)" },
										{ label: "Portfolio", value: pageViews.portfolio, bgColor: "rgba(12, 30, 33, 0.8)", borderColor: "#0C1E21" },
										{ label: "Services", value: pageViews.services, bgColor: "rgba(30, 138, 138, 0.6)", borderColor: "rgb(30, 138, 138)" },
										{ label: "Teams", value: pageViews.teams, bgColor: "rgba(12, 30, 33, 0.6)", borderColor: "#0C1E21" },
										{ label: "Blogs", value: pageViews.blogs, bgColor: "rgba(30, 138, 138, 0.4)", borderColor: "rgb(30, 138, 138)" },
										{ label: "Career", value: pageViews.career, bgColor: "rgba(12, 30, 33, 0.4)", borderColor: "#0C1E21" },
										{ label: "About Us", value: pageViews.about, bgColor: "rgba(30, 138, 138, 0.3)", borderColor: "rgb(30, 138, 138)" },
										{ label: "Contact", value: pageViews.contact, bgColor: "rgba(12, 30, 33, 0.3)", borderColor: "#0C1E21" },
									];

									// Sort by value descending (highest first)
									const sortedData = [...pageViewData].sort((a, b) => b.value - a.value);

									// Extract sorted arrays
									const sortedLabels = sortedData.map((item) => item.label);
									const sortedValues = sortedData.map((item) => item.value);
									const sortedBgColors = sortedData.map((item) => item.bgColor);
									const sortedBorderColors = sortedData.map((item) => item.borderColor);

									return (
										<div style={{ height: "300px", position: "relative" }}>
											<Doughnut
												data={{
													labels: sortedLabels,
													datasets: [
														{
															data: sortedValues,
															backgroundColor: sortedBgColors,
															borderColor: sortedBorderColors,
															borderWidth: 2,
														},
													],
												}}
											options={{
												responsive: true,
												maintainAspectRatio: false,
												plugins: {
													legend: {
														position: "right",
														labels: {
															padding: 15,
															usePointStyle: true,
															font: {
																size: 12,
															},
															generateLabels: function (chart) {
																const data = chart.data;
																if (data.labels.length && data.datasets.length) {
																	const dataset = data.datasets[0];
																	const total = dataset.data.reduce((a, b) => a + b, 0);
																	return data.labels.map((label, i) => {
																		const value = dataset.data[i] || 0;
																		const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
																		return {
																			text: `${label}: ${percentage}%`,
																			fillStyle: dataset.backgroundColor[i],
																			strokeStyle: dataset.borderColor[i],
																			lineWidth: dataset.borderWidth,
																			hidden: false,
																			index: i,
																		};
																	});
																}
																return [];
															},
														},
													},
													tooltip: {
														callbacks: {
															label: function (context) {
																const label = context.label || "";
																const value = context.parsed || 0;
																const total = context.dataset.data.reduce((a, b) => a + b, 0);
																const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
																return `${label}: ${value} (${percentage}%)`;
															},
														},
													},
												},
											}}
										/>
									</div>
									);
								})()}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
