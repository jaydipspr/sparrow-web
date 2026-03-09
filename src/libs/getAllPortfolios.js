import "server-only";
import connectDB from "@/lib/db/mongodb";
import Portfolio from "@/models/Portfolio";
import mongoose from "mongoose";

/**
 * Fetch portfolios that use a specific technology
 * @param {string} technologyId - Technology ID
 * @param {string} technologySlug - Technology slug
 * @returns {Promise<Array>} Array of portfolios using that technology
 */
export async function getPortfoliosByTechnology(technologyId, technologySlug) {
	try {
		await connectDB();

		const query = { isActive: true };
		const orConditions = [];

		if (technologyId) {
			orConditions.push({ "technology.id": technologyId });
		}
		if (technologySlug) {
			orConditions.push({ "technology.slug": technologySlug });
		}

		if (orConditions.length === 0) return [];

		query.$or = orConditions;

		const portfolios = await Portfolio.find(query)
			.sort({ createdAt: -1 })
			.select("-__v")
			.lean();

		return portfolios.map(serializePortfolio);
	} catch (error) {
		console.error("Error fetching portfolios by technology:", error);
		return [];
	}
}

/**
 * Serialize MongoDB document to plain object for client components
 * Converts ObjectIds and other MongoDB types to plain JavaScript values
 */
function serializePortfolio(portfolio) {
	if (!portfolio) return null;

	return {
		_id: portfolio._id?.toString() || portfolio._id,
		id: portfolio._id?.toString() || portfolio.id,
		name: portfolio.name,
		slug: portfolio.slug,
		title: portfolio.title,
		img: portfolio.img,
		description: portfolio.description,
		category: portfolio.category,
		keyHighlights: Array.isArray(portfolio.keyHighlights) ? [...portfolio.keyHighlights] : [],
		technology: Array.isArray(portfolio.technology)
			? portfolio.technology.map((t) =>
					typeof t === "string"
						? { id: "", name: t, slug: "" }
						: { id: t.id || "", name: t.name || "", slug: t.slug || "" }
			  )
			: [],
		projectLink: portfolio.projectLink,
		isActive: Boolean(portfolio.isActive),
		createdAt: portfolio.createdAt ? new Date(portfolio.createdAt).toISOString() : null,
		updatedAt: portfolio.updatedAt ? new Date(portfolio.updatedAt).toISOString() : null,
	};
}

/**
 * Fetch all portfolios directly from database (for server components)
 * @returns {Promise<Array>} Array of portfolios
 */
export async function getAllPortfoliosFromAPI() {
	try {
		await connectDB();

		const portfolios = await Portfolio.find({ isActive: true })
			.sort({ createdAt: -1 })
			.select("-__v")
			.lean();

		return portfolios.map(serializePortfolio);
	} catch (error) {
		console.error("Error fetching portfolios from database:", error);
		return [];
	}
}

/**
 * Fetch a single portfolio by ID directly from database (for server components)
 * @param {string} id - Portfolio ID
 * @returns {Promise<Object|null>} Portfolio object or null
 */
export async function getPortfolioById(id) {
	if (!id) {
		return null;
	}

	try {
		await connectDB();

		let portfolio = null;
		const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

		// Try as MongoDB ObjectId
		if (isValidObjectId) {
			portfolio = await Portfolio.findOne({
				_id: new mongoose.Types.ObjectId(id),
				isActive: true,
			})
				.select("-__v")
				.lean();
		}

		// If not found by ID, try as slug
		if (!portfolio) {
			portfolio = await Portfolio.findOne({
				slug: id.toLowerCase(),
				isActive: true,
			})
				.select("-__v")
				.lean();
		}

		if (portfolio) {
			return serializePortfolio(portfolio);
		}

		return null;
	} catch (error) {
		console.error("Error fetching portfolio from database:", error);
		return null;
	}
}
