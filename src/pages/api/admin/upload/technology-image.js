import fs from "fs";
import path from "path";
import multer from "multer";
import { verifyToken } from "@/middleware/auth";

export const config = {
	api: {
		bodyParser: false, // required for multer
	},
};

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "technology");

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		try {
			fs.mkdirSync(UPLOAD_DIR, { recursive: true });
			cb(null, UPLOAD_DIR);
		} catch (err) {
			cb(err);
		}
	},
	filename: (_req, file, cb) => {
		const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
		const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
		const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${unique}${safeExt}`);
	},
});

const fileFilter = (_req, file, cb) => {
	// Basic mime check
	if (file?.mimetype?.startsWith("image/")) {
		return cb(null, true);
	}
	return cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
}).single("file");

function runMulter(req, res) {
	return new Promise((resolve, reject) => {
		upload(req, res, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}

export default async function handler(req, res) {
	try {
		if (req.method !== "POST") {
			return res.status(405).json({ success: false, error: "Method not allowed" });
		}

		// Admin auth (Bearer token from axios interceptor)
		const authHeader = req.headers.authorization || req.headers.Authorization;
		const admin = await verifyToken(authHeader);
		if (!admin) {
			return res
				.status(401)
				.json({ success: false, error: "Unauthorized. Admin authentication required." });
		}

		await runMulter(req, res);

		if (!req.file?.filename) {
			return res.status(400).json({ success: false, error: "No file uploaded" });
		}

		const url = `/uploads/technology/${req.file.filename}`;
		return res.status(200).json({
			success: true,
			url,
			filename: req.file.filename,
			size: req.file.size,
			mimetype: req.file.mimetype,
		});
	} catch (error) {
		// Multer file size error
		if (error?.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({
				success: false,
				error: "File too large. Max size is 5MB.",
			});
		}

		console.error("Technology image upload error:", error);
		return res.status(500).json({
			success: false,
			error: error?.message || "Failed to upload image",
		});
	}
}
