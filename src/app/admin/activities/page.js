"use client";
import { useState, useEffect } from "react";
import React from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import Link from "next/link";

export default function AdminActivities() {
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		limit: 10,
		totalCount: 0,
		totalPages: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});

	const fetchActivities = (page = 1, limit = 10) => {
		setLoading(true);
		api.get(`/api/admin/activities?page=${page}&limit=${limit}`)
			.then((response) => {
				if (response.data.success) {
					const activitiesData = response.data.data || [];
					const paginationData = response.data.pagination || {};
					setActivities(activitiesData);
					setPagination({
						currentPage: paginationData.currentPage || page,
						limit: paginationData.limit || limit,
						totalCount: paginationData.totalCount || 0,
						totalPages: paginationData.totalPages || 0,
						hasNextPage: paginationData.hasNextPage || false,
						hasPrevPage: paginationData.hasPrevPage || false,
					});
				} else {
					toast.error("Failed to fetch activities");
				}
			})
			.catch((err) => {
				console.error("Error fetching activities:", err);
				toast.error(err.response?.data?.error || "Failed to fetch activities");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			fetchActivities(newPage, pagination.limit);
		}
	};

	useEffect(() => {
		fetchActivities(1, 10);
	}, []);

	return (
		<div className="admin-page">
			<div className="admin-card">
				<div className="admin-card-header">
					<div>
						<h3 className="admin-card-title">All Activities</h3>
						<p className="admin-card-subtitle">View all recent activities across the system</p>
					</div>
				</div>

				<div className="admin-card-body">
					{loading ? (
						<div className="admin-loading">
							<i className="fa-light fa-spinner fa-spin"></i>
							<span>Loading activities...</span>
						</div>
					) : activities.length === 0 ? (
						<div className="admin-empty-state">
							<i className="fa-light fa-inbox"></i>
							<p>No activities found.</p>
						</div>
					) : (
						<>
							<div className="admin-activity-list">
								{activities.map((activity, index) => (
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
							{pagination && pagination.totalCount > 0 && (
								<div className="admin-pagination" style={{ marginTop: "30px" }}>
									<div className="admin-pagination-info">
										Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{" "}
										{Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{" "}
										{pagination.totalCount} entries
									</div>
									<div className="admin-pagination-controls">
										<button
											type="button"
											className="admin-btn admin-btn-secondary admin-pagination-btn"
											onClick={() => handlePageChange(pagination.currentPage - 1)}
											disabled={!pagination.hasPrevPage}
										>
											<i className="fa-light fa-chevron-left"></i>
											<span>Previous</span>
										</button>
										<div className="admin-pagination-pages">
											{Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
												.filter((page) => {
													return (
														page === 1 ||
														page === pagination.totalPages ||
														(page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
													);
												})
												.map((page, index, array) => {
													const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
													return (
														<React.Fragment key={page}>
															{showEllipsisBefore && (
																<span className="admin-pagination-ellipsis">...</span>
															)}
															<button
																type="button"
																className={`admin-pagination-page ${
																	page === pagination.currentPage ? "active" : ""
																}`}
																onClick={() => handlePageChange(page)}
															>
																{page}
															</button>
														</React.Fragment>
													);
												})}
										</div>
										<button
											type="button"
											className="admin-btn admin-btn-secondary admin-pagination-btn"
											onClick={() => handlePageChange(pagination.currentPage + 1)}
											disabled={!pagination.hasNextPage}
										>
											<span>Next</span>
											<i className="fa-light fa-chevron-right"></i>
										</button>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
