"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";
import BaseTable from "@/components/admin/BaseTable";
import { toast } from "react-toastify";
import Image from "next/image";

export default function AdminTeam() {
	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [uploadingImg, setUploadingImg] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [editingTeam, setEditingTeam] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		teamId: null,
		teamName: "",
	});
	const [formData, setFormData] = useState({
		name: "",
		img: "",
		position: "",
		isActive: true,
	});
	const [pagination, setPagination] = useState({
		currentPage: 1,
		limit: 10,
		totalCount: 0,
		totalPages: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});

	// Fetch team members with pagination
	const fetchTeams = (page = 1, limit = 10) => {
		setLoading(true);

		api.get(`/api/admin/team?page=${page}&limit=${limit}`)
			.then((response) => {
				if (response.data.success) {
					const teamsData = response.data.data || [];
					const paginationData = response.data.pagination || {};
					setTeams(teamsData);
					setPagination({
						currentPage: paginationData.currentPage || page,
						limit: paginationData.limit || limit,
						totalCount: paginationData.totalCount || 0,
						totalPages: paginationData.totalPages || 0,
						hasNextPage: paginationData.hasNextPage || false,
						hasPrevPage: paginationData.hasPrevPage || false,
					});
				} else {
					toast.error("Failed to fetch team members");
				}
			})
			.catch((err) => {
				console.error("Error fetching team members:", err);
				toast.error(err.response?.data?.error || "Failed to fetch team members");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// Handle page change
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			fetchTeams(newPage, pagination.limit);
		}
	};

	useEffect(() => {
		fetchTeams(1, 10);
	}, []);

	// Handle form input change
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	// Handle form submit (create or update)
	const handleSubmit = (e) => {
		e.preventDefault();

		// Basic validation
		if (!formData.name.trim()) {
			toast.error("Team member name is required.");
			return;
		}
		if (!formData.img.trim()) {
			toast.error("Team member image URL is required.");
			return;
		}
		if (!formData.position.trim()) {
			toast.error("Team member position is required.");
			return;
		}
		if (!formData.img.startsWith("/") && !formData.img.startsWith("http://") && !formData.img.startsWith("https://")) {
			toast.error("Image URL must be a valid URL or a relative path starting with /.");
			return;
		}

		setLoading(true);

		const teamData = {
			name: formData.name.trim(),
			img: formData.img.trim(),
			position: formData.position.trim(),
			isActive: formData.isActive !== undefined ? formData.isActive : true,
		};

		const request = editingTeam
			? api.put(`/api/admin/team/${editingTeam._id}`, teamData)
			: api.post("/api/admin/team", teamData);

		request
			.then((response) => {
				if (response.data.success) {
					toast.success(editingTeam ? "Team member updated successfully!" : "Team member created successfully!");
					fetchTeams(pagination.currentPage, pagination.limit);
					handleCloseForm();
				} else {
					toast.error(response.data.error || "Operation failed");
				}
			})
			.catch((err) => {
				console.error("Error saving team member:", err);
				toast.error(err.response?.data?.error || "Failed to save team member");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// Upload team image (multer)
	const handleImageUpload = (file) => {
		if (!file) return;

		setUploadingImg(true);

		const formDataUpload = new FormData();
		formDataUpload.append("file", file);

		api.post("/api/admin/upload/team-image", formDataUpload, {
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then((res) => {
				if (res.data?.success && res.data?.url) {
					setFormData((prev) => ({ ...prev, img: res.data.url }));
					toast.success("Image uploaded successfully!");
				} else {
					toast.error(res.data?.error || "Failed to upload image");
				}
			})
			.catch((err) => {
				console.error("Image upload error:", err);
				toast.error(err.response?.data?.error || err.message || "Failed to upload image");
			})
			.finally(() => {
				setUploadingImg(false);
			});
	};

	// Handle edit
	const handleEdit = (team) => {
		setEditingTeam(team);
		setFormData({
			name: team.name || "",
			img: team.img || "",
			position: team.position || "",
			isActive: team.isActive !== undefined ? team.isActive : true,
		});
		setShowForm(true);
	};

	// Handle delete click - open confirmation modal
	const handleDeleteClick = (team) => {
		setDeleteModal({
			isOpen: true,
			teamId: team._id,
			teamName: team.name || "Team Member",
		});
	};

	// Handle delete confirmation - actually delete the team member
	const handleDeleteConfirm = () => {
		if (!deleteModal.teamId) return;

		api.delete(`/api/admin/team/${deleteModal.teamId}`)
			.then((response) => {
				if (response.data.success) {
					toast.success("Team member deleted successfully!");
					fetchTeams(pagination.currentPage, pagination.limit);
					setDeleteModal({ isOpen: false, teamId: null, teamName: "" });
				} else {
					toast.error(response.data.error || "Failed to delete team member");
					setDeleteModal({ isOpen: false, teamId: null, teamName: "" });
				}
			})
			.catch((err) => {
				console.error("Error deleting team member:", err);
				toast.error(err.response?.data?.error || "Failed to delete team member");
				setDeleteModal({ isOpen: false, teamId: null, teamName: "" });
			});
	};

	// Handle delete modal close
	const handleDeleteModalClose = () => {
		setDeleteModal({ isOpen: false, teamId: null, teamName: "" });
	};

	// Reset form
	const resetForm = () => {
		setFormData({
			name: "",
			img: "",
			position: "",
			isActive: true,
		});
		setEditingTeam(null);
	};

	// Close form
	const handleCloseForm = () => {
		setShowForm(false);
		setEditingTeam(null);
		resetForm();
	};

	return (
		<div className="admin-page">
			<div className="admin-card">
				<div className="admin-card-header">
					<div>
						<h3 className="admin-card-title">Team Management</h3>
						<p className="admin-card-subtitle">Manage your team members</p>
					</div>
					<button
						className="admin-btn admin-btn-primary"
						onClick={() => {
							resetForm();
							setShowForm(true);
						}}
					>
						<i className="fa-light fa-plus"></i>
						<span>Add New Team Member</span>
					</button>
				</div>

				<div className="admin-card-body">
					{loading ? (
						<div className="admin-loading">
							<i className="fa-light fa-spinner fa-spin"></i>
							<span>Loading team members...</span>
						</div>
					) : teams.length === 0 ? (
						<div className="admin-empty-state">
							<i className="fa-light fa-inbox"></i>
							<p>No team members found. Create your first team member!</p>
						</div>
					) : (
						<BaseTable
							columns={[
								{
									key: "__index",
									label: "No.",
									mobileVisible: false,
									mobileLabel: "No.",
									render: (_value, _row, index) =>
										(pagination.currentPage - 1) * pagination.limit + index + 1,
								},
								{
									key: "name",
									label: "Name",
									mobileVisible: true,
									render: (value, row) => (
										<div className="admin-table-name-with-image">
											{row.img && (
												<div className="admin-table-avatar">
													<Image
														src={row.img}
														alt={value || "Team member"}
														width={40}
														height={40}
														style={{
															width: "40px",
															height: "40px",
															objectFit: "cover",
															borderRadius: "50%",
														}}
													/>
												</div>
											)}
											<div className="admin-table-title">{value || "-"}</div>
										</div>
									),
								},
								{
									key: "position",
									label: "Position",
									mobileVisible: false,
									mobileLabel: "Position",
									render: (value) => value || "-",
								},
								{
									key: "isActive",
									label: "Status",
									mobileVisible: false,
									mobileLabel: "Status",
									render: (value, row) => {
										let isActiveValue;
										if (row && row.isActive !== undefined) {
											isActiveValue = row.isActive;
										} else if (value !== undefined && value !== null) {
											isActiveValue = value;
										} else {
											isActiveValue = true;
										}

										const isActive = Boolean(isActiveValue);

										return (
											<span
												className={`admin-badge ${
													isActive ? "admin-badge-success" : "admin-badge-danger"
												}`}
											>
												{isActive ? "Active" : "Inactive"}
											</span>
										);
									},
								},
								{
									key: "actions",
									label: "Actions",
									mobileVisible: true,
								},
							]}
							data={teams}
							nameKey="name"
							renderActions={(team) => (
								<>
									<button
										className="admin-btn-icon admin-btn-icon-edit"
										onClick={() => handleEdit(team)}
										title="Edit"
									>
										<i className="fa-light fa-edit"></i>
									</button>
									<button
										className="admin-btn-icon admin-btn-icon-delete"
										onClick={() => handleDeleteClick(team)}
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

			{/* Add/Edit Form Modal */}
			{showForm && (
				<div className="admin-modal-overlay" onClick={handleCloseForm}>
					<div className="admin-modal" onClick={(e) => e.stopPropagation()}>
						<div className="admin-modal-header">
							<h3 className="admin-modal-title">
								{editingTeam ? "Edit Team Member" : "Add New Team Member"}
							</h3>
							<button
								className="admin-modal-close"
								onClick={handleCloseForm}
							>
								<i className="fa-light fa-times"></i>
							</button>
						</div>

						<form onSubmit={handleSubmit} className="admin-modal-body">
							<div className="admin-form-grid">
								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="name">
										Team Member Name <span className="admin-required">*</span>
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										placeholder="Enter team member name"
									/>
								</div>

								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="position">
										Position <span className="admin-required">*</span>
									</label>
									<input
										type="text"
										id="position"
										name="position"
										value={formData.position}
										onChange={handleChange}
										required
										placeholder="Enter team member position (e.g., CEO, Developer, Designer)"
									/>
								</div>

								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="img">
										Image URL <span className="admin-required">*</span>
									</label>
									<div className="admin-image-url-wrapper">
										<input
											type="text"
											id="img"
											name="img"
											value={formData.img}
											onChange={handleChange}
											placeholder="/images/team/team-1.webp or /uploads/team/image.jpg"
											required
											className={formData.img ? "has-value" : ""}
										/>
										{formData.img && (
											<button
												type="button"
												className="admin-image-clear-btn"
												onClick={() => setFormData((prev) => ({ ...prev, img: "" }))}
												title="Clear image URL"
											>
												<i className="fa-light fa-times"></i>
											</button>
										)}
									</div>
									<small className="admin-form-help">
										Enter image URL manually or upload a file below to auto-fill this field.
									</small>
								</div>

								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="teamImageUpload">
										Or Upload Image File
									</label>
									<div className="admin-file-upload-wrapper">
										<input
											type="file"
											id="teamImageUpload"
											className="admin-file-input"
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												handleImageUpload(file);
												e.target.value = "";
											}}
											disabled={uploadingImg}
										/>
										<label htmlFor="teamImageUpload" className="admin-file-label">
											<i className="fa-light fa-cloud-arrow-up"></i>
											<span>{uploadingImg ? "Uploading..." : "Choose Image File"}</span>
										</label>
										{uploadingImg && (
											<div className="admin-file-upload-progress">
												<div className="admin-file-upload-spinner">
													<i className="fa-light fa-spinner fa-spin"></i>
												</div>
											</div>
										)}
									</div>
									<small className="admin-form-help">
										{uploadingImg
											? "Uploading image, please wait..."
											: "Upload an image file and the Image URL field above will be automatically filled."
										}
									</small>
								</div>

								<div className="admin-form-group">
									<label htmlFor="isActive">Status</label>
									<label className="admin-checkbox-label">
										<input
											type="checkbox"
											id="isActive"
											name="isActive"
											checked={formData.isActive}
											onChange={handleChange}
										/>
										<span>Active</span>
									</label>
								</div>
							</div>

							<div className="admin-modal-footer">
								<button
									type="button"
									className="admin-btn admin-btn-secondary"
									onClick={handleCloseForm}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="admin-btn admin-btn-primary"
									disabled={loading || uploadingImg}
								>
									{editingTeam ? "Update Team Member" : "Create Team Member"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			<DeleteConfirmModal
				isOpen={deleteModal.isOpen}
				onClose={handleDeleteModalClose}
				onConfirm={handleDeleteConfirm}
				title="Delete Team Member"
				message={`Are you sure you want to delete "${deleteModal.teamName}"?`}
				itemName={deleteModal.teamName}
			/>
		</div>
	);
}
