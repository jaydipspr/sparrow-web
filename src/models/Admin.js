import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongodb";

// Connect to database if not already connected
if (mongoose.connection.readyState === 0) {
	connectDB();
}

const AdminSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters"],
			select: false, // Don't return password by default
		},
	},
	{
		timestamps: true,
	}
);

// Hash password before saving
AdminSchema.pre("save", async function () {
	// Only hash the password if it has been modified (or is new)
	if (!this.isModified("password")) {
		return;
	}

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	} catch (error) {
		throw error;
	}
});

// Method to compare password
AdminSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Prevent model re-compilation during hot reload in development
const Admin =
	mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export default Admin;
