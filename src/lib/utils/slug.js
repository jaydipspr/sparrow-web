/**
 * Generate a URL-friendly slug from a name
 * @param {string} name - The name to convert
 * @returns {string} URL-friendly slug
 */
export function generateSlug(name) {
	if (!name) return "";
	return name
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "") // Remove special characters
		.replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
		.replace(/-+/g, "-") // Replace multiple hyphens with single
		.replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug for a Mongoose model
 * If the slug already exists, appends -1, -2, etc.
 * @param {Object} Model - Mongoose model
 * @param {string} name - The name to generate slug from
 * @param {string|null} excludeId - ID to exclude from uniqueness check (for updates)
 * @returns {Promise<string>} Unique slug
 */
export async function generateUniqueSlug(Model, name, excludeId = null) {
	const baseSlug = generateSlug(name);
	if (!baseSlug) return "";

	let slug = baseSlug;
	let counter = 1;

	while (true) {
		const query = { slug };
		if (excludeId) {
			query._id = { $ne: excludeId };
		}
		const existing = await Model.findOne(query).lean();
		if (!existing) break;
		slug = `${baseSlug}-${counter}`;
		counter++;
	}

	return slug;
}
