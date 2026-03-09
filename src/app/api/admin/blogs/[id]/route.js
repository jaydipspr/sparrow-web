import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import { authenticateAdmin } from "@/middleware/auth";
import mongoose from "mongoose";
import { generateUniqueSlug } from "@/lib/utils/slug";

/**
 * @swagger
 * /api/admin/blogs/{id}:
 *   get:
 *     summary: Get a single blog by ID or slug (admin)
 *     description: Retrieve a specific blog by their MongoDB ID or slug (admin only)
 *     tags: [Admin Blogs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID or slug of the blog
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
 *                   $ref: '#/components/schemas/Blog'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
export async function GET(request, { params }) {
	try {
		const admin = await authenticateAdmin(request);

		if (!admin) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin authentication required." },
				{ status: 401 }
			);
		}

		await connectDB();

		const { id } = await params;

		let blog = null;

		// Try as MongoDB ObjectId first
		if (mongoose.Types.ObjectId.isValid(id)) {
			blog = await Blog.findById(id).select("-__v").lean();
		}

		// If not found by ID, try as slug
		if (!blog) {
			blog = await Blog.findOne({ slug: id }).select("-__v").lean();
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
	} catch (error) {
		console.error("Error fetching blog:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch blog",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * @swagger
 * /api/admin/blogs/{id}:
 *   put:
 *     summary: Update a blog by ID (admin)
 *     description: Update an existing blog's details (admin only)
 *     tags: [Admin Blogs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the blog to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Future of AI in Business - Updated"
 *               img:
 *                 type: string
 *                 example: "/images/blog/blog-1.webp"
 *               author:
 *                 type: string
 *                 example: "John Doe"
 *               category:
 *                 type: string
 *                 example: "Technology"
 *               content:
 *                 type: array
 *                 items:
 *                   type: string
 *               thought:
 *                 type: string
 *               thoughtAuthor:
 *                 type: string
 *               keyLessons:
 *                 type: array
 *                 items:
 *                   type: string
 *               conclusion:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Invalid input or ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
export async function PUT(request, { params }) {
	try {
		const admin = await authenticateAdmin(request);

		if (!admin) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin authentication required." },
				{ status: 401 }
			);
		}

		await connectDB();

		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid blog ID format" },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const { title, img, author, category, content, thought, thoughtAuthor, keyLessons, conclusion, isActive } = body;

		const updateData = {};
		if (title !== undefined) {
			updateData.title = title.trim();
			// Regenerate slug when title changes
			updateData.slug = await generateUniqueSlug(Blog, title.trim(), id);
		}
		if (img !== undefined) updateData.img = img.trim();
		if (author !== undefined) updateData.author = author.trim();
		if (category !== undefined) updateData.category = category.trim();
		if (content !== undefined) updateData.content = Array.isArray(content) ? content : [];
		if (thought !== undefined) updateData.thought = thought;
		if (thoughtAuthor !== undefined) updateData.thoughtAuthor = (thoughtAuthor || "").trim();
		if (keyLessons !== undefined) updateData.keyLessons = Array.isArray(keyLessons) ? keyLessons : [];
		if (conclusion !== undefined) updateData.conclusion = conclusion;
		if (isActive !== undefined) updateData.isActive = isActive;

		const updatedBlog = await Blog.findByIdAndUpdate(
			id,
			updateData,
			{ new: true, runValidators: true }
		).select("-__v").lean();

		if (!updatedBlog) {
			return NextResponse.json(
				{ error: "Blog not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: updatedBlog,
		});
	} catch (error) {
		console.error("Error updating blog:", error);

		if (error.code === 11000) {
			return NextResponse.json(
				{ error: "Blog with this title already exists" },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				error: "Failed to update blog",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * @swagger
 * /api/admin/blogs/{id}:
 *   delete:
 *     summary: Delete a blog by ID (admin)
 *     description: Remove a specific blog from the database (admin only)
 *     tags: [Admin Blogs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the blog to delete
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Blog deleted successfully"
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
export async function DELETE(request, { params }) {
	try {
		const admin = await authenticateAdmin(request);

		if (!admin) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin authentication required." },
				{ status: 401 }
			);
		}

		await connectDB();

		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid blog ID format" },
				{ status: 400 }
			);
		}

		const deletedBlog = await Blog.findByIdAndDelete(id);

		if (!deletedBlog) {
			return NextResponse.json(
				{ error: "Blog not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Blog deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting blog:", error);
		return NextResponse.json(
			{
				error: "Failed to delete blog",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
