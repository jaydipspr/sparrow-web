import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Service name is required"],
			trim: true,
		},
		slug: {
			type: String,
			trim: true,
			lowercase: true,
		},
		title: {
			type: String,
			default: "",
			trim: true,
		},
		// Main image displayed above title on service detail page
		img: {
			type: String,
			required: [true, "Service image is required"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Service description is required"],
			trim: true,
		},
		points: {
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
ServiceSchema.index({ isActive: 1, createdAt: -1 });
ServiceSchema.index({ slug: 1 }, { unique: true, sparse: true });

// Use existing model if available, otherwise create new one
// This ensures we use the latest schema without breaking existing connections
const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default Service;
