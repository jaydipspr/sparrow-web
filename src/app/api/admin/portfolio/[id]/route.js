import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Portfolio from "@/models/Portfolio";
import { authenticateAdmin } from "@/middleware/auth";
import mongoose from "mongoose";
import { generateUniqueSlug } from "@/lib/utils/slug";

/**
 * @swagger
 * /api/admin/portfolio/{id}:
 *   get:
 *     summary: Get a single portfolio by ID (admin)
 *     description: Retrieve a specific portfolio by their MongoDB ID (admin only)
 *     tags: [Admin Portfolio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the portfolio
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
 *                   $ref: '#/components/schemas/Portfolio'
 *       400:
 *         description: Invalid ID format
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
 *         description: Portfolio not found
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

		let portfolio = null;

		// Try as MongoDB ObjectId first
		if (mongoose.Types.ObjectId.isValid(id)) {
			portfolio = await Portfolio.findById(id).select("-__v").lean();
		}

		// If not found by ID, try as slug
		if (!portfolio) {
			portfolio = await Portfolio.findOne({ slug: id }).select("-__v").lean();
		}

		if (!portfolio) {
			return NextResponse.json(
				{ error: "Portfolio not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: portfolio,
		});
	} catch (error) {
		console.error("Error fetching portfolio:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch portfolio",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * @swagger
 * /api/admin/portfolio/{id}:
 *   put:
 *     summary: Update a portfolio by ID (admin)
 *     description: Update an existing portfolio's details (admin only)
 *     tags: [Admin Portfolio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the portfolio to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "E-commerce Platform v2"
 *               title:
 *                 type: string
 *                 example: "Modern E-commerce Solution"
 *               img:
 *                 type: string
 *                 example: "/images/portfolio/portfolio-1.webp"
 *               description:
 *                 type: string
 *                 example: "A comprehensive e-commerce platform..."
 *               category:
 *                 type: string
 *                 example: "Web Development"
 *               keyHighlights:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Responsive Design", "Payment Integration"]
 *               technology:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "Node.js", "MongoDB"]
 *               projectLink:
 *                 type: string
 *                 example: "https://example.com"
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       200:
 *         description: Portfolio updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Portfolio'
 *       400:
 *         description: Invalid input or ID format
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
 *         description: Portfolio not found
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
				{ error: "Invalid portfolio ID format" },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const { name, title, img, description, category, keyHighlights, technology, projectLink, isActive } = body;

		// Validate description if provided
		if (description !== undefined) {
			if (!description || description.trim() === "") {
				return NextResponse.json(
					{ error: "Portfolio description is required" },
					{ status: 400 }
				);
			}
		}

		const updateData = {};
		if (name !== undefined) {
			updateData.name = name.trim();
			// Regenerate slug when name changes
			updateData.slug = await generateUniqueSlug(Portfolio, name.trim(), id);
		}
		if (title !== undefined) updateData.title = title.trim();
		if (img !== undefined) updateData.img = img.trim();
		if (description !== undefined) updateData.description = description.trim();
		if (category !== undefined) updateData.category = category;
		if (keyHighlights !== undefined) updateData.keyHighlights = Array.isArray(keyHighlights) ? keyHighlights : [];
		if (technology !== undefined) updateData.technology = Array.isArray(technology) ? technology : [];
		if (projectLink !== undefined) updateData.projectLink = projectLink;
		if (isActive !== undefined) updateData.isActive = isActive;

		const updatedPortfolio = await Portfolio.findByIdAndUpdate(
			id,
			updateData,
			{ new: true, runValidators: true }
		).select("-__v").lean();

		if (!updatedPortfolio) {
			return NextResponse.json(
				{ error: "Portfolio not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: updatedPortfolio,
		});
	} catch (error) {
		console.error("Error updating portfolio:", error);
		
		if (error.code === 11000) {
			return NextResponse.json(
				{ error: "Portfolio with this name already exists" },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				error: "Failed to update portfolio",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

/**
 * @swagger
 * /api/admin/portfolio/{id}:
 *   delete:
 *     summary: Delete a portfolio by ID (admin)
 *     description: Remove a specific portfolio from the database (admin only)
 *     tags: [Admin Portfolio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the portfolio to delete
 *     responses:
 *       200:
 *         description: Portfolio deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Portfolio deleted successfully"
 *       400:
 *         description: Invalid ID format
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
 *         description: Portfolio not found
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
				{ error: "Invalid portfolio ID format" },
				{ status: 400 }
			);
		}

		const deletedPortfolio = await Portfolio.findByIdAndDelete(id);

		if (!deletedPortfolio) {
			return NextResponse.json(
				{ error: "Portfolio not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Portfolio deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting portfolio:", error);
		return NextResponse.json(
			{
				error: "Failed to delete portfolio",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
