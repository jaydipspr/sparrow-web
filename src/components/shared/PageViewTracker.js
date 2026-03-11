"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import api from "@/lib/axios";

export default function PageViewTracker() {
	const pathname = usePathname();

	useEffect(() => {
		// Don't track admin pages
		if (pathname?.startsWith("/admin")) return;

		// Map pathnames to page types
		const pageMapping = {
			"/technology": "technology",
			"/portfolios": "portfolio",
			"/services": "services",
			"/team": "teams",
			"/blogs": "blogs",
			"/careers": "career",
			"/about": "about",
			"/contact": "contact",
		};

		// Check if current pathname matches any page
		let pageType = null;
		for (const [path, type] of Object.entries(pageMapping)) {
			if (pathname === path || pathname?.startsWith(path + "/")) {
				pageType = type;
				break;
			}
		}

		// Track page view if it's a valid page
		if (pageType) {
			// Use a small delay to ensure page is fully loaded
			const timer = setTimeout(() => {
				api.post("/api/pageview", { page: pageType }).catch((error) => {
					// Silently fail - don't interrupt user experience
					console.error("Failed to track page view:", error);
				});
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [pathname]);

	return null; // This component doesn't render anything
}
