import BlogDetailsPrimary from "@/components/sections/blogs/BlogDetailsPrimary";
import HeroInner from "@/components/sections/hero/HeroInner";
import { getAllBlogsFromAPI } from "@/libs/getAllBlogs";

const BlogDetailsMain = async ({ blog }) => {
	// Fetch all blogs for navigation
	const items = await getAllBlogsFromAPI();

	// Serialize blog to plain object
	const currentItem = {
		_id: blog._id?.toString() || blog._id,
		id: blog._id?.toString() || blog.id,
		title: blog.title,
		slug: blog.slug,
		img: blog.img,
		author: blog.author,
		category: blog.category,
		content: Array.isArray(blog.content) ? [...blog.content] : [],
		thought: blog.thought,
		thoughtAuthor: blog.thoughtAuthor,
		keyLessons: Array.isArray(blog.keyLessons) ? [...blog.keyLessons] : [],
		conclusion: blog.conclusion,
		isActive: Boolean(blog.isActive),
		createdAt: blog.createdAt ? new Date(blog.createdAt).toISOString() : null,
		updatedAt: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : null,
	};

	// Find current blog index for prev/next navigation
	const currentBlogIdentifier = currentItem.slug || currentItem.id;
	const currentIndex = items.findIndex((item) =>
		(item.slug === currentBlogIdentifier || item.id === currentBlogIdentifier)
	);

	const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
	const nextItem = currentIndex < items.length - 1 && currentIndex >= 0 ? items[currentIndex + 1] : null;

	const prevId = prevItem?.slug || prevItem?.id;
	const nextId = nextItem?.slug || nextItem?.id;
	const isPrevItem = !!prevItem;
	const isNextItem = !!nextItem;

	const displayTitle = currentItem.title || "Blog Details";

	return (
		<div>
			<HeroInner
				title={"Blog Details"}
				text={displayTitle}
				breadcrums={[{ name: "Blogs", path: "/blogs" }]}
			/>
			<BlogDetailsPrimary
				option={{
					currentItem,
					items,
					currentId: currentBlogIdentifier,
					prevId,
					nextId,
					isPrevItem,
					isNextItem,
				}}
			/>
		</div>
	);
};

export default BlogDetailsMain;
