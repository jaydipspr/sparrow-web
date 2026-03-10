"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";
import BaseTable from "@/components/admin/BaseTable";
import { toast } from "react-toastify";

export default function AdminCareers() {
	const [careers, setCareers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		careerId: null,
		careerName: "",
	});
	const [viewingCareer, setViewingCareer] = useState(null);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		limit: 10,
		totalCount: 0,
		totalPages: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});
	const [unreadCount, setUnreadCount] = useState(0);

	// Fetch careers with pagination
	const fetchCareers = (page = 1, limit = 10) => {
		setLoading(true);

		api.get(`/api/admin/careers?page=${page}&limit=${limit}`)
			.then((response) => {
				if (response.data.success) {
					const careersData = response.data.data || [];
					const paginationData = response.data.pagination || {};
					setCareers(careersData);
					setUnreadCount(response.data.unreadCount || 0);
					setPagination({
						currentPage: paginationData.currentPage || page,
						limit: paginationData.limit || limit,
						totalCount: paginationData.totalCount || 0,
						totalPages: paginationData.totalPages || 0,
						hasNextPage: paginationData.hasNextPage || false,
						hasPrevPage: paginationData.hasPrevPage || false,
					});
				} else {
					toast.error("Failed to fetch career applications");
				}
			})
			.catch((err) => {
				console.error("Error fetching careers:", err);
				toast.error(err.response?.data?.error || "Failed to fetch career applications");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// Handle page change
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			fetchCareers(newPage, pagination.limit);
		}
	};

	useEffect(() => {
		fetchCareers(1, 10);
	}, []);

	// View career details and mark as read
	const handleView = (career) => {
		setViewingCareer(career);

		// Mark as read if not already
		if (!career.isRead) {
			api.put(`/api/admin/careers/${career._id}`, { isRead: true })
				.then((response) => {
					if (response.data.success) {
						// Update local state
						setCareers((prev) =>
							prev.map((c) =>
								c._id === career._id ? { ...c, isRead: true } : c
							)
						);
						setUnreadCount((prev) => Math.max(0, prev - 1));
					}
				})
				.catch((err) => {
					console.error("Error marking career as read:", err);
				});
		}
	};

	// Toggle read/unread
	const handleToggleRead = (career) => {
		const newIsRead = !career.isRead;

		api.put(`/api/admin/careers/${career._id}`, { isRead: newIsRead })
			.then((response) => {
				if (response.data.success) {
					setCareers((prev) =>
						prev.map((c) =>
							c._id === career._id ? { ...c, isRead: newIsRead } : c
						)
					);
					setUnreadCount((prev) =>
						newIsRead ? Math.max(0, prev - 1) : prev + 1
					);
					toast.success(newIsRead ? "Marked as read" : "Marked as unread");
				}
			})
			.catch((err) => {
				console.error("Error updating career:", err);
				toast.error("Failed to update career application");
			});
	};

	// Handle delete click
	const handleDeleteClick = (career) => {
		setDeleteModal({
			isOpen: true,
			careerId: career._id,
			careerName: career.name || "Career Application",
		});
	};

	// Handle delete confirmation
	const handleDeleteConfirm = () => {
		if (!deleteModal.careerId) return;

		api.delete(`/api/admin/careers/${deleteModal.careerId}`)
			.then((response) => {
				if (response.data.success) {
					toast.success("Career application deleted successfully!");
					fetchCareers(pagination.currentPage, pagination.limit);
					setDeleteModal({ isOpen: false, careerId: null, careerName: "" });
					// Close detail modal if viewing the deleted career
					if (viewingCareer && viewingCareer._id === deleteModal.careerId) {
						setViewingCareer(null);
					}
				} else {
					toast.error(response.data.error || "Failed to delete career application");
					setDeleteModal({ isOpen: false, careerId: null, careerName: "" });
				}
			})
			.catch((err) => {
				console.error("Error deleting career:", err);
				toast.error(err.response?.data?.error || "Failed to delete career application");
				setDeleteModal({ isOpen: false, careerId: null, careerName: "" });
			});
	};

	// Handle delete modal close
	const handleDeleteModalClose = () => {
		setDeleteModal({ isOpen: false, careerId: null, careerName: "" });
	};

	// Format date
	const formatDate = (dateStr) => {
		if (!dateStr) return "-";
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="admin-page">
			<div className="admin-card">
				<div className="admin-card-header">
					<div>
						<h3 className="admin-card-title">
							Career Applications
							{unreadCount > 0 && (
								<span
									style={{
										background: "var(--tj-color-theme-primary)",
										color: "#fff",
										fontSize: "12px",
										padding: "2px 8px",
										borderRadius: "12px",
										marginLeft: "10px",
										fontWeight: 600,
									}}
								>
									{unreadCount} new
								</span>
							)}
						</h3>
						<p className="admin-card-subtitle">View and manage career applications</p>
					</div>
				</div>

				<div className="admin-card-body">
					{loading ? (
						<div className="admin-loading">
							<i className="fa-light fa-spinner fa-spin"></i>
							<span>Loading career applications...</span>
						</div>
					) : careers.length === 0 ? (
						<div className="admin-empty-state">
							<i className="fa-light fa-inbox"></i>
							<p>No career applications found.</p>
						</div>
					) : (
						<BaseTable
							columns={[
								{
									key: "__index",
									label: "No.",
									mobileVisible: false,
									render: (_value, _row, index) =>
										(pagination.currentPage - 1) * pagination.limit + index + 1,
								},
								{
									key: "name",
									label: "Name",
									mobileVisible: true,
									render: (value, row) => (
										<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
											{!row.isRead && (
												<span
													style={{
														width: "8px",
														height: "8px",
														borderRadius: "50%",
														background: "var(--tj-color-theme-primary)",
														flexShrink: 0,
													}}
												/>
											)}
											<span style={{ fontWeight: row.isRead ? 400 : 600 }}>
												{value || "-"}
											</span>
										</div>
									),
								},
								{
									key: "designation",
									label: "Designation",
									mobileVisible: true,
									render: (value) => value || "-",
								},
								{
									key: "experience",
									label: "Experience",
									mobileVisible: false,
									render: (value) => value || "-",
								},
								{
									key: "createdAt",
									label: "Date",
									mobileVisible: false,
									render: (value) => formatDate(value),
								},
								{
									key: "isRead",
									label: "Status",
									mobileVisible: false,
									render: (value) => (
										<span
											className={`admin-badge ${value ? "admin-badge-secondary" : "admin-badge-success"}`}
										>
											{value ? "Read" : "New"}
										</span>
									),
								},
								{
									key: "actions",
									label: "Actions",
									mobileVisible: true,
								},
							]}
							data={careers}
							nameKey="name"
							renderActions={(career) => (
								<>
									<button
										className="admin-btn-icon admin-btn-icon-view"
										onClick={() => handleView(career)}
										title="View"
									>
										<i className="fa-light fa-eye"></i>
									</button>
									<button
										className="admin-btn-icon admin-btn-icon-edit"
										onClick={() => handleToggleRead(career)}
										title={career.isRead ? "Mark as unread" : "Mark as read"}
									>
										<i className={`fa-light ${career.isRead ? "fa-envelope" : "fa-envelope-open"}`}></i>
									</button>
									<button
										className="admin-btn-icon admin-btn-icon-delete"
										onClick={() => handleDeleteClick(career)}
										title="Delete"
									>
										<i className="fa-light fa-trash"></i>
									</button>
								</>
							)}
							pagination={pagination.totalCount > 0 ? pagination : null}
							onPageChange={handlePageChange}
						/>
					)}
				</div>
			</div>

			{/* View Career Modal */}
			{viewingCareer && (
				<div className="admin-modal-overlay" onClick={() => setViewingCareer(null)}>
					<div className="admin-modal" onClick={(e) => e.stopPropagation()}>
						<div className="admin-modal-header">
							<h3 className="admin-modal-title">Career Application</h3>
							<button
								className="admin-modal-close"
								onClick={() => setViewingCareer(null)}
							>
								<i className="fa-light fa-times"></i>
							</button>
						</div>

						<div className="admin-modal-body">
							<div className="admin-contact-detail">
								<div className="admin-contact-detail-row">
									<div className="admin-contact-detail-label">Name</div>
									<div className="admin-contact-detail-value">{viewingCareer.name}</div>
								</div>
								<div className="admin-contact-detail-row">
									<div className="admin-contact-detail-label">Email</div>
									<div className="admin-contact-detail-value">
										<a href={`mailto:${viewingCareer.email}`} style={{ color: "var(--tj-color-theme-primary)" }}>
											{viewingCareer.email}
										</a>
									</div>
								</div>
								{viewingCareer.phone && (
									<div className="admin-contact-detail-row">
										<div className="admin-contact-detail-label">Phone</div>
										<div className="admin-contact-detail-value">
											<a href={`tel:${viewingCareer.phone}`} style={{ color: "var(--tj-color-theme-primary)" }}>
												{viewingCareer.phone}
											</a>
										</div>
									</div>
								)}
								{viewingCareer.address && (
									<div className="admin-contact-detail-row">
										<div className="admin-contact-detail-label">Address</div>
										<div className="admin-contact-detail-value">{viewingCareer.address}</div>
									</div>
								)}
								<div className="admin-contact-detail-row">
									<div className="admin-contact-detail-label">Designation</div>
									<div className="admin-contact-detail-value">{viewingCareer.designation}</div>
								</div>
								<div className="admin-contact-detail-row">
									<div className="admin-contact-detail-label">Experience</div>
									<div className="admin-contact-detail-value">{viewingCareer.experience}</div>
								</div>
								{viewingCareer.resume && (
									<div className="admin-contact-detail-row">
										<div className="admin-contact-detail-label">Resume</div>
										<div className="admin-contact-detail-value">
											<a
												href={viewingCareer.resume.startsWith("/") ? viewingCareer.resume : `/uploads/resumes/${viewingCareer.resume}`}
												target="_blank"
												rel="noopener noreferrer"
												style={{ color: "var(--tj-color-theme-primary)", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "6px" }}
											>
												<i className="fa-light fa-file-pdf"></i>
												<span>{viewingCareer.resume.startsWith("/") ? viewingCareer.resume.split("/").pop() : viewingCareer.resume}</span>
											</a>
										</div>
									</div>
								)}
								<div className="admin-contact-detail-row">
									<div className="admin-contact-detail-label">Date</div>
									<div className="admin-contact-detail-value">{formatDate(viewingCareer.createdAt)}</div>
								</div>
							</div>
						</div>

						<div className="admin-modal-footer">
							<button
								type="button"
								className="admin-btn admin-btn-secondary"
								onClick={() => setViewingCareer(null)}
							>
								Close
							</button>
							<a
								href={`mailto:${viewingCareer.email}?subject=Re: Career Application - ${viewingCareer.designation}`}
								className="admin-btn admin-btn-primary"
							>
								<i className="fa-light fa-reply" style={{ marginRight: "6px" }}></i>
								Reply
							</a>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			<DeleteConfirmModal
				isOpen={deleteModal.isOpen}
				onClose={handleDeleteModalClose}
				onConfirm={handleDeleteConfirm}
				title="Delete Career Application"
				message={`Are you sure you want to delete the application from "${deleteModal.careerName}"?`}
				itemName={deleteModal.careerName}
			/>
		</div>
	);
}
