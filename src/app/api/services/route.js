import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Service from "@/models/Service";

// GET all active services (public)
export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const slug = searchParams.get("slug");
		const id = searchParams.get("id");

		// Get single service by slug or id
		if (slug) {
			const service = await Service.findOne({
				slug,
				isActive: true,
			}).lean();

			if (!service) {
				return NextResponse.json(
					{ error: "Service not found" },
					{ status: 404 }
				);
			}

			return NextResponse.json({
				success: true,
				data: service,
			});
		}

		if (id) {
			const service = await Service.findOne({
				_id: id,
				isActive: true,
			}).lean();

			if (!service) {
				return NextResponse.json(
					{ error: "Service not found" },
					{ status: 404 }
				);
			}

			return NextResponse.json({
				success: true,
				data: service,
			});
		}

		// Get all active services
		const services = await Service.find({ isActive: true })
			.sort({ order: 1, createdAt: -1 })
			.select("-__v")
			.lean();

		return NextResponse.json({
			success: true,
			data: services,
			count: services.length,
		});
	} catch (error) {
		console.error("Error fetching services:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch services",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
