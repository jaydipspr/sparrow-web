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
			required: [true, "Blog content paragraphs are required"],
			validate: {
				validator: function (arr) {
					return Array.isArray(arr) && arr.length > 0 && arr.every((p) => typeof p === "string" && p.trim().length > 0);
				},
				message: "At least one content paragraph is required",
			},
			default: undefined,
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
		viewCount: {
			type: Number,
			default: 0,
			min: 0,
		},
		comments: {
			type: [
				{
					name: {
						type: String,
						required: [true, "Commenter name is required"],
						trim: true,
					},
					email: {
						type: String,
						required: [true, "Commenter email is required"],
						trim: true,
						lowercase: true,
					},
					website: {
						type: String,
						default: "",
						trim: true,
					},
					comment: {
						type: String,
						required: [true, "Comment text is required"],
						trim: true,
					},
					createdAt: {
						type: Date,
						default: Date.now,
					},
				},
			],
			default: [],
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

// In dev with HMR, refresh the model so schema changes (like viewCount) take effect without silent strict-mode drops.
if (process.env.NODE_ENV !== "production" && mongoose.models.Blog) {
	delete mongoose.models.Blog;
}
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
