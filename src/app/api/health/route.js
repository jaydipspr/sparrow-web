import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";

// GET - Health check endpoint to test database connection
export async function GET() {
	try {
		console.log("Testing database connection...");
		await connectDB();
		
		return NextResponse.json({
			success: true,
			message: "Database connection is healthy",
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Database connection failed");
		return NextResponse.json(
			{
				success: false,
				message: "Database connection failed",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
