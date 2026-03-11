import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all active blogs or a single blog
 *     description: Retrieve all active blogs or a single blog by ID/slug (public endpoint)
 *     tags: [Public Blogs]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Blog ID (MongoDB ObjectId) or slug
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Blog'
 *                     - type: array
 *                       items:
 *                         $ref: '#/components/schemas/Blog'
 *                 count:
 *                   type: integer
 *                   description: Total count (only for list response)
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		const category = searchParams.get("category");

		// Get single blog by id or slug
		if (id) {
			let blog = null;

			if (mongoose.Types.ObjectId.isValid(id)) {
				blog = await Blog.findOne({
					_id: new mongoose.Types.ObjectId(id),
					isActive: true,
				}).select("-__v").lean();
			}

			// If not found by ID, try as slug
			if (!blog) {
				blog = await Blog.findOne({
					slug: id,
					isActive: true,
				})
					.select("-__v")
					.lean();
				
				// Sort comments by createdAt (newest first) if blog exists
				if (blog && blog.comments) {
					blog.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				}
			}

			if (!blog) {
				return NextResponse.json(
					{ error: "Blog not found" },
					{ status: 404 }
				);
			}

			return NextResponse.json({
				success: true,
				data: blog,
			});
		}

		// Build query for all active blogs
		const query = { isActive: true };
		if (category) {
			query.category = category;
		}

		// Get all active blogs
		const blogs = await Blog.find(query)
			.sort({ createdAt: -1 })
			.select("-__v")
			.lean();

		return NextResponse.json({
			success: true,
			data: blogs,
			count: blogs.length,
		});
	} catch (error) {
		console.error("Error fetching blogs:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch blogs",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
