import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import PageView from "@/models/PageView";

/**
 * Track page view
 * POST /api/pageview
 */
export async function POST(request) {
	try {
		await connectDB();

		const body = await request.json();
		const { page } = body;

		// Validate page
		const validPages = ["technology", "portfolio", "services", "teams", "blogs", "career", "about", "contact"];
		if (!page || !validPages.includes(page)) {
			return NextResponse.json(
				{ error: "Invalid page. Must be one of: " + validPages.join(", ") },
				{ status: 400 }
			);
		}

		// Get client info
		const headers = request.headers;
		const ipAddress = headers.get("x-forwarded-for") || headers.get("x-real-ip") || "unknown";
		const userAgent = headers.get("user-agent") || "unknown";
		const referer = headers.get("referer") || "direct";

		// Create page view record
		await PageView.create({
			page,
			ipAddress: ipAddress.split(",")[0].trim(), // Get first IP if multiple
			userAgent,
			referer,
		});

		return NextResponse.json({ success: true, message: "Page view tracked" });
	} catch (error) {
		console.error("Error tracking page view:", error);
		return NextResponse.json(
			{ error: "Failed to track page view" },
			{ status: 500 }
		);
	}
}
