import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema(
	{
		page: {
			type: String,
			required: true,
			enum: ["technology", "portfolio", "services", "teams", "blogs", "career", "about", "contact"],
			index: true,
		},
		ipAddress: {
			type: String,
		},
		userAgent: {
			type: String,
		},
		referer: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

// Index for faster queries
pageViewSchema.index({ page: 1, createdAt: -1 });

const PageView = mongoose.models.PageView || mongoose.model("PageView", pageViewSchema);

export default PageView;
