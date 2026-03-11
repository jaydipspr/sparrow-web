import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Service from "@/models/Service";
import { authenticateAdmin } from "@/middleware/auth";
import mongoose from "mongoose";
import { generateUniqueSlug } from "@/lib/utils/slug";

/**
 * @swagger
 * /api/admin/services/{id}:
 *   get:
 *     summary: Get a single service by ID (admin)
 *     description: Retrieve a single service by its ID (admin only)
 *     tags: [Admin Services]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Invalid service ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Service not found
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

		let service = null;

		// Try as MongoDB ObjectId first
		if (mongoose.Types.ObjectId.isValid(id)) {
			service = await Service.findById(id).lean();
		}

		// If not found by ID, try as slug
		if (!service) {
			service = await Service.findOne({ slug: id }).lean();
		}

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

/**
 * @swagger
 * /api/admin/services/{id}:
 *   put:
 *     summary: Update a service (admin)
 *     description: Update an existing service (admin only)
 *     tags: [Admin Services]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               title:
 *                 type: string
 *               img:
 *                 type: string
 *               description:
 *                 type: string
 *               points:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Service updated successfully
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
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Service not found
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
		const { name, title, img, description, points, isActive } = body;

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

		// Validate description if provided
		if (description !== undefined) {
			if (!description || description.trim() === "") {
				return NextResponse.json(
					{ error: "Service description is required" },
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
		if (name !== undefined) {
			updateData.name = name;
			// Regenerate slug when name changes
			updateData.slug = await generateUniqueSlug(Service, name.trim(), id);
		}
		if (title !== undefined) updateData.title = title;
		if (img !== undefined) updateData.img = img;
		if (description !== undefined) updateData.description = description.trim();
		if (points !== undefined) updateData.points = points;
		if (isActive !== undefined) updateData.isActive = isActive;

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
			order: "",
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

/**
 * @swagger
 * /api/admin/services/{id}:
 *   delete:
 *     summary: Delete a service (admin)
 *     description: Delete a service by ID (admin only)
 *     tags: [Admin Services]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Service deleted successfully
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
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Invalid service ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Service not found
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
