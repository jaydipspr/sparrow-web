import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import mongoose from "mongoose";

/**
 * Track blog view - increments viewCount in Blog schema
 * POST /api/blogview
 */
export async function POST(request) {
	try {
		await connectDB();

		const body = await request.json();
		const { blogId, blogSlug } = body;

		// Validate blogId or blogSlug
		if (!blogId && !blogSlug) {
			return NextResponse.json(
				{ error: "Blog ID or slug is required" },
				{ status: 400 }
			);
		}

		// Find and update the blog to increment viewCount
		let updateQuery = {};
		if (blogId && mongoose.Types.ObjectId.isValid(blogId)) {
			updateQuery._id = blogId;
		} else if (blogSlug) {
			updateQuery.slug = blogSlug;
		} else {
			return NextResponse.json(
				{ error: "Invalid blog ID or slug" },
				{ status: 400 }
			);
		}

		// Increment viewCount atomically
		const blog = await Blog.findOneAndUpdate(
			updateQuery,
			{ $inc: { viewCount: 1 } },
			{ new: true, strict: true }
		).select("_id slug viewCount");

		if (!blog) {
			return NextResponse.json(
				{ error: "Blog not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ 
			success: true, 
			message: "Blog view tracked",
			viewCount: blog.viewCount 
		});
	} catch (error) {
		console.error("Error tracking blog view:", error);
		return NextResponse.json(
			{ error: "Failed to track blog view" },
			{ status: 500 }
		);
	}
}
