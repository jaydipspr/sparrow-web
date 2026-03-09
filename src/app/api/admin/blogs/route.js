import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import { authenticateAdmin } from "@/middleware/auth";
import { generateUniqueSlug } from "@/lib/utils/slug";

/**
 * @swagger
 * /api/admin/blogs:
 *   get:
 *     summary: Get all blogs (admin)
 *     description: Retrieve all blogs with pagination (admin only)
 *     tags: [Admin Blogs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
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
		const admin = await authenticateAdmin(request);

		if (!admin) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin authentication required." },
				{ status: 401 }
			);
		}

		await connectDB();

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const skip = (page - 1) * limit;

		const totalCount = await Blog.countDocuments({});
		const blogs = await Blog.find({})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select("-__v")
			.lean();

		const totalPages = Math.ceil(totalCount / limit);
		const hasNextPage = page < totalPages;
		const hasPrevPage = page > 1;

		return NextResponse.json({
			success: true,
			data: blogs,
			pagination: {
				currentPage: page,
				limit,
				totalCount,
				totalPages,
				hasNextPage,
				hasPrevPage,
			},
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

/**
 * @swagger
 * /api/admin/blogs:
 *   post:
 *     summary: Create a new blog (admin)
 *     description: Add a new blog to the database (admin only)
 *     tags: [Admin Blogs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - img
 *               - author
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Future of AI in Business"
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
 *                 example: ["First paragraph...", "Second paragraph..."]
 *               thought:
 *                 type: string
 *                 example: "Innovation distinguishes between a leader and a follower."
 *               thoughtAuthor:
 *                 type: string
 *                 example: "Steve Jobs"
 *               keyLessons:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["AI is transforming industries", "Automation is key"]
 *               conclusion:
 *                 type: string
 *                 example: "In conclusion, AI will reshape..."
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Blog created successfully
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
 *         description: Invalid input
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request) {
	try {
		const admin = await authenticateAdmin(request);

		if (!admin) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin authentication required." },
				{ status: 401 }
			);
		}

		await connectDB();

		const body = await request.json();
		const { title, img, author, category, content, thought, thoughtAuthor, keyLessons, conclusion, isActive } = body;

		if (!title || !img || !author || !category) {
			return NextResponse.json(
				{ error: "Title, image, author, and category are required" },
				{ status: 400 }
			);
		}

		// Generate unique slug from title
		const slug = await generateUniqueSlug(Blog, title.trim());

		const newBlog = await Blog.create({
			title: title.trim(),
			slug,
			img: img.trim(),
			author: author.trim(),
			category: category.trim(),
			content: Array.isArray(content) ? content : [],
			thought: thought || "",
			thoughtAuthor: (thoughtAuthor || "").trim(),
			keyLessons: Array.isArray(keyLessons) ? keyLessons : [],
			conclusion: conclusion || "",
			isActive: isActive !== undefined ? isActive : true,
		});

		return NextResponse.json(
			{
				success: true,
				data: newBlog,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating blog:", error);

		// Handle duplicate key error
		if (error.code === 11000) {
			return NextResponse.json(
				{ error: "Blog with this title already exists" },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				error: "Failed to create blog",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
