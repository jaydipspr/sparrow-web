import "server-only";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import mongoose from "mongoose";

/**
 * Serialize MongoDB document to plain object for client components
 * Converts ObjectIds and other MongoDB types to plain JavaScript values
 */
function serializeBlog(blog) {
	if (!blog) return null;

	return {
		_id: blog._id?.toString() || blog._id,
		id: blog._id?.toString() || blog.id,
		title: blog.title,
		slug: blog.slug,
		img: blog.img,
		author: blog.author,
		category: blog.category,
		content: Array.isArray(blog.content) ? [...blog.content] : [],
		thought: blog.thought,
		thoughtAuthor: blog.thoughtAuthor,
		keyLessons: Array.isArray(blog.keyLessons) ? [...blog.keyLessons] : [],
		conclusion: blog.conclusion,
		isActive: Boolean(blog.isActive),
		createdAt: blog.createdAt ? new Date(blog.createdAt).toISOString() : null,
		updatedAt: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : null,
	};
}

/**
 * Fetch all active blogs directly from database (for server components)
 * @returns {Promise<Array>} Array of blogs
 */
export async function getAllBlogsFromAPI() {
	try {
		await connectDB();

		const blogs = await Blog.find({ isActive: true })
			.sort({ createdAt: -1 })
			.select("-__v")
			.lean();

		return blogs.map(serializeBlog);
	} catch (error) {
		console.error("Error fetching blogs from database:", error);
		return [];
	}
}

/**
 * Fetch a single blog by ID or slug directly from database (for server components)
 * @param {string} identifier - Blog ID or slug
 * @returns {Promise<Object|null>} Blog object or null
 */
export async function getBlogBySlug(identifier) {
	if (!identifier) {
		return null;
	}

	try {
		await connectDB();

		let blog = null;
		const isValidObjectId = mongoose.Types.ObjectId.isValid(identifier);

		// Try as MongoDB ObjectId first
		if (isValidObjectId) {
			blog = await Blog.findOne({
				_id: new mongoose.Types.ObjectId(identifier),
				isActive: true,
			})
				.select("-__v")
				.lean();
		}

		// If not found by ID, try as slug
		if (!blog) {
			blog = await Blog.findOne({
				slug: identifier,
				isActive: true,
			})
				.select("-__v")
				.lean();
		}

		if (blog) {
			return serializeBlog(blog);
		}

		return null;
	} catch (error) {
		console.error("Error fetching blog from database:", error);
		return null;
	}
}
