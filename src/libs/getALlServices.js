/**
 * Serialize MongoDB document to plain object for client components
 * Converts ObjectIds and other MongoDB types to plain JavaScript values
 */
function serializeService(service) {
	if (!service) return null;
	
	return {
		_id: service._id?.toString() || service._id,
		id: service._id?.toString() || service.id,
		name: service.name,
		title: service.title,
		slug: service.slug,
		img: service.img,
		description: service.description,
		points: Array.isArray(service.points) ? [...service.points] : [],
		isActive: Boolean(service.isActive),
		createdAt: service.createdAt ? new Date(service.createdAt).toISOString() : null,
		updatedAt: service.updatedAt ? new Date(service.updatedAt).toISOString() : null,
	};
}

/**
 * Get base URL for API calls (works in both server and client)
 */
function getBaseURL() {
	// In server-side, try to use the request URL or environment variable
	if (typeof window === "undefined") {
		// Server-side: use environment variable or default
		if (process.env.NEXT_PUBLIC_BASE_URL) {
			return process.env.NEXT_PUBLIC_BASE_URL;
		}
		if (process.env.VERCEL_URL) {
			return `https://${process.env.VERCEL_URL}`;
		}
		// Default to localhost for development
		return "http://localhost:3000";
	}
	// Client-side: use current origin
	return window.location.origin;
}

/**
 * Fetch all services directly from database (for server components)
 * This is more efficient than making HTTP requests
 * @returns {Promise<Array>} Array of services
 */
export async function getAllServicesFromAPI() {
	// Ensure this only runs on the server
	if (typeof window !== "undefined") {
		console.warn("getAllServicesFromAPI should only be called on the server");
		return [];
	}

	try {
		// Direct database access for server-side (more efficient)
		const { default: connectDB } = await import("@/lib/db/mongodb");
		const { default: Service } = await import("@/models/Service");
		
		await connectDB();
		
		const services = await Service.find({ isActive: true })
			.sort({ createdAt: -1 })
			.select("-__v -order")
			.lean();

		// Serialize services to plain objects for client components
		return services.map(serializeService);
	} catch (error) {
		console.error("Error fetching services from database:", error);
		return [];
	}
}

/**
 * Fetch a single service by ID or slug directly from database (for server components)
 * Prioritizes ID lookup first, then slug as fallback
 * @param {string} identifier - Service ID or slug
 * @returns {Promise<Object|null>} Service object or null
 */
export async function getServiceBySlug(identifier) {
	// Ensure this only runs on the server
	if (typeof window !== "undefined") {
		console.warn("getServiceBySlug should only be called on the server");
		return null;
	}

	if (!identifier) {
		return null;
	}

	try {
		// Direct database access for server-side (more efficient)
		const { default: connectDB } = await import("@/lib/db/mongodb");
		const { default: Service } = await import("@/models/Service");
		const mongoose = await import("mongoose");
		
		await connectDB();
		
		let service = null;
		const isValidObjectId = mongoose.Types.ObjectId.isValid(identifier);
		
		// First try as MongoDB ObjectId (ID lookup - primary method)
		if (isValidObjectId) {
			try {
				service = await Service.findOne({
					_id: new mongoose.Types.ObjectId(identifier),
					isActive: true,
				}).lean();
			} catch (err) {
				// Invalid ObjectId format, continue
				console.warn(`Invalid ObjectId format: ${identifier}`);
			}
		}

		// If not found by ID, try as slug (fallback)
		if (!service) {
			service = await Service.findOne({
				slug: identifier.toLowerCase(),
				isActive: true,
			}).lean();
		}

		if (service) {
			// Serialize service to plain object for client components
			return serializeService(service);
		}

		return null;
	} catch (error) {
		console.error("Error fetching service from database:", error);
		return null;
	}
}

/**
 * Get all services (client-side compatible)
 * Returns empty array - use useServices hook or getAllServicesFromAPI for API data
 * @returns {Array} Empty array (use API methods instead)
 */
const getALlServices = () => {
	// This function is deprecated - use useServices hook or getAllServicesFromAPI instead
	// Returning empty array to avoid showing JSON data
	return [];
};

export default getALlServices;
