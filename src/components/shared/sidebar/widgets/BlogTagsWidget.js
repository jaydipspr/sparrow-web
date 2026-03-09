"use client";
import { useBlogs } from "@/hooks/useBlogs";
import Link from "next/link";

const BlogTagsWidget = () => {
	const { blogs, loading } = useBlogs();

	// Extract unique categories as tags from API data
	const tags = [];
	if (blogs && blogs.length > 0) {
		blogs.forEach((blog) => {
			if (blog.category && !tags.includes(blog.category)) {
				tags.push(blog.category);
			}
		});
	}

	if (loading) {
		return (
			<div className="tj-sidebar-widget widget-tag-cloud">
				<h4 className="widget-title">Tags</h4>
				<p style={{ padding: "10px 0", opacity: 0.6 }}>Loading...</p>
			</div>
		);
	}

	if (tags.length === 0) {
		return null;
	}

	return (
		<div className="tj-sidebar-widget widget-tag-cloud">
			<h4 className="widget-title">Tags</h4>
			<nav>
				<div className="tagcloud">
					{tags.map((tag, idx) => (
						<Link key={idx} href={`/blogs`}>
							{" "}
							{tag}
						</Link>
					))}
				</div>
			</nav>
		</div>
	);
};

export default BlogTagsWidget;
