import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Technology from "@/models/Technology";
import { authenticateAdmin } from "@/middleware/auth";
import mongoose from "mongoose";
import { generateUniqueSlug } from "@/lib/utils/slug";

/**
 * @swagger
 * /api/admin/technology/{id}:
 *   get:
 *     summary: Get a single technology by ID (admin)
 *     description: Retrieve a single technology by its ID (admin only)
 *     tags: [Admin Technology]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Technology ID (MongoDB ObjectId)
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
 *                   $ref: '#/components/schemas/Technology'
 *       400:
 *         description: Invalid technology ID
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
 *         description: Technology not found
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

		let technology = null;

		// Try as MongoDB ObjectId first
		if (mongoose.Types.ObjectId.isValid(id)) {
			technology = await Technology.findById(id).select("-__v").lean();
		}

		// If not found by ID, try as slug
		if (!technology) {
			technology = await Technology.findOne({ slug: id }).select("-__v").lean();
		}

		if (!technology) {
			return NextResponse.json(
				{ error: "Technology not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: technology,
		});
	} catch (error) {
		console.error("Error fetching technology:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch technology",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * @swagger
 * /api/admin/technology/{id}:
 *   put:
 *     summary: Update a technology (admin)
 *     description: Update an existing technology (admin only)
 *     tags: [Admin Technology]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Technology ID (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Web Development, Application Development, Backend & Database]
 *               title:
 *                 type: string
 *               img:
 *                 type: string
 *               description:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Technology updated successfully
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
 *                   $ref: '#/components/schemas/Technology'
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
 *         description: Technology not found
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
				{ error: "Invalid technology ID" },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const { name, category, title, img, description, features, isActive } = body;

		// Check if technology exists
		const existingTechnology = await Technology.findById(id);

		if (!existingTechnology) {
			return NextResponse.json(
				{ error: "Technology not found" },
				{ status: 404 }
			);
		}

		// Validate name if provided
		if (name !== undefined) {
			if (!name || name.trim() === "") {
				return NextResponse.json(
					{ error: "Technology name is required" },
					{ status: 400 }
				);
			}

			// If name is being changed, check for duplicates
			if (name !== existingTechnology.name) {
				const duplicateTechnology = await Technology.findOne({
					name: { $regex: new RegExp(`^${name}$`, "i") },
					_id: { $ne: id },
				});

				if (duplicateTechnology) {
					return NextResponse.json(
						{ error: "Technology with this name already exists" },
						{ status: 400 }
					);
				}
			}
		}

		// Validate category if provided
		if (category !== undefined) {
			if (!category || category.trim() === "") {
				return NextResponse.json(
					{ error: "Category is required" },
					{ status: 400 }
				);
			}
		}

		// Validate image URL if provided
		if (img !== undefined) {
			if (!img || img.trim() === "") {
				return NextResponse.json(
					{ error: "Technology image URL is required" },
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
					{ error: "Technology description is required" },
					{ status: 400 }
				);
			}
		}

		// Validate features is an array if provided
		if (features !== undefined && !Array.isArray(features)) {
			return NextResponse.json(
				{ error: "Features must be an array of strings" },
				{ status: 400 }
			);
		}

		// Build update object with only provided fields
		const updateData = {};
		if (name !== undefined) {
			updateData.name = name.trim();
			// Regenerate slug when name changes
			updateData.slug = await generateUniqueSlug(Technology, name.trim(), id);
		}
		if (category !== undefined) updateData.category = category.trim();
		if (title !== undefined) updateData.title = title.trim();
		if (img !== undefined) updateData.img = img.trim();
		if (description !== undefined) updateData.description = description.trim();
		if (features !== undefined) updateData.features = features;
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
			points: "",
		};

		// Update technology - set new fields and unset old ones
		const updatedTechnology = await Technology.findByIdAndUpdate(
			id,
			{
				$set: updateData,
				$unset: unsetData,
			},
			{ new: true, runValidators: true }
		).select("-__v").lean();

		return NextResponse.json({
			success: true,
			message: "Technology updated successfully",
			data: updatedTechnology,
		});
	} catch (error) {
		console.error("Error updating technology:", error);
		return NextResponse.json(
			{
				error: "Failed to update technology",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * @swagger
 * /api/admin/technology/{id}:
 *   delete:
 *     summary: Delete a technology (admin)
 *     description: Delete a technology by ID (admin only)
 *     tags: [Admin Technology]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Technology ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Technology deleted successfully
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
 *                   $ref: '#/components/schemas/Technology'
 *       400:
 *         description: Invalid technology ID
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
 *         description: Technology not found
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
				{ error: "Invalid technology ID" },
				{ status: 400 }
			);
		}

		const technology = await Technology.findByIdAndDelete(id).select("-__v").lean();

		if (!technology) {
			return NextResponse.json(
				{ error: "Technology not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Technology deleted successfully",
			data: technology,
		});
	} catch (error) {
		console.error("Error deleting technology:", error);
		return NextResponse.json(
			{
				error: "Failed to delete technology",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
