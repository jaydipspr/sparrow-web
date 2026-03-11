"use client";
import { useEffect } from "react";
import api from "@/lib/axios";

export default function BlogViewTracker({ blogId, blogSlug }) {
	useEffect(() => {
		// Don't track if no blog identifier
		if (!blogId && !blogSlug) return;

		// Use a small delay to ensure page is fully loaded
		const timer = setTimeout(() => {
			api.post("/api/blogview", { 
				blogId: blogId || null, 
				blogSlug: blogSlug || null 
			}).catch((error) => {
				// Silently fail - don't interrupt user experience
				console.error("Failed to track blog view:", error);
			});
		}, 1000);

		return () => clearTimeout(timer);
	}, [blogId, blogSlug]);

	return null; // This component doesn't render anything
}
