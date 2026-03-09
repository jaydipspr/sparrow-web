"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import Image from "next/image";

export default function BlogDetails() {
	const params = useParams();
	const blogId = params.id;
	const [blog, setBlog] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!blogId) return;

		setLoading(true);
		setError("");

		api.get(`/api/admin/blogs/${blogId}`)
			.then((response) => {
				if (response.data.success) {
					setBlog(response.data.data);
				} else {
					setError(response.data.error || "Failed to fetch blog");
				}
			})
			.catch((err) => {
				console.error("Error fetching blog:", err);
				setError(err.response?.data?.error || "Failed to fetch blog");
			})
			.finally(() => {
				setLoading(false);
			});
	}, [blogId]);

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

	if (error || !blog) {
		return (
			<div className="admin-page">
				<div className="admin-alert admin-alert-error">
					<i className="fa-light fa-circle-exclamation"></i>
					<span>{error || "Blog not found"}</span>
				</div>
				<div className="admin-card">
					<div className="admin-card-body">
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
