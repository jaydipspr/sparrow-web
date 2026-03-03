import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}
async function connectDB() {
	// Check if already connected
	if (cached.conn) {
		return cached.conn;
	}
	// Check if connection is in progress
	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};
		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			console.log("Successfully connected to database!");
			return mongoose;
		}).catch((error) => {
			console.error("\n" + "=".repeat(60));
			console.error("Connection failed");
			console.error("Error:", error.message);
			console.error("=".repeat(60) + "\n");
			cached.promise = null;
			throw error;
		});
	}
	try {
		cached.conn = await cached.promise;
		// Set up connection event listeners
		mongoose.connection.on("connected", () => {
			console.log("Connection established");
		});
		mongoose.connection.on("error", (err) => {
			console.error("Connection error:", err.message);
		});
		mongoose.connection.on("disconnected", () => {
			console.log("Connection disconnected");
		});
		// Handle process termination
		process.on("SIGINT", async () => {
			await mongoose.connection.close();
			console.log("Connection closed due to app termination");
			process.exit(0);
		});
	} catch (e) {
		cached.promise = null;
		console.error("Failed to establish connection");
		throw e;
	}
	return cached.conn;
}

export default connectDB;
