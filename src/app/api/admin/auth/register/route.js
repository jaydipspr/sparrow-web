import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Admin from "@/models/Admin";

/**
 * @swagger
 * /api/admin/auth/register:
 *   post:
 *     summary: Register a new admin
 *     description: Create a new admin account (protected route - should be used only by super admin)
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *     responses:
 *       201:
 *         description: Admin created successfully
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Validation error or admin already exists
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
		await connectDB();
		const body = await request.json();
		const { email, password } = body;
		// Validation
		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			);
		}
		// Check if admin already exists
		const existingAdmin = await Admin.findOne({ email });
		if (existingAdmin) {
			return NextResponse.json(
				{ error: "Admin with this email already exists" },
				{ status: 400 }
			);
		}
		// Create new admin
		const admin = await Admin.create({
			email,
			password,
		});
		return NextResponse.json(
			{
				success: true,
				message: "Admin created successfully",
				data: {
					id: admin._id,
					email: admin.email,
				},
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating admin:", error);
		
		// Handle validation errors
		if (error.name === "ValidationError") {
			const errors = Object.values(error.errors).map((err) => err.message);
			return NextResponse.json(
				{ error: "Validation failed", details: errors },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ error: "Failed to create admin", details: error.message },
			{ status: 500 }
		);
	}
}
