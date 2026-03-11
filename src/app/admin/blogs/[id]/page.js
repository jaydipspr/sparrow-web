"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import Image from "next/image";
import { toast } from "react-toastify";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";

export default function BlogDetails() {
	const params = useParams();
	const blogId = params?.id;
	const [blog, setBlog] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		commentIndex: null,
		commentName: "",
	});

	// Always render something valid, even if params are not ready
	if (!params || !blogId) {
		return (
			<div className="admin-page">
				<div className="admin-loading">
					<i className="fa-light fa-spinner fa-spin"></i>
					<span>Loading...</span>
				</div>
			</div>
		);
	}

	// Function to fetch blog data
	const fetchBlog = useCallback(async () => {
		if (!blogId) {
			setError("Invalid blog ID");
			setLoading(false);
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await api.get(`/api/admin/blogs/${blogId}`);
			if (response.data.success) {
				setBlog(response.data.data);
			} else {
				setError(response.data.error || "Failed to fetch blog");
			}
		} catch (err) {
			console.error("Error fetching blog:", err);
			// Handle 404 specifically
			if (err.response?.status === 404) {
				setError("Blog not found");
			} else {
				setError(err.response?.data?.error || "Failed to fetch blog");
			}
		} finally {
			setLoading(false);
		}
	}, [blogId]);

	useEffect(() => {
		fetchBlog();
	}, [fetchBlog]);

	if (loading) {
		return (
			<div className="admin-page">
				<div className="admin-loading">
					<i className="fa-light fa-spinner fa-spin"></i>
					<span>Loading blog details...</span>
				</div>
			</div>
		);
	}

	if (!loading && (error || !blog)) {
		return (
			<div className="admin-page">
				<div className="admin-card">
					<div className="admin-card-header">
						<h2 className="admin-card-title">Blog Not Found</h2>
					</div>
					<div className="admin-card-body">
						<div className="admin-alert admin-alert-error" style={{ marginBottom: "20px" }}>
							<i className="fa-light fa-circle-exclamation"></i>
							<span>{error || "The blog you are looking for doesn't exist or has been moved."}</span>
						</div>
						<Link href="/admin/blogs" className="admin-btn admin-btn-primary">
							<i className="fa-light fa-arrow-left"></i>
							<span>Back to Blogs</span>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const displayTitle = blog.title || "Untitled Blog";

	// Handle delete click - open confirmation modal
	const handleDeleteComment = (commentIndex, commentName) => {
		setDeleteModal({
			isOpen: true,
			commentIndex: commentIndex,
			commentName: commentName || "this comment",
		});
	};

	// Handle delete confirmation - actually delete the comment
	const handleDeleteConfirm = async () => {
		if (deleteModal.commentIndex === null || deleteModal.commentIndex === undefined) {
			toast.error("No comment selected for deletion");
			return;
		}

		// Use the blog's _id instead of the route parameter (which might be a slug)
		if (!blog || !blog._id) {
			toast.error("Blog information not available");
			setDeleteModal({ isOpen: false, commentIndex: null, commentName: "" });
			return;
		}

		try {
			// Ensure commentIndex is a number
			const commentIndex = Number(deleteModal.commentIndex);
			if (isNaN(commentIndex) || commentIndex < 0) {
				console.error("Invalid comment index:", deleteModal.commentIndex, "Parsed as:", commentIndex);
				toast.error(`Invalid comment index: ${deleteModal.commentIndex}`);
				setDeleteModal({ isOpen: false, commentIndex: null, commentName: "" });
				return;
			}

			// Validate that the comment index is within bounds
			if (!blog.comments || !Array.isArray(blog.comments) || commentIndex >= blog.comments.length) {
				toast.error("Comment index is out of bounds");
				setDeleteModal({ isOpen: false, commentIndex: null, commentName: "" });
				return;
			}

			// Use blog._id (ensure it's a string)
			const blogId = String(blog._id);
			console.log("Deleting comment:", { blogId, commentIndex, totalComments: blog.comments.length });
			
			const response = await api.delete(`/api/admin/blogs/${blogId}/comment/${commentIndex}`);
			if (response.data.success) {
				toast.success("Comment deleted successfully");
				// Refresh blog data to update comments
				await fetchBlog();
				setDeleteModal({ isOpen: false, commentIndex: null, commentName: "" });
			} else {
				toast.error(response.data.error || "Failed to delete comment");
				setDeleteModal({ isOpen: false, commentIndex: null, commentName: "" });
			}
		} catch (err) {
			console.error("Error deleting comment:", err);
			console.error("Error details:", {
				blogId: blog?._id,
				commentIndex: deleteModal.commentIndex,
				response: err.response?.data,
				status: err.response?.status,
			});
			const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || "Failed to delete comment";
			toast.error(errorMessage);
			setDeleteModal({ isOpen: false, commentIndex: null, commentName: "" });
		}
	};

	// Handle delete modal close
	const handleDeleteModalClose = () => {
		setDeleteModal({ isOpen: false, commentIndex: null, commentName: "" });
	};

	return (
		<div className="admin-page">
			<div className="admin-card">
				<div className="admin-card-header">
					<div>
						<Link href="/admin/blogs" className="admin-btn admin-btn-secondary admin-btn-sm">
							<i className="fa-light fa-arrow-left"></i>
							<span>Back</span>
						</Link>
					</div>
				</div>

				<div className="admin-card-body">
					<div className="admin-details-container">
						{/* Blog Image */}
						{blog.img && (
							<div className="admin-details-image">
								<Image
									src={blog.img}
									alt={displayTitle}
									width={800}
									height={450}
									style={{
										width: "100%",
										height: "auto",
										objectFit: "cover",
										borderRadius: "8px",
									}}
								/>
							</div>
						)}

						{/* Blog Information */}
						<div className="admin-details-content">
							<div className="admin-details-section">
								<h2 className="admin-details-title">{displayTitle}</h2>
							</div>

							{/* Author & Category */}
							<div className="admin-details-section">
								<label className="admin-details-label">Author</label>
								<div className="admin-details-value">
									<span className="admin-details-text">{blog.author || "-"}</span>
								</div>
							</div>

							<div className="admin-details-section">
								<label className="admin-details-label">Category</label>
								<div className="admin-details-value">
									<span className="admin-details-text">{blog.category || "-"}</span>
								</div>
							</div>

							{/* Status Badge */}
							<div className="admin-details-section">
								<label className="admin-details-label">Status</label>
								<div className="admin-details-value">
									<span
										className={`admin-badge ${
											blog.isActive !== false ? "admin-badge-success" : "admin-badge-danger"
										}`}
									>
										{blog.isActive !== false ? "Active" : "Inactive"}
									</span>
								</div>
							</div>

							{/* Content */}
							{blog.content && blog.content.length > 0 && (
								<div className="admin-details-section">
									<label className="admin-details-label">Content</label>
									<div className="admin-details-value">
										{blog.content.map((paragraph, index) => (
											<p key={index} className="admin-details-text" style={{ marginBottom: "10px" }}>
												{paragraph}
											</p>
										))}
									</div>
								</div>
							)}

							{/* Thought */}
							{blog.thought && (
								<div className="admin-details-section">
									<label className="admin-details-label">Thought / Quote</label>
									<div className="admin-details-value">
										<blockquote style={{
											borderLeft: "3px solid var(--admin-primary, #6366f1)",
											paddingLeft: "15px",
											fontStyle: "italic",
											color: "#666",
										}}>
											<p className="admin-details-text">&ldquo;{blog.thought}&rdquo;</p>
											{blog.thoughtAuthor && (
												<footer style={{ marginTop: "5px", fontSize: "0.9em" }}>
													— {blog.thoughtAuthor}
												</footer>
											)}
										</blockquote>
									</div>
								</div>
							)}

							{/* Key Lessons */}
							{blog.keyLessons && blog.keyLessons.length > 0 && (
								<div className="admin-details-section">
									<label className="admin-details-label">Key Lessons</label>
									<div className="admin-details-value">
										<ul className="admin-details-list">
											{blog.keyLessons.map((lesson, index) => (
												<li key={index} className="admin-details-list-item">
													<i className="fa-light fa-check"></i>
													<span>{lesson}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							)}

							{/* Conclusion */}
							{blog.conclusion && (
								<div className="admin-details-section">
									<label className="admin-details-label">Conclusion</label>
									<div className="admin-details-value">
										<p className="admin-details-text">{blog.conclusion}</p>
									</div>
								</div>
							)}

							{/* Metadata */}
							<div className="admin-details-section">
								<label className="admin-details-label">Metadata</label>
								<div className="admin-details-meta">
									{blog.createdAt && (
										<div className="admin-details-meta-item">
											<span className="admin-details-meta-label">Created:</span>
											<span className="admin-details-meta-value">
												{new Date(blog.createdAt).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</span>
										</div>
									)}
									{blog.updatedAt && (
										<div className="admin-details-meta-item">
											<span className="admin-details-meta-label">Last Updated:</span>
											<span className="admin-details-meta-value">
												{new Date(blog.updatedAt).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</span>
										</div>
									)}
								</div>
							</div>

							{/* Comments Section */}
							<div className="admin-details-section">
								<label className="admin-details-label">
									Comments ({blog.comments && Array.isArray(blog.comments) ? blog.comments.length : 0})
								</label>
								<div className="admin-details-value">
									{blog.comments && Array.isArray(blog.comments) && blog.comments.length > 0 ? (
										<div className="admin-comments-list">
											{[...blog.comments]
												.map((comment, originalIndex) => ({ comment, originalIndex }))
												.sort((a, b) => {
													const dateA = a.comment.createdAt ? new Date(a.comment.createdAt).getTime() : 0;
													const dateB = b.comment.createdAt ? new Date(b.comment.createdAt).getTime() : 0;
													return dateB - dateA;
												})
												.map(({ comment, originalIndex }) => (
													<div key={originalIndex} className="admin-comment-item">
														<div className="admin-comment-header">
															<div className="admin-comment-author">
																<strong>{comment.name}</strong>
																{comment.email && (
																	<span className="admin-comment-email">({comment.email})</span>
																)}
																{comment.website && (
																	<Link
																		href={comment.website}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="admin-comment-website"
																	>
																		{comment.website}
																	</Link>
																)}
															</div>
															<div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
																<div className="admin-comment-date">
																	{comment.createdAt
																		? new Date(comment.createdAt).toLocaleDateString("en-US", {
																				year: "numeric",
																				month: "long",
																				day: "numeric",
																				hour: "2-digit",
																				minute: "2-digit",
																		  })
																		: "N/A"}
																</div>
																<button
																	type="button"
																	className="admin-btn admin-btn-sm"
																	onClick={() => handleDeleteComment(originalIndex, comment.name)}
																	style={{
																		padding: "6px 12px",
																		minWidth: "auto",
																		backgroundColor: "rgba(220, 53, 69, 0.1)",
																		borderColor: "rgba(220, 53, 69, 0.3)",
																		color: "rgba(220, 53, 69, 0.8)",
																	}}
																	title="Delete comment"
																>
																	<i className="fa-light fa-trash"></i>
																</button>
															</div>
														</div>
														<div className="admin-comment-content">
															<p>{comment.comment}</p>
														</div>
													</div>
												))}
										</div>
									) : (
										<p className="admin-details-text" style={{ color: "#999", fontStyle: "italic" }}>
											No comments yet.
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			<DeleteConfirmModal
				isOpen={deleteModal.isOpen}
				onClose={handleDeleteModalClose}
				onConfirm={handleDeleteConfirm}
				title="Delete Comment"
				message={`Are you sure you want to delete the comment from "${deleteModal.commentName}"?`}
				itemName={deleteModal.commentName}
			/>
		</div>
	);
}
