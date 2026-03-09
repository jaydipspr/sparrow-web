"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

/**
 * React hook to fetch portfolios from API
 * @param {string} [category] - Optional category filter
 * @returns {Object} { portfolios, loading, error }
 */
export function usePortfolios(category) {
	const [portfolios, setPortfolios] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);

		const params = category ? `?category=${encodeURIComponent(category)}` : "";

		api.get(`/api/portfolio${params}`)
			.then((response) => {
				if (response.data.success && Array.isArray(response.data.data)) {
					// Map MongoDB _id to id for compatibility
					const mappedPortfolios = response.data.data.map((portfolio) => ({
						...portfolio,
						id: portfolio._id?.toString() || portfolio.id,
					}));
					setPortfolios(mappedPortfolios);
				} else {
					setPortfolios([]);
				}
			})
			.catch((err) => {
				console.error("Error fetching portfolios:", err);
				setError(err.response?.data?.error || err.message || "Failed to fetch portfolios");
				setPortfolios([]);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [category]);

	return { portfolios, loading, error };
}
