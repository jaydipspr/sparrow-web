"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import Image from "next/image";

export default function TechnologyDetails() {
	const params = useParams();
	const technologyId = params.id;
	const [technology, setTechnology] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!technologyId) return;

		setLoading(true);
		setError("");

		api.get(`/api/admin/technology/${technologyId}`)
			.then((response) => {
				if (response.data.success) {
					setTechnology(response.data.data);
				} else {
					setError(response.data.error || "Failed to fetch technology");
				}
			})
			.catch((err) => {
				console.error("Error fetching technology:", err);
				setError(err.response?.data?.error || "Failed to fetch technology");
			})
			.finally(() => {
				setLoading(false);
			});
	}, [technologyId]);

	if (loading) {
		return (
			<div className="admin-page">
				<div className="admin-loading">
					<i className="fa-light fa-spinner fa-spin"></i>
					<span>Loading technology details...</span>
				</div>
			</div>
		);
	}

	if (error || !technology) {
		return (
			<div className="admin-page">
				<div className="admin-alert admin-alert-error">
					<i className="fa-light fa-circle-exclamation"></i>
					<span>{error || "Technology not found"}</span>
				</div>
				<div className="admin-card">
					<div className="admin-card-body">
						<Link href="/admin/technology" className="admin-btn admin-btn-primary">
							<i className="fa-light fa-arrow-left"></i>
							<span>Back to Technology</span>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="admin-page">
			<div className="admin-card">
				<div className="admin-card-header">
					<div>
						<Link href="/admin/technology" className="admin-btn admin-btn-secondary admin-btn-sm">
							<i className="fa-light fa-arrow-left"></i>
							<span>Back</span>
						</Link>
					</div>
				</div>

				<div className="admin-card-body">
					<div className="admin-details-container">
						{/* Technology Image */}
						{technology.img && (
							<div className="admin-details-image">
								<Image
									src={technology.img}
									alt={technology.name || "Technology image"}
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

						{/* Technology Information */}
						<div className="admin-details-content">
							<div className="admin-details-section">
								<h2 className="admin-details-title">{technology.name || "Untitled Technology"}</h2>
								{technology.title && (
									<p className="admin-details-subtitle">{technology.title}</p>
								)}
							</div>

							{/* Category */}
							<div className="admin-details-section">
								<label className="admin-details-label">Category</label>
								<div className="admin-details-value">
									<span className="admin-details-text">{technology.category || "-"}</span>
								</div>
							</div>

							{/* Status Badge */}
							<div className="admin-details-section">
								<label className="admin-details-label">Status</label>
								<div className="admin-details-value">
									<span
										className={`admin-badge ${
											technology.isActive !== false ? "admin-badge-success" : "admin-badge-danger"
										}`}
									>
										{technology.isActive !== false ? "Active" : "Inactive"}
									</span>
								</div>
							</div>

							{/* Description */}
							{technology.description && (
								<div className="admin-details-section">
									<label className="admin-details-label">Description</label>
									<div className="admin-details-value">
										<p className="admin-details-text">{technology.description}</p>
									</div>
								</div>
							)}

							{/* Features */}
							{technology.features && technology.features.length > 0 && (
								<div className="admin-details-section">
									<label className="admin-details-label">Features</label>
									<div className="admin-details-value">
										<ul className="admin-details-list">
											{technology.features.map((feature, index) => (
												<li key={index} className="admin-details-list-item">
													<i className="fa-light fa-check"></i>
													<span>{feature}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							)}

							{/* Metadata */}
							<div className="admin-details-section">
								<label className="admin-details-label">Metadata</label>
								<div className="admin-details-meta">
									{technology.createdAt && (
										<div className="admin-details-meta-item">
											<span className="admin-details-meta-label">Created:</span>
											<span className="admin-details-meta-value">
												{new Date(technology.createdAt).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</span>
										</div>
									)}
									{technology.updatedAt && (
										<div className="admin-details-meta-item">
											<span className="admin-details-meta-label">Last Updated:</span>
											<span className="admin-details-meta-value">
												{new Date(technology.updatedAt).toLocaleDateString("en-US", {
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
