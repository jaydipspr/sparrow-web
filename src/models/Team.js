import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Team member name is required"],
			trim: true,
		},
		img: {
			type: String,
			required: [true, "Team member image is required"],
			trim: true,
		},
		position: {
			type: String,
			required: [true, "Team member position is required"],
			trim: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		strict: true, // Only save fields defined in schema
		strictQuery: true, // Only query fields defined in schema
	}
);

// Index for faster queries
TeamSchema.index({ isActive: 1, createdAt: -1 });

// Use existing model if available, otherwise create new one
// This ensures we use the latest schema without breaking existing connections
const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);

export default Team;
