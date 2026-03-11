import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Service from "@/models/Service";
import { authenticateAdmin } from "@/middleware/auth";
import { generateUniqueSlug } from "@/lib/utils/slug";

/**
 * @swagger
 * /api/admin/services:
 *   get:
 *     summary: Get all services (admin)
 *     description: Retrieve all services with pagination (admin only)
 *     tags: [Admin Services]
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
 *                     $ref: '#/components/schemas/Service'
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
		const totalCount = await Service.countDocuments({});

		// Get paginated services
		const services = await Service.find({})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select("-order")
			.lean();

		// Calculate pagination metadata
		const totalPages = Math.ceil(totalCount / limit);
		const hasNextPage = page < totalPages;
		const hasPrevPage = page > 1;

		return NextResponse.json({
			success: true,
			data: services,
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
		console.error("Error fetching services:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch services",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * @swagger
 * /api/admin/services:
 *   post:
 *     summary: Create a new service (admin)
 *     description: Create a new service (admin only)
 *     tags: [Admin Services]
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
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Web Development
 *               title:
 *                 type: string
 *                 example: Professional Web Development Services
 *               img:
 *                 type: string
 *                 example: /images/service/service-1.webp
 *               description:
 *                 type: string
 *               points:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Feature 1", "Feature 2"]
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Service created successfully
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
 *                   $ref: '#/components/schemas/Service'
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
		console.log("Received request body:", JSON.stringify(body, null, 2));
		const { name, title, img, description, points, isActive } = body;

		if (!name || name.trim() === "") {
			return NextResponse.json(
				{ error: "Service name is required" },
				{ status: 400 }
			);
		}

		if (!img || img.trim() === "") {
			return NextResponse.json(
				{ error: "Service image URL is required" },
				{ status: 400 }
			);
		}

		if (!description || description.trim() === "") {
			return NextResponse.json(
				{ error: "Service description is required" },
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

		// Validate points is an array if provided
		if (points !== undefined && !Array.isArray(points)) {
			return NextResponse.json(
				{ error: "Points must be an array of strings" },
				{ status: 400 }
			);
		}

		// Check if service with same name exists
		const existingService = await Service.findOne({
			name: { $regex: new RegExp(`^${name}$`, "i") },
		});

		if (existingService) {
			return NextResponse.json(
				{ error: "Service with this name already exists" },
				{ status: 400 }
			);
		}

		// Generate unique slug from name
		const slug = await generateUniqueSlug(Service, name.trim());

		// Create service with only the new schema fields
		const serviceData = {
			name: name.trim(),
			slug,
			title: (title || "").trim(),
			img: img.trim(),
			description: description.trim(),
			points: Array.isArray(points) ? points : [],
			isActive: isActive !== undefined ? Boolean(isActive) : true,
		};

		console.log("Service data to save:", JSON.stringify(serviceData, null, 2));

		// Create service using create() method which ensures all fields are saved
		const service = await Service.create(serviceData);
		console.log("Service created successfully with ID:", service._id);

		// Remove any old fields that shouldn't be in the schema (if they exist)
		await Service.findByIdAndUpdate(
			service._id,
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
					order: "",
				},
			}
		);

		// Fetch the service again to get the final state
		const finalService = await Service.findById(service._id).select("-order").lean();
		
		// Log the saved service to verify
		console.log("Final service after cleanup:", JSON.stringify(finalService, null, 2));

		return NextResponse.json(
			{
				success: true,
				message: "Service created successfully",
				data: finalService, // Return the final service with all fields
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating service:", error);
		return NextResponse.json(
			{
				error: "Failed to create service",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
