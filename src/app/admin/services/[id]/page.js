"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import Image from "next/image";

export default function ServiceDetails() {
	const params = useParams();
	const serviceId = params.id; // Can be slug or ObjectId
	const [service, setService] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!serviceId) return;

		setLoading(true);
		setError("");

		api.get(`/api/admin/services/${serviceId}`)
			.then((response) => {
				if (response.data.success) {
					setService(response.data.data);
				} else {
					setError(response.data.error || "Failed to fetch service");
				}
			})
			.catch((err) => {
				console.error("Error fetching service:", err);
				setError(err.response?.data?.error || "Failed to fetch service");
			})
			.finally(() => {
				setLoading(false);
			});
	}, [serviceId]);

	if (loading) {
		return (
			<div className="admin-page">
				<div className="admin-loading">
					<i className="fa-light fa-spinner fa-spin"></i>
					<span>Loading service details...</span>
				</div>
			</div>
		);
	}

	if (error || !service) {
		return (
			<div className="admin-page">
				<div className="admin-alert admin-alert-error">
					<i className="fa-light fa-circle-exclamation"></i>
					<span>{error || "Service not found"}</span>
				</div>
				<div className="admin-card">
					<div className="admin-card-body">
						<Link href="/admin/services" className="admin-btn admin-btn-primary">
							<i className="fa-light fa-arrow-left"></i>
							<span>Back to Services</span>
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
						<Link href="/admin/services" className="admin-btn admin-btn-secondary admin-btn-sm">
							<i className="fa-light fa-arrow-left"></i>
							<span>Back</span>
						</Link>
					</div>
				</div>

				<div className="admin-card-body">
					<div className="admin-details-container">
						{/* Service Image */}
						{service.img && (
							<div className="admin-details-image">
								<Image
									src={service.img}
									alt={service.name || "Service image"}
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

						{/* Service Information */}
						<div className="admin-details-content">
							<div className="admin-details-section">
								<h2 className="admin-details-title">{service.name || "Untitled Service"}</h2>
								{service.title && (
									<p className="admin-details-subtitle">{service.title}</p>
								)}
							</div>

							{/* Status Badge */}
							<div className="admin-details-section">
								<label className="admin-details-label">Status</label>
								<div className="admin-details-value">
									<span
										className={`admin-badge ${
											service.isActive !== false ? "admin-badge-success" : "admin-badge-danger"
										}`}
									>
										{service.isActive !== false ? "Active" : "Inactive"}
									</span>
								</div>
							</div>

							{/* Description */}
							{service.description && (
								<div className="admin-details-section">
									<label className="admin-details-label">Description</label>
									<div className="admin-details-value">
										<p className="admin-details-text">{service.description}</p>
									</div>
								</div>
							)}

							{/* Points/Features */}
							{service.points && service.points.length > 0 && (
								<div className="admin-details-section">
									<label className="admin-details-label">Key Points</label>
									<div className="admin-details-value">
										<ul className="admin-details-list">
											{service.points.map((point, index) => (
												<li key={index} className="admin-details-list-item">
													<i className="fa-light fa-check"></i>
													<span>{point}</span>
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
									{service.createdAt && (
										<div className="admin-details-meta-item">
											<span className="admin-details-meta-label">Created:</span>
											<span className="admin-details-meta-value">
												{new Date(service.createdAt).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</span>
										</div>
									)}
									{service.updatedAt && (
										<div className="admin-details-meta-item">
											<span className="admin-details-meta-label">Last Updated:</span>
											<span className="admin-details-meta-value">
												{new Date(service.updatedAt).toLocaleDateString("en-US", {
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
