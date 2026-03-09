import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
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
		},
		phone: {
			type: String,
			default: "",
			trim: true,
		},
		subject: {
			type: String,
			default: "",
			trim: true,
		},
		message: {
			type: String,
			required: [true, "Message is required"],
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

ContactSchema.index({ isRead: 1, createdAt: -1 });
ContactSchema.index({ createdAt: -1 });

const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export default Contact;
