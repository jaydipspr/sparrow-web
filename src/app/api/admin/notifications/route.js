import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Contact from "@/models/Contact";
import Career from "@/models/Career";
import { authenticateAdmin } from "@/middleware/auth";

/**
 * Admin notifications (unread counts)
 * GET /api/admin/notifications
 */
export async function GET(request) {
	try {
		const admin = await authenticateAdmin(request);
		if (!admin) {
			return NextResponse.json(
				{ error: "Unauthorized. Admin authentication required." },
				{ status: 401 }
			);
		}

		await connectDB();

		// Get recent unread contacts (last 10)
		const unreadContacts = await Contact.find({ isRead: false })
			.sort({ createdAt: -1 })
			.limit(10)
			.select("name createdAt _id")
			.lean();

		// Get recent unread careers (last 10)
		const unreadCareers = await Career.find({ isRead: false })
			.sort({ createdAt: -1 })
			.limit(10)
			.select("name designation createdAt _id")
			.lean();

		// Get total counts
		const [totalUnreadContacts, totalUnreadCareers] = await Promise.all([
			Contact.countDocuments({ isRead: false }),
			Career.countDocuments({ isRead: false }),
		]);

		// Map and combine notifications
		const contacts = unreadContacts.map((contact) => ({
			id: contact._id.toString(),
			name: contact.name,
			createdAt: contact.createdAt,
			type: "contact",
		}));

		const careers = unreadCareers.map((career) => ({
			id: career._id.toString(),
			name: career.name,
			designation: career.designation,
			createdAt: career.createdAt,
			type: "career",
		}));

		// Combine and sort by date (most recent first)
		const allNotifications = [...contacts, ...careers].sort(
			(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
		);

		return NextResponse.json({
			success: true,
			data: {
				contacts,
				careers,
				all: allNotifications.slice(0, 10), // Show max 10 most recent
				totalUnread: totalUnreadContacts + totalUnreadCareers,
			},
		});
	} catch (error) {
		console.error("Error fetching admin notifications:", error);
		return NextResponse.json(
			{ error: "Failed to fetch notifications", details: error.message },
			{ status: 500 }
		);
	}
}

