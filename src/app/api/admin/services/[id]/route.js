import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Service from "@/models/Service";
import { authenticateAdmin } from "@/middleware/auth";
import mongoose from "mongoose";

// GET single service by ID (admin)
export async function GET(request, { params }) {
	try {
		const admin = await authenticateAdmin(request);

		if (!admin) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin authentication required." },
				{ status: 401 }
			);
		}

		await connectDB();

		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid service ID" },
				{ status: 400 }
			);
		}

		const service = await Service.findById(id).lean();

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
	} catch (error) {
		console.error("Error fetching service:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch service",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

// PUT update service (admin)
export async function PUT(request, { params }) {
	try {
		const admin = await authenticateAdmin(request);

		if (!admin) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin authentication required." },
				{ status: 401 }
			);
		}

		await connectDB();

		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid service ID" },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const { name, title, img, description, points, isActive, order } = body;

		// Check if service exists
		const existingService = await Service.findById(id);

		if (!existingService) {
			return NextResponse.json(
				{ error: "Service not found" },
				{ status: 404 }
			);
		}

		// Validate name if provided
		if (name !== undefined) {
			if (!name || name.trim() === "") {
				return NextResponse.json(
					{ error: "Service name is required" },
					{ status: 400 }
				);
			}

			// If name is being changed, check for duplicates
			if (name !== existingService.name) {
				const duplicateService = await Service.findOne({
					name: { $regex: new RegExp(`^${name}$`, "i") },
					_id: { $ne: id },
				});

				if (duplicateService) {
					return NextResponse.json(
						{ error: "Service with this name already exists" },
						{ status: 400 }
					);
				}
			}
		}

		// Validate image URL if provided
		if (img !== undefined) {
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
		}

		// Validate points is an array if provided
		if (points !== undefined && !Array.isArray(points)) {
			return NextResponse.json(
				{ error: "Points must be an array of strings" },
				{ status: 400 }
			);
		}

		// Build update object with only provided fields
		const updateData = {};
		if (name !== undefined) updateData.name = name;
		if (title !== undefined) updateData.title = title;
		if (img !== undefined) updateData.img = img;
		if (description !== undefined) updateData.description = description;
		if (points !== undefined) updateData.points = points;
		if (isActive !== undefined) updateData.isActive = isActive;
		if (order !== undefined) updateData.order = order;

		// Remove old fields that shouldn't be in the schema
		const unsetData = {
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
		};

		// Update service - set new fields and unset old ones
		const updatedService = await Service.findByIdAndUpdate(
			id,
			{
				$set: updateData,
				$unset: unsetData,
			},
			{ new: true, runValidators: true }
		).lean();

		return NextResponse.json({
			success: true,
			message: "Service updated successfully",
			data: updatedService,
		});
	} catch (error) {
		console.error("Error updating service:", error);
		return NextResponse.json(
			{
				error: "Failed to update service",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

// DELETE service (admin)
export async function DELETE(request, { params }) {
	try {
		const admin = await authenticateAdmin(request);

		if (!admin) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin authentication required." },
				{ status: 401 }
			);
		}

		await connectDB();

		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid service ID" },
				{ status: 400 }
			);
		}

		const service = await Service.findByIdAndDelete(id).lean();

		if (!service) {
			return NextResponse.json(
				{ error: "Service not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Service deleted successfully",
			data: service,
		});
	} catch (error) {
		console.error("Error deleting service:", error);
		return NextResponse.json(
			{
				error: "Failed to delete service",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
