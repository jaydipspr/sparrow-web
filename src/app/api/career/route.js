import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Career from "@/models/Career";
import fs from "fs";
import path from "path";

/**
 * @swagger
 * /api/career:
 *   post:
 *     summary: Submit a career application
 *     description: Allows users to submit career applications through a form.
 *     tags: [Career]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - designation
 *               - experience
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               address:
 *                 type: string
 *                 example: "123 Main St, City"
 *               designation:
 *                 type: string
 *                 example: "React JS Developer"
 *               experience:
 *                 type: string
 *                 example: "2-3 Year"
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Application submitted successfully!"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Verify reCAPTCHA token with Google
async function verifyRecaptcha(token) {
	if (!token) {
		return false;
	}

	const secretKey = process.env.RECAPTCHA_SECRET_KEY;
	if (!secretKey) {
		console.warn("reCAPTCHA secret key is not configured. Skipping verification.");
		return true; // Allow in development if key is not set
	}

	try {
		const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `secret=${secretKey}&response=${token}`,
		});

		const data = await response.json();
		return data.success === true;
	} catch (error) {
		console.error("Error verifying reCAPTCHA:", error);
		return false;
	}
}

export async function POST(request) {
	try {
		await connectDB();

		const formData = await request.formData();
		const name = formData.get("name");
		const email = formData.get("email");
		const phone = formData.get("phone") || "";
		const address = formData.get("address") || "";
		const designation = formData.get("designation");
		const experience = formData.get("experience");
		const resumeFile = formData.get("resume");
		const recaptchaToken = formData.get("recaptchaToken");

		// Validation
		if (!name || !name.trim()) {
			return NextResponse.json(
				{ error: "Name is required" },
				{ status: 400 }
			);
		}

		if (!email || !email.trim()) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 }
			);
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email.trim())) {
			return NextResponse.json(
				{ error: "Please provide a valid email address" },
				{ status: 400 }
			);
		}

		if (!designation || !designation.trim()) {
			return NextResponse.json(
				{ error: "Designation is required" },
				{ status: 400 }
			);
		}

		if (!experience || !experience.trim()) {
			return NextResponse.json(
				{ error: "Experience is required" },
				{ status: 400 }
			);
		}

		// Validate resume is required
		if (!resumeFile || !(resumeFile instanceof File)) {
			return NextResponse.json(
				{ error: "Please upload your resume to submit application." },
				{ status: 400 }
			);
		}

		// Verify reCAPTCHA
		const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
		if (!isRecaptchaValid) {
			return NextResponse.json(
				{ error: "reCAPTCHA verification failed. Please try again." },
				{ status: 400 }
			);
		}

		// Handle resume file
		let resumePath = "";
		if (resumeFile && resumeFile instanceof File) {
			try {
				// Create uploads directory if it doesn't exist
				const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
				if (!fs.existsSync(uploadDir)) {
					fs.mkdirSync(uploadDir, { recursive: true });
				}

				// Generate unique filename
				const fileExt = path.extname(resumeFile.name) || ".pdf";
				const uniqueFilename = `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
				const filePath = path.join(uploadDir, uniqueFilename);

				// Convert File to Buffer and save
				const bytes = await resumeFile.arrayBuffer();
				const buffer = Buffer.from(bytes);
				fs.writeFileSync(filePath, buffer);

				// Store the path relative to public directory
				resumePath = `/uploads/resumes/${uniqueFilename}`;
			} catch (fileError) {
				console.error("Error saving resume file:", fileError);
				return NextResponse.json(
					{ error: "Failed to upload resume file. Please try again." },
					{ status: 500 }
				);
			}
		}

		const newCareer = await Career.create({
			name: name.trim(),
			email: email.trim().toLowerCase(),
			phone: phone.trim(),
			address: address.trim(),
			designation: designation.trim(),
			experience: experience.trim(),
			resume: resumePath,
		});

		return NextResponse.json(
			{
				success: true,
				message: "Application submitted successfully! Our team will contact you shortly.",
				data: { id: newCareer._id },
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error submitting career application:", error);
		return NextResponse.json(
			{
				error: "Failed to submit application. Please try again later.",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
