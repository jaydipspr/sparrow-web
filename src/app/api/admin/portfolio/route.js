import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Portfolio from "@/models/Portfolio";
import { authenticateAdmin } from "@/middleware/auth";
import { generateUniqueSlug } from "@/lib/utils/slug";

/**
 * @swagger
 * /api/admin/portfolio:
 *   get:
 *     summary: Get all portfolios (admin)
 *     description: Retrieve all portfolios with pagination (admin only)
 *     tags: [Admin Portfolio]
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
 *                     $ref: '#/components/schemas/Portfolio'
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

		const totalCount = await Portfolio.countDocuments({});
		const portfolios = await Portfolio.find({})
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
			data: portfolios,
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
		console.error("Error fetching portfolios:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch portfolios",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * @swagger
 * /api/admin/portfolio:
 *   post:
 *     summary: Create a new portfolio (admin)
 *     description: Add a new portfolio to the database (admin only)
 *     tags: [Admin Portfolio]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - img
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: "E-commerce Platform"
 *               title:
 *                 type: string
 *                 example: "Modern E-commerce Solution"
 *               img:
 *                 type: string
 *                 example: "/images/portfolio/portfolio-1.webp"
 *               description:
 *                 type: string
 *                 example: "A comprehensive e-commerce platform..."
 *               category:
 *                 type: string
 *                 example: "Web Development"
 *               keyHighlights:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Responsive Design", "Payment Integration"]
 *               technology:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "Node.js", "MongoDB"]
 *               projectLink:
 *                 type: string
 *                 example: "https://example.com"
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Portfolio created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Portfolio'
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
		const { name, title, img, description, category, keyHighlights, technology, projectLink, isActive } = body;

		if (!name || !img || !category) {
			return NextResponse.json(
				{ error: "Name, image, and category are required" },
				{ status: 400 }
			);
		}

		if (!description || description.trim() === "") {
			return NextResponse.json(
				{ error: "Portfolio description is required" },
				{ status: 400 }
			);
		}

		// Generate unique slug from name
		const slug = await generateUniqueSlug(Portfolio, name.trim());

		const newPortfolio = await Portfolio.create({
			name: name.trim(),
			slug,
			title: (title || "").trim(),
			img: img.trim(),
			description: description.trim(),
			category: category.trim(),
			keyHighlights: Array.isArray(keyHighlights) ? keyHighlights : [],
			technology: Array.isArray(technology) ? technology : [],
			projectLink: (projectLink || "").trim(),
			isActive: isActive !== undefined ? isActive : true,
		});

		return NextResponse.json(
			{
				success: true,
				data: newPortfolio,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating portfolio:", error);
		
		// Handle duplicate key error
		if (error.code === 11000) {
			return NextResponse.json(
				{ error: "Portfolio with this name already exists" },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				error: "Failed to create portfolio",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
