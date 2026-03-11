"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";
import BaseTable from "@/components/admin/BaseTable";
import { toast } from "react-toastify";

export default function AdminTechnology() {
	const [technologies, setTechnologies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [uploadingImg, setUploadingImg] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [editingTechnology, setEditingTechnology] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		technologyId: null,
		technologyTitle: "",
	});
	const [formData, setFormData] = useState({
		name: "",
		category: "",
		title: "",
		img: "",
		description: "",
		features: [],
		isActive: true,
	});
	const [newFeature, setNewFeature] = useState("");
	const [pagination, setPagination] = useState({
		currentPage: 1,
		limit: 10,
		totalCount: 0,
		totalPages: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});

	// Fetch technologies with pagination
	const fetchTechnologies = (page = 1, limit = 10) => {
		setLoading(true);

		api.get(`/api/admin/technology?page=${page}&limit=${limit}`)
			.then((response) => {
				if (response.data.success) {
					const technologiesData = response.data.data || [];
					const paginationData = response.data.pagination || {};
					setTechnologies(technologiesData);
					setPagination({
						currentPage: paginationData.currentPage || page,
						limit: paginationData.limit || limit,
						totalCount: paginationData.totalCount || 0,
						totalPages: paginationData.totalPages || 0,
						hasNextPage: paginationData.hasNextPage || false,
						hasPrevPage: paginationData.hasPrevPage || false,
					});
				} else {
					toast.error("Failed to fetch technologies");
				}
			})
			.catch((err) => {
				console.error("Error fetching technologies:", err);
				toast.error(err.response?.data?.error || "Failed to fetch technologies");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// Handle page change
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			fetchTechnologies(newPage, pagination.limit);
		}
	};

	useEffect(() => {
		fetchTechnologies(1, 10);
	}, []);

	// Handle form input change
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	// Handle add feature
	const handleAddFeature = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (newFeature.trim()) {
			setFormData((prev) => ({
				...prev,
				features: [...(prev.features || []), newFeature.trim()],
			}));
			setNewFeature("");
		}
	};

	// Handle remove feature
	const handleRemoveFeature = (index) => {
		setFormData((prev) => ({
			...prev,
			features: prev.features.filter((_, i) => i !== index),
		}));
	};

	// Handle form submit (create or update)
	const handleSubmit = (e) => {
		e.preventDefault();

		// Basic validation
		if (!formData.name.trim()) {
			toast.error("Technology name is required.");
			return;
		}
		if (!formData.category.trim()) {
			toast.error("Category is required.");
			return;
		}
		if (!formData.img.trim()) {
			toast.error("Technology image URL is required.");
			return;
		}
		if (!formData.description?.trim()) {
			toast.error("Technology description is required.");
			return;
		}
		if (!formData.img.startsWith("/") && !formData.img.startsWith("http://") && !formData.img.startsWith("https://")) {
			toast.error("Image URL must be a valid URL or a relative path starting with /.");
			return;
		}

		setLoading(true);

		const technologyData = {
			name: formData.name.trim(),
			category: formData.category.trim(),
			title: formData.title.trim(),
			img: formData.img.trim(),
			description: formData.description.trim(),
			features: Array.isArray(formData.features) ? formData.features : [],
			isActive: formData.isActive !== undefined ? formData.isActive : true,
		};

		const request = editingTechnology
			? api.put(`/api/admin/technology/${editingTechnology._id}`, technologyData)
			: api.post("/api/admin/technology", technologyData);

		request
			.then((response) => {
				if (response.data.success) {
					toast.success(editingTechnology ? "Technology updated successfully!" : "Technology created successfully!");
					fetchTechnologies(pagination.currentPage, pagination.limit);
					handleCloseForm();
				} else {
					toast.error(response.data.error || "Operation failed");
				}
			})
			.catch((err) => {
				console.error("Error saving technology:", err);
				toast.error(err.response?.data?.error || "Failed to save technology");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// Upload technology image (multer)
	const handleImageUpload = (file) => {
		if (!file) return;

		setUploadingImg(true);

		const formDataUpload = new FormData();
		formDataUpload.append("file", file);

		api.post("/api/admin/upload/technology-image", formDataUpload, {
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
	const handleEdit = (technology) => {
		setEditingTechnology(technology);
		setFormData({
			name: technology.name || "",
			category: technology.category || "",
			title: technology.title || "",
			img: technology.img || "",
			description: technology.description || "",
			features: technology.features || [],
			isActive: technology.isActive !== undefined ? technology.isActive : true,
		});
		setNewFeature("");
		setShowForm(true);
	};

	// Handle delete click - open confirmation modal
	const handleDeleteClick = (technology) => {
		setDeleteModal({
			isOpen: true,
			technologyId: technology._id,
			technologyTitle: technology.name || technology.title,
		});
	};

	// Handle delete confirmation - actually delete the technology
	const handleDeleteConfirm = () => {
		if (!deleteModal.technologyId) return;

		api.delete(`/api/admin/technology/${deleteModal.technologyId}`)
			.then((response) => {
				if (response.data.success) {
					toast.success("Technology deleted successfully!");
					fetchTechnologies(pagination.currentPage, pagination.limit);
					setDeleteModal({ isOpen: false, technologyId: null, technologyTitle: "" });
				} else {
					toast.error(response.data.error || "Failed to delete technology");
					setDeleteModal({ isOpen: false, technologyId: null, technologyTitle: "" });
				}
			})
			.catch((err) => {
				console.error("Error deleting technology:", err);
				toast.error(err.response?.data?.error || "Failed to delete technology");
				setDeleteModal({ isOpen: false, technologyId: null, technologyTitle: "" });
			});
	};

	// Handle delete modal close
	const handleDeleteModalClose = () => {
		setDeleteModal({ isOpen: false, technologyId: null, technologyTitle: "" });
	};

	// Reset form
	const resetForm = () => {
		setFormData({
			name: "",
			category: "",
			title: "",
			img: "",
			description: "",
			features: [],
			isActive: true,
		});
		setNewFeature("");
		setEditingTechnology(null);
	};

	// Close form
	const handleCloseForm = () => {
		setShowForm(false);
		setEditingTechnology(null);
		resetForm();
	};

	return (
		<div className="admin-page">

			<div className="admin-card">
				<div className="admin-card-header">
					<div>
						<h3 className="admin-card-title">Technology Management</h3>
						<p className="admin-card-subtitle">Manage your technologies</p>
					</div>
					<button
						className="admin-btn admin-btn-primary"
						onClick={() => {
							resetForm();
							setShowForm(true);
						}}
					>
						<i className="fa-light fa-plus"></i>
						<span>Add New Technology</span>
					</button>
				</div>

				<div className="admin-card-body">
					{loading ? (
						<div className="admin-loading">
							<i className="fa-light fa-spinner fa-spin"></i>
							<span>Loading technologies...</span>
						</div>
					) : technologies.length === 0 ? (
						<div className="admin-empty-state">
							<i className="fa-light fa-inbox"></i>
							<p>No technologies found. Create your first technology!</p>
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
									label: "Technology Name",
									mobileVisible: true,
									render: (value, row) => (
										<div className="admin-table-title">{value || row.title || "-"}</div>
									),
								},
								{
									key: "category",
									label: "Category",
									mobileVisible: false,
									mobileLabel: "Category",
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
							data={technologies}
							nameKey="name"
							renderActions={(technology) => (
								<>
									<Link
										href={`/admin/technology/${technology.slug || technology._id}`}
										className="admin-btn-icon admin-btn-icon-view"
										title="View Details"
									>
										<i className="fa-light fa-eye"></i>
									</Link>
									<button
										className="admin-btn-icon admin-btn-icon-edit"
										onClick={() => handleEdit(technology)}
										title="Edit"
									>
										<i className="fa-light fa-edit"></i>
									</button>
									<button
										className="admin-btn-icon admin-btn-icon-delete"
										onClick={() => handleDeleteClick(technology)}
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
								{editingTechnology ? "Edit Technology" : "Add New Technology"}
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
										Technology Name <span className="admin-required">*</span>
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										placeholder="Enter technology name"
									/>
								</div>

								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="category">
										Category <span className="admin-required">*</span>
									</label>
									<select
										id="category"
										name="category"
										value={formData.category}
										onChange={handleChange}
										required
									>
										<option value="">Select a category</option>
										<option value="Web Development">Web Development</option>
										<option value="Application Development">Application Development</option>
										<option value="Backend & Database">Backend & Database</option>
									</select>
								</div>

								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="title">
										Title
									</label>
									<input
										type="text"
										id="title"
										name="title"
										value={formData.title}
										onChange={handleChange}
										placeholder="Enter technology title (displayed on detail page)"
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
											placeholder="/images/technology/tech-1.webp or /uploads/technology/image.jpg"
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
									<label htmlFor="technologyImageUpload">
										Or Upload Image File
									</label>
									<div className="admin-file-upload-wrapper">
										<input
											type="file"
											id="technologyImageUpload"
											className="admin-file-input"
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												handleImageUpload(file);
												e.target.value = "";
											}}
											disabled={uploadingImg}
										/>
										<label htmlFor="technologyImageUpload" className="admin-file-label">
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

								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="description">
										Description <span className="admin-required">*</span>
									</label>
									<textarea
										id="description"
										name="description"
										value={formData.description}
										onChange={handleChange}
										rows="5"
										placeholder="Enter technology description"
										required
									></textarea>
								</div>

								<div className="admin-form-group admin-form-group-full">
									<label>Features</label>
									<div className="admin-points-manager">
										{formData.features.length > 0 && (
											<div className="admin-points-list">
												{formData.features.map((feature, index) => (
													<div key={index} className="admin-point-item">
														<span className="admin-point-text">{feature}</span>
														<button
															type="button"
															className="admin-point-remove"
															onClick={() => handleRemoveFeature(index)}
															title="Remove feature"
														>
															<i className="fa-light fa-times"></i>
														</button>
													</div>
												))}
											</div>
										)}
										<div className="admin-points-input">
											<input
												type="text"
												value={newFeature}
												onChange={(e) => setNewFeature(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														e.stopPropagation();
														handleAddFeature(e);
													}
												}}
												placeholder="Enter a feature and press Enter or click Add"
											/>
											<button
												type="button"
												className="admin-btn admin-btn-primary admin-point-add"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													handleAddFeature(e);
												}}
											>
												<i className="fa-light fa-plus"></i>
												<span>Add</span>
											</button>
										</div>
									</div>
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
									{editingTechnology ? "Update Technology" : "Create Technology"}
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
				title="Delete Technology"
				message={`Are you sure you want to delete "${deleteModal.technologyTitle}"?`}
				itemName={deleteModal.technologyTitle}
			/>
		</div>
	);
}
