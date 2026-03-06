import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * @swagger
 * /api/admin/auth/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate admin user and receive JWT token
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
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                     token:
 *                       type: string
 *                       description: JWT token for authentication
 *                     admin:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
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
		// Find admin by email and include password
		const admin = await Admin.findOne({ email }).select("+password");
		if (!admin) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 }
			);
		}
		// Compare password
		const isPasswordValid = await admin.comparePassword(password);
		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 }
			);
		}
		// Generate JWT token
		const token = jwt.sign(
			{
				id: admin._id,
				email: admin.email,
			},
			JWT_SECRET,
			{
				expiresIn: JWT_EXPIRES_IN,
			}
		);
		// Return success response with token
		return NextResponse.json(
			{
				success: true,
				message: "Login successful",
				data: {
					token,
					admin: {
						id: admin._id,
						email: admin.email,
					},
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error during admin login:", error);
		return NextResponse.json(
			{ error: "Login failed", details: error.message },
			{ status: 500 }
		);
	}
}
