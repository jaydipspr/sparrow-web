import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/middleware/auth";

/**
 * @swagger
 * /api/admin/auth/me:
 *   get:
 *     summary: Get current admin profile
 *     description: Get the authenticated admin's profile information
 *     tags: [Admin Auth]
 *     security:
 *       - BearerAuth: []
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
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
				{ error: "Unauthorized. Please login." },
				{ status: 401 }
			);
		}
		return NextResponse.json({
			success: true,
			data: {
				id: admin._id,
				email: admin.email,
				createdAt: admin.createdAt,
			},
		});
	} catch (error) {
		console.error("Error fetching admin profile:", error);
		return NextResponse.json(
			{ error: "Failed to fetch admin profile", details: error.message },
			{ status: 500 }
		);
	}
}
