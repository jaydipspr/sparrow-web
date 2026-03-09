"use client";
import { useBlogs } from "@/hooks/useBlogs";
import Link from "next/link";

const BlogCategoriesWidget = () => {
	const { blogs, loading } = useBlogs();

	// Extract unique categories with counts from API data
	const categoryCounts = {};
	if (blogs && blogs.length > 0) {
		blogs.forEach((blog) => {
			if (blog.category) {
				categoryCounts[blog.category] = (categoryCounts[blog.category] || 0) + 1;
			}
		});
	}

	const categories = Object.keys(categoryCounts);

	if (loading) {
		return (
			<div className="tj-sidebar-widget widget-categories">
				<h4 className="widget-title">Categories</h4>
				<p style={{ padding: "10px 0", opacity: 0.6 }}>Loading...</p>
			</div>
		);
	}

	if (categories.length === 0) {
		return null;
	}

	return (
		<div className="tj-sidebar-widget widget-categories">
			<h4 className="widget-title">Categories</h4>
			<ul>
				{categories.map((category, idx) => (
					<li key={idx}>
						<Link href={`/blogs`}>
							{category}{" "}
							<span className="number">
								({String(categoryCounts[category]).padStart(2, "0")})
							</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default BlogCategoriesWidget;
