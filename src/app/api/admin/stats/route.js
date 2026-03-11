import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Service from "@/models/Service";
import Blog from "@/models/Blog";
import Contact from "@/models/Contact";
import Portfolio from "@/models/Portfolio";
import Career from "@/models/Career";
import Technology from "@/models/Technology";
import PageView from "@/models/PageView";
import { authenticateAdmin } from "@/middleware/auth";

/**
 * Admin dashboard stats
 * GET /api/admin/stats
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

		// Get last 6 months data
		const now = new Date();
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(now.getMonth() - 5);
		sixMonthsAgo.setDate(1);
		sixMonthsAgo.setHours(0, 0, 0, 0);

		// Generate month labels for last 6 months
		const monthLabels = [];
		const monthRanges = [];
		for (let i = 5; i >= 0; i--) {
			const date = new Date();
			date.setMonth(now.getMonth() - i);
			monthLabels.push(date.toLocaleDateString("en-US", { month: "short", year: "numeric" }));
			
			const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
			const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
			monthRanges.push({ start: startOfMonth, end: endOfMonth });
		}

		// Fetch counts and recent items in parallel
		const [
			totalServices,
			totalBlogs,
			totalContacts,
			totalPortfolio,
			totalCareers,
			totalTechnologies,
			unreadContacts,
			unreadCareers,
			recentContacts,
			recentCareers,
			recentServices,
			recentBlogs,
			allContacts,
			allCareers,
			pageViews,
		] = await Promise.all([
			Service.countDocuments(),
			Blog.countDocuments(),
			Contact.countDocuments(),
			Portfolio.countDocuments(),
			Career.countDocuments(),
			Technology.countDocuments(),
			Contact.countDocuments({ isRead: false }),
			Career.countDocuments({ isRead: false }),
			Contact.find().sort({ createdAt: -1 }).limit(5).select("name createdAt").lean(),
			Career.find().sort({ createdAt: -1 }).limit(5).select("name designation createdAt").lean(),
			Service.find().sort({ updatedAt: -1 }).limit(5).select("name updatedAt").lean(),
			Blog.find().sort({ updatedAt: -1 }).limit(5).select("title updatedAt").lean(),
			Contact.find({ createdAt: { $gte: sixMonthsAgo } }).select("createdAt").lean(),
			Career.find({ createdAt: { $gte: sixMonthsAgo } }).select("createdAt").lean(),
			PageView.aggregate([
				{
					$group: {
						_id: "$page",
						count: { $sum: 1 },
					},
				},
			]),
		]);

		// Calculate monthly counts
		const monthlyContacts = monthRanges.map((range) => {
			return allContacts.filter((contact) => {
				const contactDate = new Date(contact.createdAt);
				return contactDate >= range.start && contactDate <= range.end;
			}).length;
		});

		const monthlyCareers = monthRanges.map((range) => {
			return allCareers.filter((career) => {
				const careerDate = new Date(career.createdAt);
				return careerDate >= range.start && careerDate <= range.end;
			}).length;
		});

		// Format recent activities
		const recentActivities = [];

		recentServices.forEach((service) => {
			recentActivities.push({
				type: "service",
				icon: "fa-light fa-plus",
				text: `Service ${service.name} ${service.updatedAt > new Date(Date.now() - 24 * 60 * 60 * 1000) ? "added" : "updated"}`,
				time: formatTimeAgo(service.updatedAt),
				link: `/admin/services`,
			});
		});

		recentBlogs.forEach((blog) => {
			recentActivities.push({
				type: "blog",
				icon: "fa-light fa-edit",
				text: `Blog post ${blog.title} ${blog.updatedAt > new Date(Date.now() - 24 * 60 * 60 * 1000) ? "added" : "updated"}`,
				time: formatTimeAgo(blog.updatedAt),
				link: `/admin/blogs`,
			});
		});

		recentContacts.forEach((contact) => {
			recentActivities.push({
				type: "contact",
				icon: "fa-light fa-envelope",
				text: `New contact form submission from ${contact.name}`,
				time: formatTimeAgo(contact.createdAt),
				link: `/admin/contacts`,
			});
		});

		recentCareers.forEach((career) => {
			recentActivities.push({
				type: "career",
				icon: "fa-light fa-briefcase",
				text: `${career.name} applied for ${career.designation}`,
				time: formatTimeAgo(career.createdAt),
				link: `/admin/careers`,
			});
		});

		// Sort activities by time (most recent first)
		recentActivities.sort((a, b) => {
			const timeA = getTimeValue(a.time);
			const timeB = getTimeValue(b.time);
			return timeB - timeA;
		});

		// Format page views data
		const pageViewData = {
			technology: 0,
			portfolio: 0,
			services: 0,
			teams: 0,
			blogs: 0,
			career: 0,
			about: 0,
			contact: 0,
		};

		pageViews.forEach((pv) => {
			if (pageViewData.hasOwnProperty(pv._id)) {
				pageViewData[pv._id] = pv.count;
			}
		});

		return NextResponse.json({
			success: true,
			data: {
				stats: {
					totalServices,
					totalBlogs,
					totalContacts,
					totalPortfolio,
					totalCareers,
					totalTechnologies,
					unreadContacts,
					unreadCareers,
				},
				monthlyData: {
					labels: monthLabels,
					contacts: monthlyContacts,
					careers: monthlyCareers,
				},
				pageViews: pageViewData,
				recentActivities: recentActivities.slice(0, 10), // Limit to 10 most recent for dashboard
			},
		});
	} catch (error) {
		console.error("Error fetching dashboard stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch dashboard stats", details: error.message },
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

// Helper function to get time value for sorting
function getTimeValue(timeStr) {
	if (!timeStr) return 0;
	if (timeStr === "Just now") return Date.now();
	if (timeStr.includes("minute")) return Date.now() - parseInt(timeStr) * 60000;
	if (timeStr.includes("hour")) return Date.now() - parseInt(timeStr) * 3600000;
	if (timeStr.includes("day")) return Date.now() - parseInt(timeStr) * 86400000;
	return new Date(timeStr).getTime();
}
