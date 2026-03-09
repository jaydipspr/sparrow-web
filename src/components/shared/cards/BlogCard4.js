import makePath from "@/libs/makePath";
import makeWowDelay from "@/libs/makeWowDelay";
import Link from "next/link";
import ButtonPrimary from "../buttons/ButtonPrimary";

const BlogCard4 = ({ blog, idx }) => {
	const {
		title,
		desc,
		id,
		_id,
		slug,
		img = "/images/blog/blog-1.webp",
		category,
		author,
		date,
		day,
		month,
		content,
		createdAt,
	} = blog || {};

	const blogLink = slug || _id || id;
	const displayImg = img || "/images/blog/blog-1.webp";
	const displayAuthor = author || "Admin";

	// Format date from API
	let displayDay = day;
	let displayMonth = month;
	if (createdAt && !day) {
		const d = new Date(createdAt);
		displayDay = d.getDate();
		const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
		displayMonth = months[d.getMonth()];
	}

	return (
		<div
			className="blog-item style-3 wow fadeInUp"
			data-wow-delay={makeWowDelay(idx, 0.2)}
		>
			<div className="blog-thumb">
				<Link href={`/blogs/${blogLink}`}>
					<img src={displayImg} alt={title || "Blog"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
				</Link>
				{idx === 0 && displayDay && displayMonth ? (
					<div className="blog-date">
						<span className="date">{String(displayDay).padStart(2, "0")}</span>
						<span className="month">{displayMonth}</span>
					</div>
				) : (
					""
				)}
			</div>
			<div className="blog-content">
				<div className="blog-meta">
					{category && (
						<span className="categories">
							<Link href={`/blogs`}>
								{category}
							</Link>
						</span>
					)}
					<span>
						By <Link href={`/blogs/${blogLink}`}>{displayAuthor}</Link>
					</span>
				</div>
				<h4 className="title">
					<Link href={`/blogs/${blogLink}`}>{title}</Link>
				</h4>
				<ButtonPrimary
					text={"Read More"}
					url={`/blogs/${blogLink}`}
					isTextBtn={true}
				/>
			</div>
		</div>
	);
};

export default BlogCard4;
