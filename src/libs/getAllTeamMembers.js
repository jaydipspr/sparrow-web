import "server-only";
import connectDB from "@/lib/db/mongodb";
import Team from "@/models/Team";
import mongoose from "mongoose";

/**
 * Serialize MongoDB document to plain object for client components
 * Converts ObjectIds and other MongoDB types to plain JavaScript values
 */
function serializeTeamMember(teamMember) {
	if (!teamMember) return null;

	return {
		_id: teamMember._id?.toString() || teamMember._id,
		id: teamMember._id?.toString() || teamMember.id,
		name: teamMember.name,
		position: teamMember.position,
		img: teamMember.img,
		isActive: Boolean(teamMember.isActive),
		createdAt: teamMember.createdAt ? new Date(teamMember.createdAt).toISOString() : null,
		updatedAt: teamMember.updatedAt ? new Date(teamMember.updatedAt).toISOString() : null,
	};
}

/**
 * Fetch all team members directly from database (for server components)
 * This is more efficient than making HTTP requests
 * @returns {Promise<Array>} Array of team members
 */
export async function getAllTeamMembersFromAPI() {
	try {
		await connectDB();

		const teamMembers = await Team.find({ isActive: true })
			.sort({ createdAt: -1 })
			.select("-__v")
			.lean();

		// Serialize team members to plain objects for client components
		return teamMembers.map(serializeTeamMember);
	} catch (error) {
		console.error("Error fetching team members from database:", error);
		return [];
	}
}

/**
 * Fetch a single team member by ID directly from database (for server components)
 * @param {string} id - Team member ID
 * @returns {Promise<Object|null>} Team member object or null
 */
export async function getTeamMemberById(id) {
	if (!id) {
		return null;
	}

	try {
		await connectDB();

		let teamMember = null;
		const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

		// Try as MongoDB ObjectId
		if (isValidObjectId) {
			teamMember = await Team.findOne({
				_id: new mongoose.Types.ObjectId(id),
				isActive: true,
			})
				.select("-__v")
				.lean();
		}

		if (teamMember) {
			// Serialize team member to plain object for client components
			return serializeTeamMember(teamMember);
		}

		return null;
	} catch (error) {
		console.error("Error fetching team member from database:", error);
		return null;
	}
}
