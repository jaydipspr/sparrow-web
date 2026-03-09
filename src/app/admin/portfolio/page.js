"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";
import BaseTable from "@/components/admin/BaseTable";
import { toast } from "react-toastify";

export default function AdminPortfolio() {
	const [portfolios, setPortfolios] = useState([]);
	const [loading, setLoading] = useState(true);
	const [uploadingImg, setUploadingImg] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [editingPortfolio, setEditingPortfolio] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		portfolioId: null,
		portfolioName: "",
	});
	const [formData, setFormData] = useState({
		name: "",
		title: "",
		img: "",
		description: "",
		category: "",
		keyHighlights: [],
		technology: [],
		projectLink: "",
		isActive: true,
	});
	const [newKeyHighlight, setNewKeyHighlight] = useState("");
	const [availableTechnologies, setAvailableTechnologies] = useState([]);
	const [techDropdownOpen, setTechDropdownOpen] = useState(false);
	const techDropdownRef = useRef(null);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		limit: 10,
		totalCount: 0,
		totalPages: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});

	// Portfolio categories
	const categories = [
		"Web Development",
		"Application Development",
		"Backend & Database",
		"UI/UX Design",
		"E-commerce",
		"Other",
	];

	// Fetch portfolios with pagination
	const fetchPortfolios = (page = 1, limit = 10) => {
		setLoading(true);

		api.get(`/api/admin/portfolio?page=${page}&limit=${limit}`)
			.then((response) => {
				if (response.data.success) {
					const portfoliosData = response.data.data || [];
					const paginationData = response.data.pagination || {};
					setPortfolios(portfoliosData);
					setPagination({
						currentPage: paginationData.currentPage || page,
						limit: paginationData.limit || limit,
						totalCount: paginationData.totalCount || 0,
						totalPages: paginationData.totalPages || 0,
						hasNextPage: paginationData.hasNextPage || false,
						hasPrevPage: paginationData.hasPrevPage || false,
					});
				} else {
					toast.error("Failed to fetch portfolios");
				}
			})
			.catch((err) => {
				console.error("Error fetching portfolios:", err);
				toast.error(err.response?.data?.error || "Failed to fetch portfolios");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// Handle page change
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			fetchPortfolios(newPage, pagination.limit);
		}
	};

	// Fetch available technologies for multi-select
	const fetchTechnologies = () => {
		api.get("/api/admin/technology?limit=100")
			.then((response) => {
				if (response.data.success) {
					const techs = response.data.data || [];
					setAvailableTechnologies(techs);
				}
			})
			.catch((err) => {
				console.error("Error fetching technologies:", err);
			});
	};

	useEffect(() => {
		fetchPortfolios(1, 10);
		fetchTechnologies();
	}, []);

	// Close tech dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (techDropdownRef.current && !techDropdownRef.current.contains(e.target)) {
				setTechDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Handle form input change
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	// Handle add key highlight
	const handleAddKeyHighlight = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (newKeyHighlight.trim()) {
			setFormData((prev) => ({
				...prev,
				keyHighlights: [...(prev.keyHighlights || []), newKeyHighlight.trim()],
			}));
			setNewKeyHighlight("");
		}
	};

	// Handle remove key highlight
	const handleRemoveKeyHighlight = (index) => {
		setFormData((prev) => ({
			...prev,
			keyHighlights: prev.keyHighlights.filter((_, i) => i !== index),
		}));
	};

	// Handle toggle technology selection (multi-select)
	const handleToggleTechnology = (tech) => {
		setFormData((prev) => {
			const currentTech = prev.technology || [];
			const isSelected = currentTech.some((t) => t.id === tech._id);
			if (isSelected) {
				return {
					...prev,
					technology: currentTech.filter((t) => t.id !== tech._id),
				};
			} else {
				return {
					...prev,
					technology: [
						...currentTech,
						{ id: tech._id, name: tech.name, slug: tech.slug || "" },
					],
				};
			}
		});
	};

	// Handle remove technology
	const handleRemoveTechnology = (techId) => {
		setFormData((prev) => ({
			...prev,
			technology: (prev.technology || []).filter((t) => t.id !== techId),
		}));
	};

	// Handle form submit (create or update)
	const handleSubmit = (e) => {
		e.preventDefault();

		// Basic validation
		if (!formData.name.trim()) {
			toast.error("Portfolio name is required.");
			return;
		}
		if (!formData.category.trim()) {
			toast.error("Category is required.");
			return;
		}
		if (!formData.img.trim()) {
			toast.error("Portfolio image URL is required.");
			return;
		}
		if (!formData.img.startsWith("/") && !formData.img.startsWith("http://") && !formData.img.startsWith("https://")) {
			toast.error("Image URL must be a valid URL or a relative path starting with /.");
			return;
		}

		setLoading(true);

		const portfolioData = {
			name: formData.name.trim(),
			title: formData.title.trim(),
			img: formData.img.trim(),
			description: formData.description || "",
			category: formData.category.trim(),
			keyHighlights: Array.isArray(formData.keyHighlights) ? formData.keyHighlights : [],
			technology: Array.isArray(formData.technology) ? formData.technology : [],
			projectLink: formData.projectLink.trim() || "",
			isActive: formData.isActive !== undefined ? formData.isActive : true,
		};

		const request = editingPortfolio
			? api.put(`/api/admin/portfolio/${editingPortfolio._id}`, portfolioData)
			: api.post("/api/admin/portfolio", portfolioData);

		request
			.then((response) => {
				if (response.data.success) {
					toast.success(editingPortfolio ? "Portfolio updated successfully!" : "Portfolio created successfully!");
					fetchPortfolios(pagination.currentPage, pagination.limit);
					handleCloseForm();
				} else {
					toast.error(response.data.error || "Operation failed");
				}
			})
			.catch((err) => {
				console.error("Error saving portfolio:", err);
				toast.error(err.response?.data?.error || "Failed to save portfolio");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// Upload portfolio image (multer)
	const handleImageUpload = (file) => {
		if (!file) return;

		setUploadingImg(true);

		const formDataUpload = new FormData();
		formDataUpload.append("file", file);

		api.post("/api/admin/upload/portfolio-image", formDataUpload, {
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
	const handleEdit = (portfolio) => {
		setEditingPortfolio(portfolio);
		// Normalize technology to new format (handle legacy string arrays)
		let techArray = portfolio.technology || [];
		if (techArray.length > 0 && typeof techArray[0] === "string") {
			// Legacy format: try to match strings to available technologies
			techArray = techArray.map((techName) => {
				const match = availableTechnologies.find(
					(t) => t.name === techName || t.slug === techName
				);
				return match
					? { id: match._id, name: match.name, slug: match.slug || "" }
					: { id: techName, name: techName, slug: "" };
			});
		}
		setFormData({
			name: portfolio.name || "",
			title: portfolio.title || "",
			img: portfolio.img || "",
			description: portfolio.description || "",
			category: portfolio.category || "",
			keyHighlights: portfolio.keyHighlights || [],
			technology: techArray,
			projectLink: portfolio.projectLink || "",
			isActive: portfolio.isActive !== undefined ? portfolio.isActive : true,
		});
		setNewKeyHighlight("");
		setShowForm(true);
	};

	// Handle delete click - open confirmation modal
	const handleDeleteClick = (portfolio) => {
		setDeleteModal({
			isOpen: true,
			portfolioId: portfolio._id,
			portfolioName: portfolio.name,
		});
	};

	// Handle delete confirmation - actually delete the portfolio
	const handleDeleteConfirm = () => {
		if (!deleteModal.portfolioId) return;

		api.delete(`/api/admin/portfolio/${deleteModal.portfolioId}`)
			.then((response) => {
				if (response.data.success) {
					toast.success(`Portfolio "${deleteModal.portfolioName}" deleted successfully!`);
					fetchPortfolios(pagination.currentPage, pagination.limit);
					setDeleteModal({ isOpen: false, portfolioId: null, portfolioName: "" });
				} else {
					toast.error(response.data.error || "Failed to delete portfolio");
					setDeleteModal({ isOpen: false, portfolioId: null, portfolioName: "" });
				}
			})
			.catch((err) => {
				console.error("Error deleting portfolio:", err);
				toast.error(err.response?.data?.error || "Failed to delete portfolio");
				setDeleteModal({ isOpen: false, portfolioId: null, portfolioName: "" });
			});
	};

	// Handle delete modal close
	const handleDeleteModalClose = () => {
		setDeleteModal({ isOpen: false, portfolioId: null, portfolioName: "" });
	};

	// Reset form
	const resetForm = () => {
		setFormData({
			name: "",
			title: "",
			img: "",
			description: "",
			category: "",
			keyHighlights: [],
			technology: [],
			projectLink: "",
			isActive: true,
		});
		setNewKeyHighlight("");
		setEditingPortfolio(null);
	};

	// Close form
	const handleCloseForm = () => {
		setShowForm(false);
		setEditingPortfolio(null);
		resetForm();
	};

	return (
		<div className="admin-page">
			<div className="admin-card">
				<div className="admin-card-header">
					<div>
						<h3 className="admin-card-title">Portfolio Management</h3>
						<p className="admin-card-subtitle">Manage your portfolios</p>
					</div>
					<button
						className="admin-btn admin-btn-primary"
						onClick={() => {
							resetForm();
							setShowForm(true);
						}}
					>
						<i className="fa-light fa-plus"></i>
						<span>Add New Portfolio</span>
					</button>
				</div>

				<div className="admin-card-body">
					{loading ? (
						<div className="admin-loading">
							<i className="fa-light fa-spinner fa-spin"></i>
							<span>Loading portfolios...</span>
						</div>
					) : portfolios.length === 0 ? (
						<div className="admin-empty-state">
							<i className="fa-light fa-inbox"></i>
							<p>No portfolios found. Create your first portfolio!</p>
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
									label: "Portfolio Name",
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
							data={portfolios}
							nameKey="name"
							renderActions={(portfolio) => (
								<>
									<Link
										href={`/admin/portfolio/${portfolio.slug || portfolio._id}`}
										className="admin-btn-icon admin-btn-icon-view"
										title="View Details"
									>
										<i className="fa-light fa-eye"></i>
									</Link>
									<button
										className="admin-btn-icon admin-btn-icon-edit"
										onClick={() => handleEdit(portfolio)}
										title="Edit"
									>
										<i className="fa-light fa-edit"></i>
									</button>
									<button
										className="admin-btn-icon admin-btn-icon-delete"
										onClick={() => handleDeleteClick(portfolio)}
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
								{editingPortfolio ? "Edit Portfolio" : "Add New Portfolio"}
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
										Portfolio Name <span className="admin-required">*</span>
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										placeholder="Enter portfolio name"
									/>
								</div>

								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="title">Title</label>
									<input
										type="text"
										id="title"
										name="title"
										value={formData.title}
										onChange={handleChange}
										placeholder="Enter portfolio title"
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
										<option value="">Select Category</option>
										{categories.map((cat) => (
											<option key={cat} value={cat}>
												{cat}
											</option>
										))}
									</select>
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
											placeholder="/images/portfolio/portfolio-1.webp or /uploads/portfolio/image.jpg"
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
									<label htmlFor="portfolioImageUpload">Or Upload Image File</label>
									<div className="admin-file-upload-wrapper">
										<input
											type="file"
											id="portfolioImageUpload"
											className="admin-file-input"
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												handleImageUpload(file);
												e.target.value = "";
											}}
											disabled={uploadingImg}
										/>
										<label htmlFor="portfolioImageUpload" className="admin-file-label">
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
										rows={4}
										placeholder="Enter portfolio description"
									/>
								</div>

								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="projectLink">Project Link</label>
									<input
										type="url"
										id="projectLink"
										name="projectLink"
										value={formData.projectLink}
										onChange={handleChange}
										placeholder="https://example.com"
									/>
								</div>

								{/* Key Highlights Manager */}
								<div className="admin-form-group admin-form-group-full">
									<label>Key Highlights</label>
									<div className="admin-points-manager">
										{formData.keyHighlights && formData.keyHighlights.length > 0 && (
											<ul className="admin-points-list">
												{formData.keyHighlights.map((highlight, index) => (
													<li key={index} className="admin-point-item">
														<span>{highlight}</span>
														<button
															type="button"
															className="admin-point-remove"
															onClick={() => handleRemoveKeyHighlight(index)}
														>
															<i className="fa-light fa-times"></i>
														</button>
													</li>
												))}
											</ul>
										)}
										<div className="admin-points-input">
											<input
												type="text"
												value={newKeyHighlight}
												onChange={(e) => setNewKeyHighlight(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														e.stopPropagation();
														handleAddKeyHighlight(e);
													}
												}}
												placeholder="Enter a key highlight and press Enter or click Add"
											/>
											<button
												type="button"
												className="admin-btn admin-btn-primary admin-point-add"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													handleAddKeyHighlight(e);
												}}
											>
												<i className="fa-light fa-plus"></i>
												<span>Add</span>
											</button>
										</div>
									</div>
								</div>

								{/* Technology Multi-Select Dropdown */}
								<div className="admin-form-group admin-form-group-full">
									<label>Technology</label>
									{/* Selected technologies as tags */}
									{formData.technology && formData.technology.length > 0 && (
										<div className="admin-tech-selected">
											{formData.technology.map((tech) => (
												<span key={tech.id} className="admin-tech-tag">
													{tech.name}
													<button
														type="button"
														className="admin-tech-tag-remove"
														onClick={() => handleRemoveTechnology(tech.id)}
													>
														<i className="fa-light fa-times"></i>
													</button>
												</span>
											))}
										</div>
									)}
									{/* Custom dropdown with checkboxes */}
									<div className="admin-tech-dropdown" ref={techDropdownRef}>
										<div
											className="admin-tech-dropdown-trigger"
											onClick={() => setTechDropdownOpen((prev) => !prev)}
										>
											<span>
												{(formData.technology || []).length > 0
													? `${formData.technology.length} selected`
													: "Select Technology"}
											</span>
											<i className={`fa-light fa-chevron-${techDropdownOpen ? "up" : "down"}`}></i>
										</div>
										{techDropdownOpen && (
											<div className="admin-tech-dropdown-menu">
												{availableTechnologies.filter((t) => t.isActive !== false).length > 0 ? (
													availableTechnologies
														.filter((t) => t.isActive !== false)
														.map((tech) => {
															const isSelected = (formData.technology || []).some(
																(t) => t.id === tech._id
															);
															return (
																<label
																	key={tech._id}
																	className={`admin-tech-dropdown-item ${isSelected ? "selected" : ""}`}
																>
																	<input
																		type="checkbox"
																		checked={isSelected}
																		onChange={() => handleToggleTechnology(tech)}
																	/>
																	<span>{tech.name}</span>
																</label>
															);
														})
												) : (
													<p className="admin-tech-dropdown-empty">
														No technologies available.
													</p>
												)}
											</div>
										)}
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
									{editingPortfolio ? "Update Portfolio" : "Create Portfolio"}
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
				title="Delete Portfolio"
				message={`Are you sure you want to delete "${deleteModal.portfolioName}"?`}
				itemName={deleteModal.portfolioName}
			/>
		</div>
	);
}
