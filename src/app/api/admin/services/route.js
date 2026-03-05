import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Service from "@/models/Service";
import { authenticateAdmin } from "@/middleware/auth";

// GET all services (admin)
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

		const services = await Service.find({})
			.sort({ order: 1, createdAt: -1 })
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

// POST create new service (admin)
// Required fields: title, img
// Optional fields: description, points (array of strings), isActive, order
export async function POST(request) {
	try {
		const admin = await authenticateAdmin(request);

		if (!admin) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin authentication required." },
				{ status: 401 }
			);
		}

		await connectDB();

		const body = await request.json();
		console.log("Received request body:", JSON.stringify(body, null, 2));
		const { name, title, img, description, points, isActive, order } = body;

		if (!name || name.trim() === "") {
			return NextResponse.json(
				{ error: "Service name is required" },
				{ status: 400 }
			);
		}

		if (!img || img.trim() === "") {
			return NextResponse.json(
				{ error: "Service image URL is required" },
				{ status: 400 }
			);
		}

		// Validate image URL format
		if (!img.startsWith("/") && !img.startsWith("http://") && !img.startsWith("https://")) {
			return NextResponse.json(
				{ error: "Image URL must be a valid path (starting with /) or URL (starting with http:// or https://)" },
				{ status: 400 }
			);
		}

		// Validate points is an array if provided
		if (points !== undefined && !Array.isArray(points)) {
			return NextResponse.json(
				{ error: "Points must be an array of strings" },
				{ status: 400 }
			);
		}

		// Check if service with same name exists
		const existingService = await Service.findOne({
			name: { $regex: new RegExp(`^${name}$`, "i") },
		});

		if (existingService) {
			return NextResponse.json(
				{ error: "Service with this name already exists" },
				{ status: 400 }
			);
		}

		// Create service with only the new schema fields
		const serviceData = {
			name: name.trim(),
			title: (title || "").trim(),
			img: img.trim(),
			description: description || "",
			points: Array.isArray(points) ? points : [],
			isActive: isActive !== undefined ? Boolean(isActive) : true,
			order: order !== undefined ? parseInt(order) : 0,
		};

		console.log("Service data to save:", JSON.stringify(serviceData, null, 2));

		// Create service using create() method which ensures all fields are saved
		let service;
		try {
			// Use create() instead of new + save() to ensure all fields are properly saved
			service = await Service.create(serviceData);
			console.log("Service created successfully with ID:", service._id);
		} catch (error) {
			// Handle duplicate slug error
			if (error.code === 11000 && error.keyPattern?.slug) {
				// Regenerate slug and try again
				const baseSlug = name
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/(^-|-$)/g, "");
				let slug = baseSlug;
				let counter = 1;
				
				while (await Service.findOne({ slug })) {
					slug = `${baseSlug}-${counter}`;
					counter++;
				}
				
				// Add slug to serviceData and try again
				serviceData.slug = slug;
				service = await Service.create(serviceData);
			} else {
				throw error;
			}
		}

		// Remove any old fields that shouldn't be in the schema (if they exist)
		await Service.findByIdAndUpdate(
			service._id,
			{
				$unset: {
					shortTitle: "",
					titleLarge: "",
					img2: "",
					img3: "",
					img4: "",
					img5: "",
					bgImg: "",
					bgImg2: "",
					iconName: "",
					svg: "",
					desc: "",
					shortDesc: "",
					desc1: "",
					desc2: "",
					desc3: "",
					totalProject: "",
					process: "",
				},
			}
		);

		// Fetch the service again to get the final state
		const finalService = await Service.findById(service._id).lean();
		
		// Log the saved service to verify
		console.log("Final service after cleanup:", JSON.stringify(finalService, null, 2));

		return NextResponse.json(
			{
				success: true,
				message: "Service created successfully",
				data: finalService, // Return the final service with all fields
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating service:", error);
		return NextResponse.json(
			{
				error: "Failed to create service",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
