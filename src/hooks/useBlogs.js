"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

/**
 * React hook to fetch blogs from API
 * @param {string} [category] - Optional category filter
 * @returns {Object} { blogs, loading, error }
 */
export function useBlogs(category) {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);

		const params = category ? `?category=${encodeURIComponent(category)}` : "";

		api.get(`/api/blogs${params}`)
			.then((response) => {
				if (response.data.success && Array.isArray(response.data.data)) {
					// Map MongoDB _id to id for compatibility
					const mappedBlogs = response.data.data.map((blog) => ({
						...blog,
						id: blog._id?.toString() || blog.id,
					}));
					setBlogs(mappedBlogs);
				} else {
					setBlogs([]);
				}
			})
			.catch((err) => {
				console.error("Error fetching blogs:", err);
				setError(err.response?.data?.error || err.message || "Failed to fetch blogs");
				setBlogs([]);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [category]);

	return { blogs, loading, error };
}
