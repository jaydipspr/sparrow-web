"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import Image from "next/image";

export default function PortfolioDetails() {
	const params = useParams();
	const portfolioId = params.id; // Can be slug or ObjectId
	const [portfolio, setPortfolio] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!portfolioId) return;

		setLoading(true);
		setError("");

		api.get(`/api/admin/portfolio/${portfolioId}`)
			.then((response) => {
				if (response.data.success) {
					setPortfolio(response.data.data);
				} else {
					setError(response.data.error || "Failed to fetch portfolio");
				}
			})
			.catch((err) => {
				console.error("Error fetching portfolio:", err);
				setError(err.response?.data?.error || "Failed to fetch portfolio");
			})
			.finally(() => {
				setLoading(false);
			});
	}, [portfolioId]);

	if (loading) {
		return (
			<div className="admin-page">
				<div className="admin-loading">
					<i className="fa-light fa-spinner fa-spin"></i>
					<span>Loading portfolio details...</span>
				</div>
			</div>
		);
	}

	if (error || !portfolio) {
		return (
			<div className="admin-page">
				<div className="admin-alert admin-alert-error">
					<i className="fa-light fa-circle-exclamation"></i>
					<span>{error || "Portfolio not found"}</span>
				</div>
				<div className="admin-card">
					<div className="admin-card-body">
						<Link href="/admin/portfolio" className="admin-btn admin-btn-primary">
							<i className="fa-light fa-arrow-left"></i>
							<span>Back to Portfolio</span>
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
						<Link href="/admin/portfolio" className="admin-btn admin-btn-secondary admin-btn-sm">
							<i className="fa-light fa-arrow-left"></i>
							<span>Back</span>
						</Link>
					</div>
				</div>

				<div className="admin-card-body">
					<div className="admin-details-container">
						{/* Portfolio Image */}
						{portfolio.img && (
							<div className="admin-details-image">
								<Image
									src={portfolio.img}
									alt={portfolio.name || "Portfolio image"}
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

						{/* Portfolio Information */}
						<div className="admin-details-content">
							<div className="admin-details-section">
								<h2 className="admin-details-title">{portfolio.name || "Untitled Portfolio"}</h2>
								{portfolio.title && (
									<p className="admin-details-subtitle">{portfolio.title}</p>
								)}
							</div>

							{/* Category */}
							<div className="admin-details-section">
								<label className="admin-details-label">Category</label>
								<div className="admin-details-value">
									<span className="admin-details-text">{portfolio.category || "-"}</span>
								</div>
							</div>

							{/* Status Badge */}
							<div className="admin-details-section">
								<label className="admin-details-label">Status</label>
								<div className="admin-details-value">
									<span
										className={`admin-badge ${
											portfolio.isActive !== false ? "admin-badge-success" : "admin-badge-danger"
										}`}
									>
										{portfolio.isActive !== false ? "Active" : "Inactive"}
									</span>
								</div>
							</div>

							{/* Description */}
							{portfolio.description && (
								<div className="admin-details-section">
									<label className="admin-details-label">Description</label>
									<div className="admin-details-value">
										<p className="admin-details-text">{portfolio.description}</p>
									</div>
								</div>
							)}

							{/* Key Highlights */}
							{portfolio.keyHighlights && portfolio.keyHighlights.length > 0 && (
								<div className="admin-details-section">
									<label className="admin-details-label">Key Highlights</label>
									<div className="admin-details-value">
										<ul className="admin-details-list">
											{portfolio.keyHighlights.map((highlight, index) => (
												<li key={index} className="admin-details-list-item">
													<i className="fa-light fa-check"></i>
													<span>{highlight}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							)}

							{/* Technology */}
							{portfolio.technology && portfolio.technology.length > 0 && (
								<div className="admin-details-section">
									<label className="admin-details-label">Technology</label>
									<div className="admin-details-value">
										<ul className="admin-details-list">
											{portfolio.technology.map((tech, index) => {
												const techName = typeof tech === "string" ? tech : tech.name;
												return (
													<li key={index} className="admin-details-list-item">
														<i className="fa-light fa-check"></i>
														<span>{techName}</span>
													</li>
												);
											})}
										</ul>
									</div>
								</div>
							)}

							{/* Project Link */}
							{portfolio.projectLink && (
								<div className="admin-details-section">
									<label className="admin-details-label">Project Link</label>
									<div className="admin-details-value">
										<a
											href={portfolio.projectLink}
											target="_blank"
											rel="noopener noreferrer"
											className="admin-details-text"
											style={{ color: "var(--tj-color-theme-primary)", textDecoration: "underline" }}
										>
											{portfolio.projectLink}
										</a>
									</div>
								</div>
							)}

							{/* Metadata */}
							<div className="admin-details-section">
								<label className="admin-details-label">Metadata</label>
								<div className="admin-details-meta">
									{portfolio.createdAt && (
										<div className="admin-details-meta-item">
											<span className="admin-details-meta-label">Created:</span>
											<span className="admin-details-meta-value">
												{new Date(portfolio.createdAt).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</span>
										</div>
									)}
									{portfolio.updatedAt && (
										<div className="admin-details-meta-item">
											<span className="admin-details-meta-label">Last Updated:</span>
											<span className="admin-details-meta-value">
												{new Date(portfolio.updatedAt).toLocaleDateString("en-US", {
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
