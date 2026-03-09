import makePath from "@/libs/makePath";
import Image from "next/image";
import Link from "next/link";
import ButtonPrimary from "../buttons/ButtonPrimary";

const BlogCard1 = ({ blog, idx }) => {
	const {
		title,
		desc,
		id,
		_id,
		slug,
		img,
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
	const displayDesc = desc || (Array.isArray(content) && content.length > 0 ? content[0] : "");

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
		<div className="blog-item wow fadeInUp" data-wow-delay={`0.${idx + 1}s`}>
			<div className="blog-thumb">
				<Link href={`/blogs/${blogLink}`}>
					{" "}
					<Image
						src={displayImg}
						alt={title || "Blog"}
						width={870}
						height={450}
						style={{ width: "100%", height: "100%", objectFit: "cover" }}
					/>
				</Link>
				{displayDay && displayMonth && (
					<div className="blog-date">
						<span className="date">{String(displayDay).padStart(2, "0")}</span>
						<span className="month">{displayMonth}</span>
					</div>
				)}
			</div>
			<div className="blog-content">
				<div className="blog-meta">
					{category && (
						<span className="categories">
							<Link href={`/blogs`}>
								{" "}
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

export default BlogCard1;
