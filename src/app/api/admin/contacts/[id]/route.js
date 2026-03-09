import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Contact from "@/models/Contact";
import { authenticateAdmin } from "@/middleware/auth";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/admin/contacts/{id}:
 *   get:
 *     summary: Get a single contact by ID (admin)
 *     tags: [Admin Contacts]
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
 *         description: Contact not found
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
				{ error: "Invalid contact ID" },
				{ status: 400 }
			);
		}

		const contact = await Contact.findById(id).select("-__v").lean();

		if (!contact) {
			return NextResponse.json(
				{ error: "Contact not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: contact,
		});
	} catch (error) {
		console.error("Error fetching contact:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch contact",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * @swagger
 * /api/admin/contacts/{id}:
 *   put:
 *     summary: Update contact read status (admin)
 *     tags: [Admin Contacts]
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
 *         description: Contact updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
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
				{ error: "Invalid contact ID" },
				{ status: 400 }
			);
		}

		const body = await request.json();

		const contact = await Contact.findByIdAndUpdate(
			id,
			{ isRead: body.isRead !== undefined ? body.isRead : true },
			{ new: true }
		)
			.select("-__v")
			.lean();

		if (!contact) {
			return NextResponse.json(
				{ error: "Contact not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: contact,
		});
	} catch (error) {
		console.error("Error updating contact:", error);
		return NextResponse.json(
			{
				error: "Failed to update contact",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * @swagger
 * /api/admin/contacts/{id}:
 *   delete:
 *     summary: Delete a contact (admin)
 *     tags: [Admin Contacts]
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
 *         description: Contact deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
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
				{ error: "Invalid contact ID" },
				{ status: 400 }
			);
		}

		const contact = await Contact.findByIdAndDelete(id);

		if (!contact) {
			return NextResponse.json(
				{ error: "Contact not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Contact deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting contact:", error);
		return NextResponse.json(
			{
				error: "Failed to delete contact",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
