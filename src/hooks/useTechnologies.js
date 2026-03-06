"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

/**
 * React hook to fetch technologies from API
 * @returns {Object} { technologies, loading, error }
 */
export function useTechnologies() {
	const [technologies, setTechnologies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);

		api.get("/api/technology")
			.then((response) => {
				if (response.data.success && response.data.data) {
					// Map MongoDB _id to id for compatibility
					const mappedTechnologies = response.data.data.map((technology) => ({
						...technology,
						id: technology._id?.toString() || technology.id,
					}));
					setTechnologies(mappedTechnologies);
				} else {
					setTechnologies([]);
				}
			})
			.catch((err) => {
				console.error("Error fetching technologies:", err);
				setError(err.response?.data?.error || err.message || "Failed to fetch technologies");
				setTechnologies([]);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return { technologies, loading, error };
}
