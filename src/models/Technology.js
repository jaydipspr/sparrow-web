import mongoose from "mongoose";

const TechnologySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Technology name is required"],
			trim: true,
		},
		category: {
			type: String,
			required: [true, "Category is required"],
			trim: true,
		},
		title: {
			type: String,
			default: "",
			trim: true,
		},
		// Main image displayed above title on technology detail page
		img: {
			type: String,
			required: [true, "Technology image is required"],
			trim: true,
		},
		description: {
			type: String,
			default: "",
		},
		features: {
			type: [String],
			default: [],
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
TechnologySchema.index({ isActive: 1, category: 1, createdAt: -1 });

// Use existing model if available, otherwise create new one
// This ensures we use the latest schema without breaking existing connections
const Technology = mongoose.models.Technology || mongoose.model("Technology", TechnologySchema);

export default Technology;
