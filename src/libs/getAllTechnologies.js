/**
 * Serialize MongoDB document to plain object for client components
 * Converts ObjectIds and other MongoDB types to plain JavaScript values
 */
function serializeTechnology(technology) {
	if (!technology) return null;
	
	return {
		_id: technology._id?.toString() || technology._id,
		id: technology._id?.toString() || technology.id,
		name: technology.name,
		slug: technology.slug,
		category: technology.category,
		title: technology.title,
		img: technology.img,
		description: technology.description,
		features: Array.isArray(technology.features) ? [...technology.features] : [],
		isActive: Boolean(technology.isActive),
		createdAt: technology.createdAt ? new Date(technology.createdAt).toISOString() : null,
		updatedAt: technology.updatedAt ? new Date(technology.updatedAt).toISOString() : null,
	};
}

/**
 * Fetch all technologies directly from database (for server components)
 * This is more efficient than making HTTP requests
 * @returns {Promise<Array>} Array of technologies
 */
export async function getAllTechnologiesFromAPI() {
	// Ensure this only runs on the server
	if (typeof window !== "undefined") {
		console.warn("getAllTechnologiesFromAPI should only be called on the server");
		return [];
	}

	try {
		// Direct database access for server-side (more efficient)
		const { default: connectDB } = await import("@/lib/db/mongodb");
		const { default: Technology } = await import("@/models/Technology");
		
		await connectDB();
		
		const technologies = await Technology.find({ isActive: true })
			.sort({ createdAt: -1 })
			.select("-__v")
			.lean();

		// Serialize technologies to plain objects for client components
		return technologies.map(serializeTechnology);
	} catch (error) {
		console.error("Error fetching technologies from database:", error);
		return [];
	}
}

/**
 * Fetch a single technology by ID directly from database (for server components)
 * @param {string} identifier - Technology ID
 * @returns {Promise<Object|null>} Technology object or null
 */
export async function getTechnologyById(identifier) {
	// Ensure this only runs on the server
	if (typeof window !== "undefined") {
		console.warn("getTechnologyById should only be called on the server");
		return null;
	}

	if (!identifier) {
		return null;
	}

	try {
		// Direct database access for server-side (more efficient)
		const { default: connectDB } = await import("@/lib/db/mongodb");
		const { default: Technology } = await import("@/models/Technology");
		const mongoose = await import("mongoose");
		
		await connectDB();
		
		let technology = null;
		const isValidObjectId = mongoose.Types.ObjectId.isValid(identifier);
		
		// Try as MongoDB ObjectId (ID lookup)
		if (isValidObjectId) {
			try {
				technology = await Technology.findOne({
					_id: new mongoose.Types.ObjectId(identifier),
					isActive: true,
				}).lean();
			} catch (err) {
				// Invalid ObjectId format, continue
				console.warn(`Invalid ObjectId format: ${identifier}`);
			}
		}

		// If not found by ID, try as slug
		if (!technology) {
			technology = await Technology.findOne({
				slug: identifier.toLowerCase(),
				isActive: true,
			}).lean();
		}

		if (technology) {
			return serializeTechnology(technology);
		}

		return null;
	} catch (error) {
		console.error("Error fetching technology from database:", error);
		return null;
	}
}
