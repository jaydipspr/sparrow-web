import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Admin from "@/models/Admin";

// POST - Create new admin (protected route - should be used only by super admin)
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
