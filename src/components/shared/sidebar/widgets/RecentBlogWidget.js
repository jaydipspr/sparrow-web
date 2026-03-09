"use client";
import { useBlogs } from "@/hooks/useBlogs";
import sliceText from "@/libs/sliceText";
import Image from "next/image";
import Link from "next/link";

const RecentBlogWidget = () => {
	const { blogs, loading } = useBlogs();
	const recentBlogs = blogs?.slice(0, 3) || [];

	if (loading) {
		return (
			<div className="tj-sidebar-widget tj-recent-posts">
				<h4 className="widget-title">Related post</h4>
				<p style={{ padding: "10px 0", opacity: 0.6 }}>Loading...</p>
			</div>
		);
	}

	if (recentBlogs.length === 0) {
		return null;
	}

	return (
		<div className="tj-sidebar-widget tj-recent-posts">
			<h4 className="widget-title">Related post</h4>
			<ul>
				{recentBlogs.map((blog, idx) => {
					const blogLink = blog.slug || blog._id || blog.id;
					const displayImg = blog.img || blog.smallImg || "/images/blog/post-1.webp";
					const displayDate = blog.createdAt
						? new Date(blog.createdAt).toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
						  })
						: blog.date || "";

					return (
						<li key={idx}>
							<div className="post-thumb">
								<Link href={`/blogs/${blogLink}`}>
									{" "}
									<Image
										src={displayImg}
										alt={blog.title || "Blog"}
										width={150}
										height={150}
										style={{ objectFit: "cover" }}
									/>
								</Link>
							</div>
							<div className="post-content">
								<h6 className="post-title">
									<Link href={`/blogs/${blogLink}`}>
										{sliceText(blog.title, 32, true)}
									</Link>
								</h6>
								<div className="blog-meta">
									<ul>
										<li>{displayDate}</li>
									</ul>
								</div>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default RecentBlogWidget;
