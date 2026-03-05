import services from "../../public/fakedata/services";
import api from "@/lib/axios";

/**
 * Fetch all services from API (for server components)
 * @returns {Promise<Array>} Array of services
 */
export async function getAllServicesFromAPI() {
	try {
		const response = await api.get("/api/services", {
			// For server-side, we might need to handle this differently
			// But axios should work with the base URL configured
		});

		if (response.data.success && response.data.data) {
			// Map MongoDB _id to id for compatibility
			return response.data.data.map((service) => ({
				...service,
				id: service._id || service.id,
			}));
		}

		return services;
	} catch (error) {
		console.error("Error fetching services from API:", error);
		console.warn("Using fallback services data");
		return services; // Fallback to JSON
	}
}

/**
 * Get all services (client-side compatible)
 * Falls back to JSON if API is not available
 * @returns {Array} Array of services
 */
const getALlServices = () => {
	// For client components, this will use the JSON fallback
	// Server components should use getAllServicesFromAPI() instead
	return services;
};

export default getALlServices;
