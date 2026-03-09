import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Team from "@/models/Team";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/team:
 *   get:
 *     summary: Get all active team members or a single team member
 *     description: Retrieve all active team members or a single team member by ID (public endpoint)
 *     tags: [Public Team]
 *     parameters:
 *       - in: query
 *         name: id
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
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Team'
 *                     - type: array
 *                       items:
 *                         $ref: '#/components/schemas/Team'
 *                 count:
 *                   type: integer
 *                   description: Total count (only for list response)
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
export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		// Get single team member by id
		if (id) {
			let team = null;

			// Check if id is a valid MongoDB ObjectId
			if (mongoose.Types.ObjectId.isValid(id)) {
				team = await Team.findOne({
					_id: new mongoose.Types.ObjectId(id),
					isActive: true,
				}).select("-__v").lean();
			}

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
		}

		// Get all active team members
		const teams = await Team.find({ isActive: true })
			.sort({ createdAt: -1 })
			.select("-__v")
			.lean();

		return NextResponse.json({
			success: true,
			data: teams,
			count: teams.length,
		});
	} catch (error) {
		console.error("Error fetching team members:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch team members",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
