import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Team from "@/models/Team";
import { authenticateAdmin } from "@/middleware/auth";

/**
 * @swagger
 * /api/admin/team:
 *   get:
 *     summary: Get all team members (admin)
 *     description: Retrieve all team members with pagination (admin only)
 *     tags: [Admin Team]
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
 *                     $ref: '#/components/schemas/Team'
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
 *   post:
 *     summary: Create a new team member (admin)
 *     description: Create a new team member (admin only)
 *     tags: [Admin Team]
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
 *               - position
 *             properties:
 *               name:
 *                 type: string
 *                 description: Team member name
 *               img:
 *                 type: string
 *                 description: Team member image URL
 *               position:
 *                 type: string
 *                 description: Team member position
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Team member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       400:
 *         description: Bad request
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
		const totalCount = await Team.countDocuments({});

		// Get paginated team members
		const teams = await Team.find({})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select("-__v")
			.lean();

		// Calculate pagination info
		const totalPages = Math.ceil(totalCount / limit);
		const hasNextPage = page < totalPages;
		const hasPrevPage = page > 1;

		return NextResponse.json({
			success: true,
			data: teams,
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
		console.error("Error fetching team members:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch team members",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

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
		const { name, img, position, isActive } = body;

		// Validation
		if (!name || !name.trim()) {
			return NextResponse.json(
				{ error: "Team member name is required" },
				{ status: 400 }
			);
		}

		if (!img || !img.trim()) {
			return NextResponse.json(
				{ error: "Team member image is required" },
				{ status: 400 }
			);
		}

		if (!position || !position.trim()) {
			return NextResponse.json(
				{ error: "Team member position is required" },
				{ status: 400 }
			);
		}

		// Create team member
		const teamData = {
			name: name.trim(),
			img: img.trim(),
			position: position.trim(),
			isActive: isActive !== undefined ? isActive : true,
		};

		const team = await Team.create(teamData);

		return NextResponse.json(
			{
				success: true,
				data: team,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating team member:", error);
		return NextResponse.json(
			{
				error: "Failed to create team member",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
