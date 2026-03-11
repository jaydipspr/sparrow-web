import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import { authenticateAdmin } from "@/middleware/auth";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/admin/blogs/{id}/comment/{commentIndex}:
 *   delete:
 *     summary: Delete a comment from a blog (admin)
 *     description: Remove a specific comment from a blog by comment index (admin only)
 *     tags: [Admin Blogs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the blog
 *       - in: path
 *         name: commentIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: Index of the comment in the comments array
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog or comment not found
 *       500:
 *         description: Server error
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

		const { id, commentIndex } = await params;
		
		// Validate commentIndex parameter
		if (commentIndex === undefined || commentIndex === null || commentIndex === "") {
			return NextResponse.json(
				{ error: "Comment index is required", received: commentIndex },
				{ status: 400 }
			);
		}

		const index = parseInt(String(commentIndex), 10);

		if (isNaN(index) || index < 0) {
			return NextResponse.json(
				{ error: `Invalid comment index: ${commentIndex}. Expected a non-negative integer.`, received: commentIndex, parsed: index },
				{ status: 400 }
			);
		}

		// Find blog by ID or slug (similar to GET endpoint)
		let blog = null;
		if (mongoose.Types.ObjectId.isValid(id)) {
			blog = await Blog.findById(id);
		}

		// If not found by ID, try as slug
		if (!blog) {
			blog = await Blog.findOne({ slug: id });
		}

		if (!blog) {
			console.error("Blog not found:", { id, isValidObjectId: mongoose.Types.ObjectId.isValid(id) });
			return NextResponse.json(
				{ error: "Blog not found", receivedId: id },
				{ status: 404 }
			);
		}

		if (!blog.comments || !Array.isArray(blog.comments) || index >= blog.comments.length) {
			return NextResponse.json(
				{ error: "Comment not found" },
				{ status: 404 }
			);
		}

		// Remove the comment at the specified index
		blog.comments.splice(index, 1);
		await blog.save();

		return NextResponse.json({
			success: true,
			message: "Comment deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting comment:", error);
		return NextResponse.json(
			{
				error: "Failed to delete comment",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
