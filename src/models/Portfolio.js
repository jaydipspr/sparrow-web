import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Portfolio name is required"],
			trim: true,
			unique: true,
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
		img: {
			type: String,
			required: [true, "Portfolio image is required"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Portfolio description is required"],
			trim: true,
		},
		category: {
			type: String,
			required: [true, "Category is required"],
			trim: true,
		},
		keyHighlights: {
			type: [String],
			default: [],
		},
		technology: {
			type: [
				{
					id: { type: String, required: true },
					name: { type: String, required: true },
					slug: { type: String, default: "" },
				},
			],
			default: [],
		},
		projectLink: {
			type: String,
			default: "",
			trim: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		strict: true,
		strictQuery: true,
	}
);

PortfolioSchema.index({ isActive: 1, createdAt: -1 });
PortfolioSchema.index({ category: 1 });
PortfolioSchema.index({ slug: 1 }, { unique: true, sparse: true });

const Portfolio = mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);

export default Portfolio;
