import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Service name is required"],
			trim: true,
		},
		title: {
			type: String,
			default: "",
			trim: true,
		},
		slug: {
			type: String,
			unique: true,
			trim: true,
			lowercase: true,
		},
		// Main image displayed above title on service detail page
		img: {
			type: String,
			required: [true, "Service image is required"],
			trim: true,
		},
		description: {
			type: String,
			default: "",
		},
		points: {
			type: [String],
			default: [],
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		order: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
		strict: true, // Only save fields defined in schema
		strictQuery: true, // Only query fields defined in schema
	}
);

// Generate slug from name before saving
ServiceSchema.pre("save", async function () {
	// Only generate slug if name is set and slug is not already set
	if (this.name && !this.slug) {
		const baseSlug = this.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
		
		// Check if slug already exists and make it unique
		let slug = baseSlug;
		let counter = 1;
		const Service = this.constructor;
		
		// Only check for duplicates if this is a new document
		if (this.isNew) {
			while (await Service.findOne({ slug })) {
				slug = `${baseSlug}-${counter}`;
				counter++;
			}
		}
		
		this.slug = slug;
	}
});

// Index for faster queries
ServiceSchema.index({ slug: 1 });
ServiceSchema.index({ isActive: 1, order: 1 });

// Use existing model if available, otherwise create new one
// This ensures we use the latest schema without breaking existing connections
const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default Service;
