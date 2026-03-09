import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Team from "@/models/Team";
import { authenticateAdmin } from "@/middleware/auth";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/admin/team/{id}:
 *   get:
 *     summary: Get a single team member by ID (admin)
 *     description: Retrieve a single team member by ID (admin only)
 *     tags: [Admin Team]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID (MongoDB ObjectId)
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
 *                   $ref: '#/components/schemas/Team'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Team member not found
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
 *   put:
 *     summary: Update a team member (admin)
 *     description: Update an existing team member (admin only)
 *     tags: [Admin Team]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               img:
 *                 type: string
 *               position:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Team member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       400:
 *         description: Bad request
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
 *         description: Team member not found
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
 *   delete:
 *     summary: Delete a team member (admin)
 *     description: Delete an existing team member (admin only)
 *     tags: [Admin Team]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Team member deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Team member not found
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

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid team member ID" },
				{ status: 400 }
			);
		}

		const team = await Team.findById(id).select("-__v").lean();

		if (!team) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: team,
		});
	} catch (error) {
		console.error("Error fetching team member:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch team member",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

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
				{ error: "Invalid team member ID" },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const { name, img, position, isActive } = body;

		// Validation
		if (name !== undefined && (!name || !name.trim())) {
			return NextResponse.json(
				{ error: "Team member name cannot be empty" },
				{ status: 400 }
			);
		}

		if (img !== undefined && (!img || !img.trim())) {
			return NextResponse.json(
				{ error: "Team member image cannot be empty" },
				{ status: 400 }
			);
		}

		if (position !== undefined && (!position || !position.trim())) {
			return NextResponse.json(
				{ error: "Team member position cannot be empty" },
				{ status: 400 }
			);
		}

		// Build update object
		const updateData = {};
		if (name !== undefined) updateData.name = name.trim();
		if (img !== undefined) updateData.img = img.trim();
		if (position !== undefined) updateData.position = position.trim();
		if (isActive !== undefined) updateData.isActive = isActive;

		const team = await Team.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true, runValidators: true }
		)
			.select("-__v")
			.lean();

		if (!team) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: team,
		});
	} catch (error) {
		console.error("Error updating team member:", error);
		return NextResponse.json(
			{
				error: "Failed to update team member",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

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
				{ error: "Invalid team member ID" },
				{ status: 400 }
			);
		}

		const team = await Team.findByIdAndDelete(id);

		if (!team) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Team member deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting team member:", error);
		return NextResponse.json(
			{
				error: "Failed to delete team member",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
