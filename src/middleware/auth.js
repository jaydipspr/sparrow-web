import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import connectDB from "@/lib/db/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Verify JWT token and get admin
 * @param {string} token - JWT token
 * @returns {Object|null} - Admin object or null
 */
export async function verifyToken(token) {
	try {
		if (!token) {
			return null;
		}

		// Remove "Bearer " prefix if present
		const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;

		// Verify token
		const decoded = jwt.verify(actualToken, JWT_SECRET);

		await connectDB();

		// Get admin from database
		const admin = await Admin.findById(decoded.id).select("-password");

		if (!admin) {
			return null;
		}

		return admin;
	} catch (error) {
		console.error("Token verification error:", error);
		return null;
	}
}

/**
 * Middleware to protect API routes
 * @param {Request} request - Next.js request object
 * @returns {Object|null} - Admin object or null
 */
export async function authenticateAdmin(request) {
	try {
		const authHeader = request.headers.get("authorization");

		if (!authHeader) {
			return null;
		}

		const admin = await verifyToken(authHeader);
		return admin;
	} catch (error) {
		console.error("Authentication error:", error);
		return null;
	}
}
