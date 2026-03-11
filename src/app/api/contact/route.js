import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Contact from "@/models/Contact";

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact form
 *     description: Public endpoint to submit a contact form message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               subject:
 *                 type: string
 *                 example: "Project Inquiry"
 *               message:
 *                 type: string
 *                 example: "I would like to discuss a project..."
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
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

		const body = await request.json();
		const { name, email, phone, subject, message, recaptchaToken } = body;

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

		if (!message || !message.trim()) {
			return NextResponse.json(
				{ error: "Message is required" },
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

		const newContact = await Contact.create({
			name: name.trim(),
			email: email.trim().toLowerCase(),
			phone: (phone || "").trim(),
			subject: (subject || "").trim(),
			message: message.trim(),
		});

		return NextResponse.json(
			{
				success: true,
				message: "Thank you! Your message has been sent successfully.",
				data: { id: newContact._id },
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error submitting contact form:", error);
		return NextResponse.json(
			{
				error: "Failed to send message. Please try again later.",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
