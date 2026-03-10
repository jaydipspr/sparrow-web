"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";
import BaseTable from "@/components/admin/BaseTable";
import { toast } from "react-toastify";

export default function AdminServices() {
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [uploadingImg, setUploadingImg] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [editingService, setEditingService] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		serviceId: null,
		serviceTitle: "",
	});
	const [formData, setFormData] = useState({
		name: "",
		title: "",
		img: "",
		description: "",
		points: [],
		isActive: true,
	});
	const [newPoint, setNewPoint] = useState("");
	const [pagination, setPagination] = useState({
		currentPage: 1,
		limit: 10,
		totalCount: 0,
		totalPages: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});

	// Fetch services with pagination
	const fetchServices = (page = 1, limit = 10) => {
		setLoading(true);

		api.get(`/api/admin/services?page=${page}&limit=${limit}`)
			.then((response) => {
				if (response.data.success) {
					const servicesData = response.data.data || [];
					const paginationData = response.data.pagination || {};
					setServices(servicesData);
					setPagination({
						currentPage: paginationData.currentPage || page,
						limit: paginationData.limit || limit,
						totalCount: paginationData.totalCount || 0,
						totalPages: paginationData.totalPages || 0,
						hasNextPage: paginationData.hasNextPage || false,
						hasPrevPage: paginationData.hasPrevPage || false,
					});
				} else {
					toast.error("Failed to fetch services");
				}
			})
			.catch((err) => {
				console.error("Error fetching services:", err);
				toast.error(err.response?.data?.error || "Failed to fetch services");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// Handle page change
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			fetchServices(newPage, pagination.limit);
		}
	};

	useEffect(() => {
		fetchServices(1, 10);
	}, []);

	// Handle form input change
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	// Handle add point
	const handleAddPoint = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (newPoint.trim()) {
			setFormData((prev) => ({
				...prev,
				points: [...(prev.points || []), newPoint.trim()],
			}));
			setNewPoint("");
		}
	};

	// Handle remove point
	const handleRemovePoint = (index) => {
		setFormData((prev) => ({
			...prev,
			points: prev.points.filter((_, i) => i !== index),
		}));
	};

	// Handle form submit (create or update)
	const handleSubmit = (e) => {
		e.preventDefault();

		// Basic validation
		if (!formData.name.trim()) {
			toast.error("Service name is required.");
			return;
		}
		if (!formData.img.trim()) {
			toast.error("Service image URL is required.");
			return;
		}
		if (!formData.img.startsWith("/") && !formData.img.startsWith("http://") && !formData.img.startsWith("https://")) {
			toast.error("Image URL must be a valid URL or a relative path starting with /.");
			return;
		}

		setLoading(true);

		const serviceData = {
			name: formData.name.trim(),
			title: formData.title.trim(),
			img: formData.img.trim(),
			description: formData.description || "",
			points: Array.isArray(formData.points) ? formData.points : [],
			isActive: formData.isActive !== undefined ? formData.isActive : true,
		};

		const request = editingService
			? api.put(`/api/admin/services/${editingService._id}`, serviceData)
			: api.post("/api/admin/services", serviceData);

		request
			.then((response) => {
				if (response.data.success) {
					toast.success(editingService ? "Service updated successfully!" : "Service created successfully!");
					fetchServices(pagination.currentPage, pagination.limit);
					handleCloseForm();
				} else {
					toast.error(response.data.error || "Operation failed");
				}
			})
			.catch((err) => {
				console.error("Error saving service:", err);
				toast.error(err.response?.data?.error || "Failed to save service");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// Upload service image (multer)
	const handleImageUpload = (file) => {
		if (!file) return;

		setUploadingImg(true);

		const formDataUpload = new FormData();
		formDataUpload.append("file", file);

		api.post("/api/admin/upload/service-image", formDataUpload, {
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
	const handleEdit = (service) => {
		setEditingService(service);
		setFormData({
			name: service.name || "",
			title: service.title || "",
			img: service.img || "",
			description: service.description || "",
			points: service.points || [],
			isActive: service.isActive !== undefined ? service.isActive : true,
		});
		setNewPoint("");
		setShowForm(true);
	};

	// Handle delete click - open confirmation modal
		const handleDeleteClick = (service) => {
		setDeleteModal({
			isOpen: true,
			serviceId: service._id,
			serviceTitle: service.name || service.title,
		});
	};

	// Handle delete confirmation - actually delete the service
	const handleDeleteConfirm = () => {
		if (!deleteModal.serviceId) return;

		api.delete(`/api/admin/services/${deleteModal.serviceId}`)
			.then((response) => {
				if (response.data.success) {
					toast.success("Service deleted successfully!");
					fetchServices(pagination.currentPage, pagination.limit);
					setDeleteModal({ isOpen: false, serviceId: null, serviceTitle: "" });
				} else {
					toast.error(response.data.error || "Failed to delete service");
					setDeleteModal({ isOpen: false, serviceId: null, serviceTitle: "" });
				}
			})
			.catch((err) => {
				console.error("Error deleting service:", err);
				toast.error(err.response?.data?.error || "Failed to delete service");
				setDeleteModal({ isOpen: false, serviceId: null, serviceTitle: "" });
			});
	};

	// Handle delete modal close
	const handleDeleteModalClose = () => {
		setDeleteModal({ isOpen: false, serviceId: null, serviceTitle: "" });
	};

	// Reset form
	const resetForm = () => {
		setFormData({
			name: "",
			title: "",
			img: "",
			description: "",
			points: [],
			isActive: true,
		});
		setNewPoint("");
		setEditingService(null);
	};

	// Close form
	const handleCloseForm = () => {
		setShowForm(false);
		setEditingService(null);
		resetForm();
	};

	return (
		<div className="admin-page">

			<div className="admin-card">
				<div className="admin-card-header">
					<div>
						<h3 className="admin-card-title">Services Management</h3>
						<p className="admin-card-subtitle">Manage your services</p>
					</div>
					<button
						className="admin-btn admin-btn-primary"
						onClick={() => {
							resetForm();
							setShowForm(true);
						}}
					>
						<i className="fa-light fa-plus"></i>
						<span>Add New Service</span>
					</button>
				</div>

				<div className="admin-card-body">
					{loading ? (
						<div className="admin-loading">
							<i className="fa-light fa-spinner fa-spin"></i>
							<span>Loading services...</span>
						</div>
					) : services.length === 0 ? (
						<div className="admin-empty-state">
							<i className="fa-light fa-inbox"></i>
							<p>No services found. Create your first service!</p>
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
									label: "Service Name",
									mobileVisible: true,
									render: (value, row) => (
										<div className="admin-table-title">{value || row.title || "-"}</div>
									),
								},
								{
									key: "isActive",
									label: "Status",
									mobileVisible: false,
									mobileLabel: "Status",
									render: (value, row) => {
										// Check both row.isActive and value parameter, default to true if undefined
										let isActiveValue;
										if (row && row.isActive !== undefined) {
											isActiveValue = row.isActive;
										} else if (value !== undefined && value !== null) {
											isActiveValue = value;
										} else {
											isActiveValue = true; // Default to active
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
							data={services}
							nameKey="name"
							renderActions={(service) => (
								<>
									<Link
										href={`/admin/services/${service.slug || service._id}`}
										className="admin-btn-icon admin-btn-icon-view"
										title="View Details"
									>
										<i className="fa-light fa-eye"></i>
									</Link>
									<button
										className="admin-btn-icon admin-btn-icon-edit"
										onClick={() => handleEdit(service)}
										title="Edit"
									>
										<i className="fa-light fa-edit"></i>
									</button>
									<button
										className="admin-btn-icon admin-btn-icon-delete"
										onClick={() => handleDeleteClick(service)}
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
								{editingService ? "Edit Service" : "Add New Service"}
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
										Service Name <span className="admin-required">*</span>
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										placeholder="Enter service name"
									/>
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
										placeholder="Enter service title (displayed on detail page)"
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
											placeholder="/images/service/service-1.webp or /uploads/services/image.jpg"
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
									<label htmlFor="serviceImageUpload">
										Or Upload Image File
									</label>
									<div className="admin-file-upload-wrapper">
										<input
											type="file"
											id="serviceImageUpload"
											className="admin-file-input"
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												handleImageUpload(file);
												// allow uploading same file again
												e.target.value = "";
											}}
											disabled={uploadingImg}
										/>
										<label htmlFor="serviceImageUpload" className="admin-file-label">
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
									<label htmlFor="description">Description</label>
									<textarea
										id="description"
										name="description"
										value={formData.description}
										onChange={handleChange}
										rows="5"
										placeholder="Enter service description"
									></textarea>
								</div>

								<div className="admin-form-group admin-form-group-full">
									<label>Points</label>
									<div className="admin-points-manager">
										{formData.points.length > 0 && (
											<div className="admin-points-list">
												{formData.points.map((point, index) => (
													<div key={index} className="admin-point-item">
														<span className="admin-point-text">{point}</span>
														<button
															type="button"
															className="admin-point-remove"
															onClick={() => handleRemovePoint(index)}
															title="Remove point"
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
												value={newPoint}
												onChange={(e) => setNewPoint(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														e.stopPropagation();
														handleAddPoint(e);
													}
												}}
												placeholder="Enter a point and press Enter or click Add"
											/>
											<button
												type="button"
												className="admin-btn admin-btn-primary admin-point-add"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													handleAddPoint(e);
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
									{editingService ? "Update Service" : "Create Service"}
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
				title="Delete Service"
				message={`Are you sure you want to delete "${deleteModal.serviceTitle}"?`}
				itemName={deleteModal.serviceTitle}
			/>
		</div>
	);
}
