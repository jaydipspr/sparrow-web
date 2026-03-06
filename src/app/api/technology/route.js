import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Technology from "@/models/Technology";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/technology:
 *   get:
 *     summary: Get all active technologies or a single technology
 *     description: Retrieve all active technologies or a single technology by ID or category (public endpoint)
 *     tags: [Public Technology]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Technology ID (MongoDB ObjectId)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Web Development, Application Development, Backend & Database]
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
 *                     - $ref: '#/components/schemas/Technology'
 *                     - type: array
 *                       items:
 *                         $ref: '#/components/schemas/Technology'
 *                 count:
 *                   type: integer
 *                   description: Total count (only for list response)
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
export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		const category = searchParams.get("category");

		// Get single technology by id
		if (id) {
			let technology = null;
			
			// Check if id is a valid MongoDB ObjectId
			if (mongoose.Types.ObjectId.isValid(id)) {
				technology = await Technology.findOne({
					_id: new mongoose.Types.ObjectId(id),
					isActive: true,
				}).select("-__v").lean();
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
		}

		// Build query for filtering
		const query = { isActive: true };
		if (category) {
			query.category = category;
		}

		// Get all active technologies
		const technologies = await Technology.find(query)
			.sort({ createdAt: -1 })
			.select("-__v")
			.lean();

		return NextResponse.json({
			success: true,
			data: technologies,
			count: technologies.length,
		});
	} catch (error) {
		console.error("Error fetching technologies:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch technologies",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
