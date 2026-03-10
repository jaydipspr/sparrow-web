import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Career from "@/models/Career";
import { authenticateAdmin } from "@/middleware/auth";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/admin/careers/{id}:
 *   get:
 *     summary: Get a single career application by ID (admin)
 *     tags: [Admin Careers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Career application not found
 *       500:
 *         description: Server error
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

		const { id } = await params;
		await connectDB();

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid career application ID" },
				{ status: 400 }
			);
		}

		const career = await Career.findById(id).select("-__v").lean();

		if (!career) {
			return NextResponse.json(
				{ error: "Career application not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: career,
		});
	} catch (error) {
		console.error("Error fetching career application:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch career application",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * @swagger
 * /api/admin/careers/{id}:
 *   put:
 *     summary: Update career application read status (admin)
 *     tags: [Admin Careers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isRead:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Career application updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Career application not found
 *       500:
 *         description: Server error
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

		const { id } = await params;
		await connectDB();

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid career application ID" },
				{ status: 400 }
			);
		}

		const body = await request.json();

		const career = await Career.findByIdAndUpdate(
			id,
			{ isRead: body.isRead !== undefined ? body.isRead : true },
			{ new: true }
		)
			.select("-__v")
			.lean();

		if (!career) {
			return NextResponse.json(
				{ error: "Career application not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: career,
		});
	} catch (error) {
		console.error("Error updating career application:", error);
		return NextResponse.json(
			{
				error: "Failed to update career application",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * @swagger
 * /api/admin/careers/{id}:
 *   delete:
 *     summary: Delete a career application (admin)
 *     tags: [Admin Careers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Career application deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Career application not found
 *       500:
 *         description: Server error
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

		const { id } = await params;
		await connectDB();

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid career application ID" },
				{ status: 400 }
			);
		}

		const career = await Career.findByIdAndDelete(id);

		if (!career) {
			return NextResponse.json(
				{ error: "Career application not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Career application deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting career application:", error);
		return NextResponse.json(
			{
				error: "Failed to delete career application",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
