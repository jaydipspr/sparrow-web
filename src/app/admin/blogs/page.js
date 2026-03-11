"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";
import BaseTable from "@/components/admin/BaseTable";
import { toast } from "react-toastify";

export default function AdminBlogs() {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [uploadingImg, setUploadingImg] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [editingBlog, setEditingBlog] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		blogId: null,
		blogTitle: "",
	});
	const [formData, setFormData] = useState({
		title: "",
		img: "",
		author: "",
		category: "",
		content: [],
		thought: "",
		thoughtAuthor: "",
		keyLessons: [],
		conclusion: "",
		isActive: true,
	});
	const [newContentParagraph, setNewContentParagraph] = useState("");
	const [newKeyLesson, setNewKeyLesson] = useState("");
	const [pagination, setPagination] = useState({
		currentPage: 1,
		limit: 10,
		totalCount: 0,
		totalPages: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});

	// Blog categories
	const categories = [
		"Technology",
		"Business",
		"Design",
		"Development",
		"Marketing",
		"Startup",
		"AI & Machine Learning",
		"Cloud Computing",
		"Cybersecurity",
		"Other",
	];

	// Fetch blogs with pagination
	const fetchBlogs = (page = 1, limit = 10) => {
		setLoading(true);

		api.get(`/api/admin/blogs?page=${page}&limit=${limit}`)
			.then((response) => {
				if (response.data.success) {
					const blogsData = response.data.data || [];
					const paginationData = response.data.pagination || {};
					setBlogs(blogsData);
					setPagination({
						currentPage: paginationData.currentPage || page,
						limit: paginationData.limit || limit,
						totalCount: paginationData.totalCount || 0,
						totalPages: paginationData.totalPages || 0,
						hasNextPage: paginationData.hasNextPage || false,
						hasPrevPage: paginationData.hasPrevPage || false,
					});
				} else {
					toast.error("Failed to fetch blogs");
				}
			})
			.catch((err) => {
				console.error("Error fetching blogs:", err);
				toast.error(err.response?.data?.error || "Failed to fetch blogs");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// Handle page change
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			fetchBlogs(newPage, pagination.limit);
		}
	};

	useEffect(() => {
		fetchBlogs(1, 10);
	}, []);

	// Handle form input change
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	// Handle add content paragraph
	const handleAddContent = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (newContentParagraph.trim()) {
			setFormData((prev) => ({
				...prev,
				content: [...(prev.content || []), newContentParagraph.trim()],
			}));
			setNewContentParagraph("");
		}
	};

	// Handle remove content paragraph
	const handleRemoveContent = (index) => {
		setFormData((prev) => ({
			...prev,
			content: prev.content.filter((_, i) => i !== index),
		}));
	};

	// Handle add key lesson
	const handleAddKeyLesson = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (newKeyLesson.trim()) {
			setFormData((prev) => ({
				...prev,
				keyLessons: [...(prev.keyLessons || []), newKeyLesson.trim()],
			}));
			setNewKeyLesson("");
		}
	};

	// Handle remove key lesson
	const handleRemoveKeyLesson = (index) => {
		setFormData((prev) => ({
			...prev,
			keyLessons: prev.keyLessons.filter((_, i) => i !== index),
		}));
	};

	// Handle form submit (create or update)
	const handleSubmit = (e) => {
		e.preventDefault();

		// Basic validation
		if (!formData.title.trim()) {
			toast.error("Blog title is required.");
			return;
		}
		if (!formData.author.trim()) {
			toast.error("Author name is required.");
			return;
		}
		if (!formData.category.trim()) {
			toast.error("Category is required.");
			return;
		}
		if (!Array.isArray(formData.content) || formData.content.length === 0) {
			toast.error("Content paragraphs are required.");
			return;
		}
		if (!formData.img.trim()) {
			toast.error("Blog image URL is required.");
			return;
		}
		if (!formData.img.startsWith("/") && !formData.img.startsWith("http://") && !formData.img.startsWith("https://")) {
			toast.error("Image URL must be a valid URL or a relative path starting with /.");
			return;
		}

		setLoading(true);

		const blogData = {
			title: formData.title.trim(),
			img: formData.img.trim(),
			author: formData.author.trim(),
			category: formData.category.trim(),
			content: Array.isArray(formData.content) ? formData.content.filter((p) => typeof p === "string" && p.trim()) : [],
			thought: formData.thought || "",
			thoughtAuthor: (formData.thoughtAuthor || "").trim(),
			keyLessons: Array.isArray(formData.keyLessons) ? formData.keyLessons : [],
			conclusion: formData.conclusion || "",
			isActive: formData.isActive !== undefined ? formData.isActive : true,
		};

		const request = editingBlog
			? api.put(`/api/admin/blogs/${editingBlog._id}`, blogData)
			: api.post("/api/admin/blogs", blogData);

		request
			.then((response) => {
				if (response.data.success) {
					toast.success(editingBlog ? "Blog updated successfully!" : "Blog created successfully!");
					fetchBlogs(pagination.currentPage, pagination.limit);
					handleCloseForm();
				} else {
					toast.error(response.data.error || "Operation failed");
				}
			})
			.catch((err) => {
				console.error("Error saving blog:", err);
				toast.error(err.response?.data?.error || "Failed to save blog");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// Upload blog image (multer)
	const handleImageUpload = (file) => {
		if (!file) return;

		setUploadingImg(true);

		const formDataUpload = new FormData();
		formDataUpload.append("file", file);

		api.post("/api/admin/upload/blog-image", formDataUpload, {
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
	const handleEdit = (blog) => {
		setEditingBlog(blog);
		setFormData({
			title: blog.title || "",
			img: blog.img || "",
			author: blog.author || "",
			category: blog.category || "",
			content: blog.content || [],
			thought: blog.thought || "",
			thoughtAuthor: blog.thoughtAuthor || "",
			keyLessons: blog.keyLessons || [],
			conclusion: blog.conclusion || "",
			isActive: blog.isActive !== undefined ? blog.isActive : true,
		});
		setNewContentParagraph("");
		setNewKeyLesson("");
		setShowForm(true);
	};

	// Handle delete click - open confirmation modal
	const handleDeleteClick = (blog) => {
		setDeleteModal({
			isOpen: true,
			blogId: blog._id,
			blogTitle: blog.title,
		});
	};

	// Handle delete confirmation - actually delete the blog
	const handleDeleteConfirm = () => {
		if (!deleteModal.blogId) return;

		api.delete(`/api/admin/blogs/${deleteModal.blogId}`)
			.then((response) => {
				if (response.data.success) {
					toast.success(`Blog "${deleteModal.blogTitle}" deleted successfully!`);
					fetchBlogs(pagination.currentPage, pagination.limit);
					setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" });
				} else {
					toast.error(response.data.error || "Failed to delete blog");
					setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" });
				}
			})
			.catch((err) => {
				console.error("Error deleting blog:", err);
				toast.error(err.response?.data?.error || "Failed to delete blog");
				setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" });
			});
	};

	// Handle delete modal close
	const handleDeleteModalClose = () => {
		setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" });
	};

	// Reset form
	const resetForm = () => {
		setFormData({
			title: "",
			img: "",
			author: "",
			category: "",
			content: [],
			thought: "",
			thoughtAuthor: "",
			keyLessons: [],
			conclusion: "",
			isActive: true,
		});
		setNewContentParagraph("");
		setNewKeyLesson("");
		setEditingBlog(null);
	};

	// Close form
	const handleCloseForm = () => {
		setShowForm(false);
		setEditingBlog(null);
		resetForm();
	};

	return (
		<div className="admin-page">
			<div className="admin-card">
				<div className="admin-card-header">
					<div>
						<h3 className="admin-card-title">Blog Management</h3>
						<p className="admin-card-subtitle">Manage your blog posts</p>
					</div>
					<button
						className="admin-btn admin-btn-primary"
						onClick={() => {
							resetForm();
							setShowForm(true);
						}}
					>
						<i className="fa-light fa-plus"></i>
						<span>Add New Blog</span>
					</button>
				</div>

				<div className="admin-card-body">
					{loading ? (
						<div className="admin-loading">
							<i className="fa-light fa-spinner fa-spin"></i>
							<span>Loading blogs...</span>
						</div>
					) : blogs.length === 0 ? (
						<div className="admin-empty-state">
							<i className="fa-light fa-inbox"></i>
							<p>No blogs found. Create your first blog post!</p>
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
									key: "title",
									label: "Blog Title",
									mobileVisible: true,
									render: (value) => (
										<div className="admin-table-title">{value || "-"}</div>
									),
								},
								{
									key: "author",
									label: "Author",
									mobileVisible: false,
									mobileLabel: "Author",
									render: (value) => value || "-",
								},
								{
									key: "category",
									label: "Category",
									mobileVisible: false,
									mobileLabel: "Category",
									render: (value) => value || "-",
								},
								{
									key: "viewCount",
									label: "Visitors",
									mobileVisible: false,
									mobileLabel: "Visitors",
									render: (value, row) => {
										const count = row.viewCount || value || 0;
										return (
											<span style={{ 
												display: "inline-flex", 
												alignItems: "center", 
												gap: "6px",
												fontWeight: 500,
												color: "var(--tj-color-text-body-2)"
											}}>
												<i className="fa-light fa-eye" style={{ fontSize: "14px", color: "var(--tj-color-theme-primary)" }}></i>
												{count}
											</span>
										);
									},
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
							data={blogs}
							nameKey="title"
							renderActions={(blog) => (
								<>
									<Link
										href={`/admin/blogs/${blog.slug || blog._id}`}
										className="admin-btn-icon admin-btn-icon-view"
										title="View Details"
									>
										<i className="fa-light fa-eye"></i>
									</Link>
									<button
										className="admin-btn-icon admin-btn-icon-edit"
										onClick={() => handleEdit(blog)}
										title="Edit"
									>
										<i className="fa-light fa-edit"></i>
									</button>
									<button
										className="admin-btn-icon admin-btn-icon-delete"
										onClick={() => handleDeleteClick(blog)}
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
								{editingBlog ? "Edit Blog" : "Add New Blog"}
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
									<label htmlFor="title">
										Blog Title <span className="admin-required">*</span>
									</label>
									<input
										type="text"
										id="title"
										name="title"
										value={formData.title}
										onChange={handleChange}
										required
										placeholder="Enter blog title"
									/>
								</div>

								<div className="admin-form-group">
									<label htmlFor="author">
										Author <span className="admin-required">*</span>
									</label>
									<input
										type="text"
										id="author"
										name="author"
										value={formData.author}
										onChange={handleChange}
										required
										placeholder="Enter author name"
									/>
								</div>

								<div className="admin-form-group">
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
											placeholder="/images/blog/blog-1.webp or /uploads/blog/image.jpg"
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
									<label htmlFor="blogImageUpload">Or Upload Image File</label>
									<div className="admin-file-upload-wrapper">
										<input
											type="file"
											id="blogImageUpload"
											className="admin-file-input"
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												handleImageUpload(file);
												e.target.value = "";
											}}
											disabled={uploadingImg}
										/>
										<label htmlFor="blogImageUpload" className="admin-file-label">
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

								{/* Content Paragraphs Manager */}
								<div className="admin-form-group admin-form-group-full">
									<label>
										Content Paragraphs <span className="admin-required">*</span>
									</label>
									<div className="admin-points-manager">
										{formData.content && formData.content.length > 0 && (
											<ul className="admin-points-list">
												{formData.content.map((paragraph, index) => (
													<li key={index} className="admin-point-item">
														<span>{paragraph.length > 100 ? paragraph.substring(0, 100) + "..." : paragraph}</span>
														<button
															type="button"
															className="admin-point-remove"
															onClick={() => handleRemoveContent(index)}
														>
															<i className="fa-light fa-times"></i>
														</button>
													</li>
												))}
											</ul>
										)}
										<div className="admin-points-input">
											<textarea
												value={newContentParagraph}
												onChange={(e) => setNewContentParagraph(e.target.value)}
												placeholder="Enter a content paragraph and click Add"
												rows={3}
												style={{ flex: 1 }}
											/>
											<button
												type="button"
												className="admin-btn admin-btn-primary admin-point-add"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													handleAddContent(e);
												}}
											>
												<i className="fa-light fa-plus"></i>
												<span>Add</span>
											</button>
										</div>
									</div>
								</div>

								{/* Thought Section */}
								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="thought">Thought / Quote</label>
									<textarea
										id="thought"
										name="thought"
										value={formData.thought}
										onChange={handleChange}
										rows={3}
										placeholder="Enter a thought or quote for the blog"
									/>
								</div>

								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="thoughtAuthor">Thought Author</label>
									<input
										type="text"
										id="thoughtAuthor"
										name="thoughtAuthor"
										value={formData.thoughtAuthor}
										onChange={handleChange}
										placeholder="Enter the author of the thought/quote"
									/>
								</div>

								{/* Key Lessons Manager */}
								<div className="admin-form-group admin-form-group-full">
									<label>Key Lessons</label>
									<div className="admin-points-manager">
										{formData.keyLessons && formData.keyLessons.length > 0 && (
											<ul className="admin-points-list">
												{formData.keyLessons.map((lesson, index) => (
													<li key={index} className="admin-point-item">
														<span>{lesson}</span>
														<button
															type="button"
															className="admin-point-remove"
															onClick={() => handleRemoveKeyLesson(index)}
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
												value={newKeyLesson}
												onChange={(e) => setNewKeyLesson(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														e.stopPropagation();
														handleAddKeyLesson(e);
													}
												}}
												placeholder="Enter a key lesson and press Enter or click Add"
											/>
											<button
												type="button"
												className="admin-btn admin-btn-primary admin-point-add"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													handleAddKeyLesson(e);
												}}
											>
												<i className="fa-light fa-plus"></i>
												<span>Add</span>
											</button>
										</div>
									</div>
								</div>

								{/* Conclusion */}
								<div className="admin-form-group admin-form-group-full">
									<label htmlFor="conclusion">Conclusion</label>
									<textarea
										id="conclusion"
										name="conclusion"
										value={formData.conclusion}
										onChange={handleChange}
										rows={4}
										placeholder="Enter blog conclusion"
									/>
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
									{editingBlog ? "Update Blog" : "Create Blog"}
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
				title="Delete Blog"
				message={`Are you sure you want to delete "${deleteModal.blogTitle}"?`}
				itemName={deleteModal.blogTitle}
			/>
		</div>
	);
}
