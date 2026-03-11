import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Service from "@/models/Service";
import Blog from "@/models/Blog";
import Contact from "@/models/Contact";
import Portfolio from "@/models/Portfolio";
import Career from "@/models/Career";
import Technology from "@/models/Technology";
import { authenticateAdmin } from "@/middleware/auth";

/**
 * Admin activities with pagination
 * GET /api/admin/activities
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

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const skip = (page - 1) * limit;

		// Fetch recent items from all collections
		const [recentContacts, recentCareers, recentServices, recentBlogs, recentPortfolios, recentTechnologies] = await Promise.all([
			Contact.find().sort({ createdAt: -1 }).select("name createdAt").lean(),
			Career.find().sort({ createdAt: -1 }).select("name designation createdAt").lean(),
			Service.find().sort({ updatedAt: -1 }).select("name updatedAt").lean(),
			Blog.find().sort({ updatedAt: -1 }).select("title updatedAt").lean(),
			Portfolio.find().sort({ updatedAt: -1 }).select("title updatedAt").lean(),
			Technology.find().sort({ updatedAt: -1 }).select("name updatedAt").lean(),
		]);

		// Format all activities
		const allActivities = [];

		recentServices.forEach((service) => {
			allActivities.push({
				type: "service",
				icon: "fa-light fa-plus",
				text: `Service ${service.name} ${service.updatedAt > new Date(Date.now() - 24 * 60 * 60 * 1000) ? "added" : "updated"}`,
				time: formatTimeAgo(service.updatedAt),
				timeValue: new Date(service.updatedAt).getTime(),
				link: `/admin/services`,
			});
		});

		recentBlogs.forEach((blog) => {
			allActivities.push({
				type: "blog",
				icon: "fa-light fa-edit",
				text: `Blog post ${blog.title} ${blog.updatedAt > new Date(Date.now() - 24 * 60 * 60 * 1000) ? "added" : "updated"}`,
				time: formatTimeAgo(blog.updatedAt),
				timeValue: new Date(blog.updatedAt).getTime(),
				link: `/admin/blogs`,
			});
		});

		recentPortfolios.forEach((portfolio) => {
			allActivities.push({
				type: "portfolio",
				icon: "fa-light fa-folder-open",
				text: `Portfolio ${portfolio.title} ${portfolio.updatedAt > new Date(Date.now() - 24 * 60 * 60 * 1000) ? "added" : "updated"}`,
				time: formatTimeAgo(portfolio.updatedAt),
				timeValue: new Date(portfolio.updatedAt).getTime(),
				link: `/admin/portfolio`,
			});
		});

		recentTechnologies.forEach((technology) => {
			allActivities.push({
				type: "technology",
				icon: "fa-light fa-code",
				text: `Technology ${technology.name} ${technology.updatedAt > new Date(Date.now() - 24 * 60 * 60 * 1000) ? "added" : "updated"}`,
				time: formatTimeAgo(technology.updatedAt),
				timeValue: new Date(technology.updatedAt).getTime(),
				link: `/admin/technology`,
			});
		});

		recentContacts.forEach((contact) => {
			allActivities.push({
				type: "contact",
				icon: "fa-light fa-envelope",
				text: `New contact form submission from ${contact.name}`,
				time: formatTimeAgo(contact.createdAt),
				timeValue: new Date(contact.createdAt).getTime(),
				link: `/admin/contacts`,
			});
		});

		recentCareers.forEach((career) => {
			allActivities.push({
				type: "career",
				icon: "fa-light fa-briefcase",
				text: `${career.name} applied for ${career.designation}`,
				time: formatTimeAgo(career.createdAt),
				timeValue: new Date(career.createdAt).getTime(),
				link: `/admin/careers`,
			});
		});

		// Sort all activities by time (most recent first)
		allActivities.sort((a, b) => b.timeValue - a.timeValue);

		// Calculate pagination
		const totalCount = allActivities.length;
		const totalPages = Math.ceil(totalCount / limit);
		const paginatedActivities = allActivities.slice(skip, skip + limit);

		return NextResponse.json({
			success: true,
			data: paginatedActivities,
			pagination: {
				currentPage: page,
				limit,
				totalCount,
				totalPages,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
			},
		});
	} catch (error) {
		console.error("Error fetching activities:", error);
		return NextResponse.json(
			{ error: "Failed to fetch activities", details: error.message },
			{ status: 500 }
		);
	}
}

// Helper function to format time ago
function formatTimeAgo(date) {
	if (!date) return "Unknown";
	const now = new Date();
	const diffMs = now - new Date(date);
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return "Just now";
	if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
	if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
	if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
	return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
