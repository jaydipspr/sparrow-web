import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/blogs/{slug}/comment:
 *   post:
 *     summary: Add a comment to a blog post
 *     description: Add a new comment to a blog post by slug (public endpoint)
 *     tags: [Public Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - comment
 *             properties:
 *               name:
 *                 type: string
 *                 description: Commenter's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Commenter's email
 *               website:
 *                 type: string
 *                 description: Commenter's website (optional)
 *               comment:
 *                 type: string
 *                 description: Comment text
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
export async function POST(request, { params }) {
	try {
		await connectDB();

		const { slug } = await params;
		const body = await request.json();
		const { name, email, website, comment } = body;

		// Validation
		if (!name || !name.trim()) {
			return NextResponse.json(
				{ error: "Name is required" },
				{ status: 400 }
			);
		}

		if (!email || !email.trim()) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 }
			);
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email format" },
				{ status: 400 }
			);
		}

		if (!comment || !comment.trim()) {
			return NextResponse.json(
				{ error: "Comment text is required" },
				{ status: 400 }
			);
		}

		// Find blog by slug
		const blog = await Blog.findOne({ slug, isActive: true });

		if (!blog) {
			return NextResponse.json(
				{ error: "Blog not found" },
				{ status: 404 }
			);
		}

		// Add comment
		const newComment = {
			name: name.trim(),
			email: email.trim().toLowerCase(),
			website: website ? website.trim() : "",
			comment: comment.trim(),
			createdAt: new Date(),
		};

		blog.comments.push(newComment);
		await blog.save();

		return NextResponse.json({
			success: true,
			message: "Comment added successfully",
			data: newComment,
		});
	} catch (error) {
		console.error("Error adding comment:", error);
		return NextResponse.json(
			{
				error: "Failed to add comment",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
