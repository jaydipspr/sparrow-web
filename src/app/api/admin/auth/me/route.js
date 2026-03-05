import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/middleware/auth";

// GET - Get current admin profile
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
