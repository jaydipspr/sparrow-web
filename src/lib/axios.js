import axios from "axios";

// Get base URL - works for both client and server
const getBaseURL = () => {
	// For client-side
	if (typeof window !== "undefined") {
		return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
	}
	// For server-side - use NEXT_PUBLIC_BASE_URL or default to localhost
	// Server-side API routes are in the same app, so we can use localhost or the public URL
	return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

// Create axios instance with default config
const api = axios.create({
	baseURL: getBaseURL(),
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30000, // 30 seconds timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use(
	(config) => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("adminToken");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor for error handling
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Handle common errors
		if (error.response?.status === 401) {
			// Unauthorized - clear token and redirect to login
			if (typeof window !== "undefined") {
				localStorage.removeItem("adminToken");
				if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
					window.location.href = "/admin/login";
				}
			}
		}
		return Promise.reject(error);
	}
);

export default api;
