import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Technology from "@/models/Technology";
import { authenticateAdmin } from "@/middleware/auth";
import { generateUniqueSlug } from "@/lib/utils/slug";

/**
 * @swagger
 * /api/admin/technology:
 *   get:
 *     summary: Get all technologies (admin)
 *     description: Retrieve all technologies with pagination (admin only)
 *     tags: [Admin Technology]
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
 *                     $ref: '#/components/schemas/Technology'
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

		// Get query parameters
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const skip = (page - 1) * limit;

		// Get total count
		const totalCount = await Technology.countDocuments({});

		// Get paginated technologies
		const technologies = await Technology.find({})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select("-__v")
			.lean();

		// Calculate pagination metadata
		const totalPages = Math.ceil(totalCount / limit);
		const hasNextPage = page < totalPages;
		const hasPrevPage = page > 1;

		return NextResponse.json({
			success: true,
			data: technologies,
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
		console.error("Error fetching technologies:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch technologies",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

// POST create new technology (admin)
// Required fields: name, category, img
// Optional fields: title, description, features (array of strings), isActive
/**
 * @swagger
 * /api/admin/technology:
 *   post:
 *     summary: Create a new technology (admin)
 *     description: Create a new technology (admin only)
 *     tags: [Admin Technology]
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
 *               - category
 *               - img
 *             properties:
 *               name:
 *                 type: string
 *                 example: React
 *               category:
 *                 type: string
 *                 enum: [Web Development, Application Development, Backend & Database]
 *                 example: Web Development
 *               title:
 *                 type: string
 *                 example: React - Modern UI Library
 *               img:
 *                 type: string
 *                 example: /images/technology/react.webp
 *               description:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Component-based", "Virtual DOM", "Reusable"]
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Technology created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Technology'
 *       400:
 *         description: Validation error
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
		const { name, category, title, img, description, features, isActive } = body;

		if (!name || name.trim() === "") {
			return NextResponse.json(
				{ error: "Technology name is required" },
				{ status: 400 }
			);
		}

		if (!category || category.trim() === "") {
			return NextResponse.json(
				{ error: "Category is required" },
				{ status: 400 }
			);
		}

		if (!img || img.trim() === "") {
			return NextResponse.json(
				{ error: "Technology image URL is required" },
				{ status: 400 }
			);
		}

		// Validate image URL format
		if (!img.startsWith("/") && !img.startsWith("http://") && !img.startsWith("https://")) {
			return NextResponse.json(
				{ error: "Image URL must be a valid path (starting with /) or URL (starting with http:// or https://)" },
				{ status: 400 }
			);
		}

		// Validate features is an array if provided
		if (features !== undefined && !Array.isArray(features)) {
			return NextResponse.json(
				{ error: "Features must be an array of strings" },
				{ status: 400 }
			);
		}

		// Check if technology with same name exists
		const existingTechnology = await Technology.findOne({
			name: { $regex: new RegExp(`^${name}$`, "i") },
		});

		if (existingTechnology) {
			return NextResponse.json(
				{ error: "Technology with this name already exists" },
				{ status: 400 }
			);
		}

		// Generate unique slug from name
		const slug = await generateUniqueSlug(Technology, name.trim());

		// Create technology with only the new schema fields
		const technologyData = {
			name: name.trim(),
			slug,
			category: category.trim(),
			title: (title || "").trim(),
			img: img.trim(),
			description: description || "",
			features: Array.isArray(features) ? features : [],
			isActive: isActive !== undefined ? Boolean(isActive) : true,
		};

		// Create technology using create() method
		const technology = await Technology.create(technologyData);

		// Remove any old fields that shouldn't be in the schema (if they exist)
		await Technology.findByIdAndUpdate(
			technology._id,
			{
				$unset: {
					shortTitle: "",
					titleLarge: "",
					img2: "",
					img3: "",
					img4: "",
					img5: "",
					bgImg: "",
					bgImg2: "",
					iconName: "",
					svg: "",
					desc: "",
					shortDesc: "",
					desc1: "",
					desc2: "",
					desc3: "",
					totalProject: "",
					process: "",
					points: "",
				},
			}
		);

		// Fetch the technology again to get the final state
		const finalTechnology = await Technology.findById(technology._id).select("-__v").lean();

		return NextResponse.json(
			{
				success: true,
				message: "Technology created successfully",
				data: finalTechnology,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating technology:", error);
		return NextResponse.json(
			{
				error: "Failed to create technology",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
