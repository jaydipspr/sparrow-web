"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";
import BaseTable from "@/components/admin/BaseTable";
import { toast } from "react-toastify";

export default function AdminContacts() {
	const [contacts, setContacts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		contactId: null,
		contactName: "",
	});
	const [viewingContact, setViewingContact] = useState(null);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		limit: 10,
		totalCount: 0,
		totalPages: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});
	const [unreadCount, setUnreadCount] = useState(0);

	// Fetch contacts with pagination
	const fetchContacts = (page = 1, limit = 10) => {
		setLoading(true);

		api.get(`/api/admin/contacts?page=${page}&limit=${limit}`)
			.then((response) => {
				if (response.data.success) {
					const contactsData = response.data.data || [];
					const paginationData = response.data.pagination || {};
					setContacts(contactsData);
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
					toast.error("Failed to fetch contacts");
				}
			})
			.catch((err) => {
				console.error("Error fetching contacts:", err);
				toast.error(err.response?.data?.error || "Failed to fetch contacts");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// Handle page change
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			fetchContacts(newPage, pagination.limit);
		}
	};

	useEffect(() => {
		fetchContacts(1, 10);
	}, []);

	// View contact details and mark as read
	const handleView = (contact) => {
		setViewingContact(contact);

		// Mark as read if not already
		if (!contact.isRead) {
			api.put(`/api/admin/contacts/${contact._id}`, { isRead: true })
				.then((response) => {
					if (response.data.success) {
						// Update local state
						setContacts((prev) =>
							prev.map((c) =>
								c._id === contact._id ? { ...c, isRead: true } : c
							)
						);
						setUnreadCount((prev) => Math.max(0, prev - 1));
					}
				})
				.catch((err) => {
					console.error("Error marking contact as read:", err);
				});
		}
	};

	// Toggle read/unread
	const handleToggleRead = (contact) => {
		const newIsRead = !contact.isRead;

		api.put(`/api/admin/contacts/${contact._id}`, { isRead: newIsRead })
			.then((response) => {
				if (response.data.success) {
					setContacts((prev) =>
						prev.map((c) =>
							c._id === contact._id ? { ...c, isRead: newIsRead } : c
						)
					);
					setUnreadCount((prev) =>
						newIsRead ? Math.max(0, prev - 1) : prev + 1
					);
					toast.success(newIsRead ? "Marked as read" : "Marked as unread");
				}
			})
			.catch((err) => {
				console.error("Error updating contact:", err);
				toast.error("Failed to update contact");
			});
	};

	// Handle delete click
	const handleDeleteClick = (contact) => {
		setDeleteModal({
			isOpen: true,
			contactId: contact._id,
			contactName: contact.name || "Contact",
		});
	};

	// Handle delete confirmation
	const handleDeleteConfirm = () => {
		if (!deleteModal.contactId) return;

		api.delete(`/api/admin/contacts/${deleteModal.contactId}`)
			.then((response) => {
				if (response.data.success) {
					toast.success("Contact deleted successfully!");
					fetchContacts(pagination.currentPage, pagination.limit);
					setDeleteModal({ isOpen: false, contactId: null, contactName: "" });
					// Close detail modal if viewing the deleted contact
					if (viewingContact && viewingContact._id === deleteModal.contactId) {
						setViewingContact(null);
					}
				} else {
					toast.error(response.data.error || "Failed to delete contact");
					setDeleteModal({ isOpen: false, contactId: null, contactName: "" });
				}
			})
			.catch((err) => {
				console.error("Error deleting contact:", err);
				toast.error(err.response?.data?.error || "Failed to delete contact");
				setDeleteModal({ isOpen: false, contactId: null, contactName: "" });
			});
	};

	// Handle delete modal close
	const handleDeleteModalClose = () => {
		setDeleteModal({ isOpen: false, contactId: null, contactName: "" });
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
							Contact Messages
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
						<p className="admin-card-subtitle">View and manage contact form submissions</p>
					</div>
				</div>

				<div className="admin-card-body">
					{loading ? (
						<div className="admin-loading">
							<i className="fa-light fa-spinner fa-spin"></i>
							<span>Loading contacts...</span>
						</div>
					) : contacts.length === 0 ? (
						<div className="admin-empty-state">
							<i className="fa-light fa-inbox"></i>
							<p>No contact messages found.</p>
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
									key: "email",
									label: "Email",
									mobileVisible: false,
									render: (value) => (
										<a href={`mailto:${value}`} style={{ color: "var(--tj-color-theme-primary)" }}>
											{value || "-"}
										</a>
									),
								},
								{
									key: "subject",
									label: "Subject",
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
							data={contacts}
							nameKey="name"
							renderActions={(contact) => (
								<>
									<button
										className="admin-btn-icon admin-btn-icon-view"
										onClick={() => handleView(contact)}
										title="View"
									>
										<i className="fa-light fa-eye"></i>
									</button>
									<button
										className="admin-btn-icon admin-btn-icon-edit"
										onClick={() => handleToggleRead(contact)}
										title={contact.isRead ? "Mark as unread" : "Mark as read"}
									>
										<i className={`fa-light ${contact.isRead ? "fa-envelope" : "fa-envelope-open"}`}></i>
									</button>
									<button
										className="admin-btn-icon admin-btn-icon-delete"
										onClick={() => handleDeleteClick(contact)}
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

			{/* View Contact Modal */}
			{viewingContact && (
				<div className="admin-modal-overlay" onClick={() => setViewingContact(null)}>
					<div className="admin-modal" onClick={(e) => e.stopPropagation()}>
						<div className="admin-modal-header">
							<h3 className="admin-modal-title">Contact Message</h3>
							<button
								className="admin-modal-close"
								onClick={() => setViewingContact(null)}
							>
								<i className="fa-light fa-times"></i>
							</button>
						</div>

						<div className="admin-modal-body">
							<div className="admin-contact-detail">
								<div className="admin-contact-detail-row">
									<div className="admin-contact-detail-label">Name</div>
									<div className="admin-contact-detail-value">{viewingContact.name}</div>
								</div>
								<div className="admin-contact-detail-row">
									<div className="admin-contact-detail-label">Email</div>
									<div className="admin-contact-detail-value">
										<a href={`mailto:${viewingContact.email}`} style={{ color: "var(--tj-color-theme-primary)" }}>
											{viewingContact.email}
										</a>
									</div>
								</div>
								{viewingContact.phone && (
									<div className="admin-contact-detail-row">
										<div className="admin-contact-detail-label">Phone</div>
										<div className="admin-contact-detail-value">
											<a href={`tel:${viewingContact.phone}`} style={{ color: "var(--tj-color-theme-primary)" }}>
												{viewingContact.phone}
											</a>
										</div>
									</div>
								)}
								{viewingContact.subject && (
									<div className="admin-contact-detail-row">
										<div className="admin-contact-detail-label">Subject</div>
										<div className="admin-contact-detail-value">{viewingContact.subject}</div>
									</div>
								)}
								<div className="admin-contact-detail-row">
									<div className="admin-contact-detail-label">Date</div>
									<div className="admin-contact-detail-value">{formatDate(viewingContact.createdAt)}</div>
								</div>
								<div className="admin-contact-detail-row admin-contact-detail-message">
									<div className="admin-contact-detail-label">Message</div>
									<div className="admin-contact-detail-value">
										{viewingContact.message}
									</div>
								</div>
							</div>
						</div>

						<div className="admin-modal-footer">
							<button
								type="button"
								className="admin-btn admin-btn-secondary"
								onClick={() => setViewingContact(null)}
							>
								Close
							</button>
							<a
								href={`mailto:${viewingContact.email}?subject=Re: ${viewingContact.subject || "Your inquiry"}`}
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
				title="Delete Contact"
				message={`Are you sure you want to delete the message from "${deleteModal.contactName}"?`}
				itemName={deleteModal.contactName}
			/>
		</div>
	);
}
