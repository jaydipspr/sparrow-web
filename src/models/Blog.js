import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Blog title is required"],
			trim: true,
		},
		slug: {
			type: String,
			trim: true,
			lowercase: true,
		},
		img: {
			type: String,
			required: [true, "Blog image is required"],
			trim: true,
		},
		author: {
			type: String,
			required: [true, "Author name is required"],
			trim: true,
		},
		category: {
			type: String,
			required: [true, "Category is required"],
			trim: true,
		},
		content: {
			type: [String],
			default: [],
		},
		thought: {
			type: String,
			default: "",
		},
		thoughtAuthor: {
			type: String,
			default: "",
			trim: true,
		},
		keyLessons: {
			type: [String],
			default: [],
		},
		conclusion: {
			type: String,
			default: "",
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

BlogSchema.index({ isActive: 1, createdAt: -1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ slug: 1 }, { unique: true, sparse: true });

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
