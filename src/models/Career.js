import mongoose from "mongoose";

const CareerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			trim: true,
			lowercase: true,
			match: [/.+@.+\..+/, "Please fill a valid email address"],
		},
		phone: {
			type: String,
			trim: true,
			default: "",
		},
		address: {
			type: String,
			trim: true,
			default: "",
		},
		designation: {
			type: String,
			required: [true, "Designation is required"],
			trim: true,
		},
		experience: {
			type: String,
			required: [true, "Experience is required"],
			trim: true,
		},
		resume: {
			type: String,
			trim: true,
			default: "",
		},
		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		strict: true,
		strictQuery: true,
	}
);

CareerSchema.index({ isRead: 1, createdAt: -1 });

const Career = mongoose.models.Career || mongoose.model("Career", CareerSchema);

export default Career;
