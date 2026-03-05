"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";

export default function AdminServices() {
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
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
		order: 0,
	});
	const [newPoint, setNewPoint] = useState("");

	// Fetch services
	const fetchServices = () => {
		setLoading(true);
		setError("");

		api.get("/api/admin/services")
			.then((response) => {
				if (response.data.success) {
					const servicesData = response.data.data || [];
					console.log("Fetched services:", servicesData);
					setServices(servicesData);
				} else {
					setError("Failed to fetch services");
				}
			})
			.catch((err) => {
				console.error("Error fetching services:", err);
				setError(err.response?.data?.error || "Failed to fetch services");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchServices();
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
		setError("");

		// Basic validation
		if (!formData.name.trim()) {
			setError("Service name is required.");
			return;
		}
		if (!formData.img.trim()) {
			setError("Service image URL is required.");
			return;
		}
		if (!formData.img.startsWith("/") && !formData.img.startsWith("http://") && !formData.img.startsWith("https://")) {
			setError("Image URL must be a valid URL or a relative path starting with /.");
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
			order: formData.order !== undefined ? parseInt(formData.order) : 0,
		};

		console.log("Sending service data:", JSON.stringify(serviceData, null, 2));

		const request = editingService
			? api.put(`/api/admin/services/${editingService._id}`, serviceData)
			: api.post("/api/admin/services", serviceData);

		request
			.then((response) => {
				if (response.data.success) {
					fetchServices();
					handleCloseForm();
				} else {
					setError(response.data.error || "Operation failed");
				}
			})
			.catch((err) => {
				console.error("Error saving service:", err);
				setError(err.response?.data?.error || "Failed to save service");
			})
			.finally(() => {
				setLoading(false);
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
			order: service.order || 0,
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
					fetchServices();
					setDeleteModal({ isOpen: false, serviceId: null, serviceTitle: "" });
				} else {
					setError(response.data.error || "Failed to delete service");
					setDeleteModal({ isOpen: false, serviceId: null, serviceTitle: "" });
				}
			})
			.catch((err) => {
				console.error("Error deleting service:", err);
				setError(err.response?.data?.error || "Failed to delete service");
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
			order: 0,
		});
		setNewPoint("");
		setEditingService(null);
	};

	// Close form
	const handleCloseForm = () => {
		setShowForm(false);
		setEditingService(null);
		resetForm();
		setError("");
	};

	return (
		<div className="admin-page">
			{error && (
				<div className="admin-alert admin-alert-error">
					<i className="fa-light fa-circle-exclamation"></i>
					<span>{error}</span>
				</div>
			)}

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
						<div className="admin-table-wrapper">
							<table className="admin-table">
								<thead>
									<tr>
										<th>Order</th>
										<th>Service Name</th>
										<th>Status</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{services.map((service) => {
										const isActive = service.isActive !== undefined ? Boolean(service.isActive) : true;
										return (
											<tr key={service._id}>
												<td>{service.order || 0}</td>
												<td>
													<div className="admin-table-title">{service.name || service.title}</div>
												</td>
												<td>
													<span
														className={`admin-badge ${
															isActive
																? "admin-badge-success"
																: "admin-badge-danger"
														}`}
													>
														{isActive ? "Active" : "Inactive"}
													</span>
												</td>
												<td>
													<div className="admin-table-actions">
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
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
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
									<small className="admin-form-help">
										This title will be displayed on the service detail page. If left empty, the service name will be used.
									</small>
								</div>

								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="img">
										Image URL <span className="admin-required">*</span>
									</label>
									<input
										type="text"
										id="img"
										name="img"
										value={formData.img}
										onChange={handleChange}
										placeholder="/images/service/service-1.webp"
										required
									/>
									<small className="admin-form-help">
										Image displayed above the service title (Recommended: 420x450px)
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
															className="admin-btn-icon admin-btn-icon-delete admin-point-remove"
															onClick={() => handleRemovePoint(index)}
															title="Remove point"
														>
															<i className="fa-light fa-trash"></i>
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
									<label htmlFor="order">Order</label>
									<input
										type="number"
										id="order"
										name="order"
										value={formData.order}
										onChange={handleChange}
										placeholder="0"
									/>
								</div>

								<div className="admin-form-group">
									<label className="admin-checkbox-label">
										<input
											type="checkbox"
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
								<button type="submit" className="admin-btn admin-btn-primary">
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
