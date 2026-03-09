import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Portfolio from "@/models/Portfolio";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/portfolio:
 *   get:
 *     summary: Get all active portfolios or a single portfolio
 *     description: Retrieve all active portfolios or a single portfolio by ID (public endpoint)
 *     tags: [Public Portfolio]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Portfolio ID (MongoDB ObjectId)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
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
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Portfolio'
 *                     - type: array
 *                       items:
 *                         $ref: '#/components/schemas/Portfolio'
 *                 count:
 *                   type: integer
 *                   description: Total count (only for list response)
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
export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		const category = searchParams.get("category");

		// Get single portfolio by id
		if (id) {
			let portfolio = null;

			if (mongoose.Types.ObjectId.isValid(id)) {
				portfolio = await Portfolio.findOne({
					_id: new mongoose.Types.ObjectId(id),
					isActive: true,
				}).select("-__v").lean();
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
		}

		// Build query for all active portfolios
		const query = { isActive: true };
		if (category) {
			query.category = category;
		}

		// Get all active portfolios
		const portfolios = await Portfolio.find(query)
			.sort({ createdAt: -1 })
			.select("-__v")
			.lean();

		return NextResponse.json({
			success: true,
			data: portfolios,
			count: portfolios.length,
		});
	} catch (error) {
		console.error("Error fetching portfolios:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch portfolios",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
