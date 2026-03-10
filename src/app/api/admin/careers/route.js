import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Career from "@/models/Career";
import { authenticateAdmin } from "@/middleware/auth";

/**
 * @swagger
 * /api/admin/careers:
 *   get:
 *     summary: Get all career applications (admin)
 *     description: Retrieve all career applications with pagination (admin only)
 *     tags: [Admin Careers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: string
 *           enum: [true, false, all]
 *           default: all
 *         description: Filter by read status
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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
		const isReadFilter = searchParams.get("isRead");
		const skip = (page - 1) * limit;

		// Build filter
		const filter = {};
		if (isReadFilter === "true") {
			filter.isRead = true;
		} else if (isReadFilter === "false") {
			filter.isRead = false;
		}

		const totalCount = await Career.countDocuments(filter);
		const careers = await Career.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select("-__v")
			.lean();

		const totalPages = Math.ceil(totalCount / limit);
		const hasNextPage = page < totalPages;
		const hasPrevPage = page > 1;

		// Count unread
		const unreadCount = await Career.countDocuments({ isRead: false });

		return NextResponse.json({
			success: true,
			data: careers,
			unreadCount,
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
		console.error("Error fetching careers:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch career applications",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
