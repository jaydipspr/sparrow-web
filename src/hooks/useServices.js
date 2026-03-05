"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

/**
 * React hook to fetch services from API
 * @returns {Object} { services, loading, error }
 */
export function useServices() {
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);

		api.get("/api/services")
			.then((response) => {
				if (response.data.success && response.data.data) {
					// Map MongoDB _id to id for compatibility
					const mappedServices = response.data.data.map((service) => ({
						...service,
						id: service._id || service.id,
					}));
					setServices(mappedServices);
				} else {
					setServices([]);
				}
			})
			.catch((err) => {
				console.error("Error fetching services:", err);
				setError(err.response?.data?.error || err.message || "Failed to fetch services");
				setServices([]);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return { services, loading, error };
}
