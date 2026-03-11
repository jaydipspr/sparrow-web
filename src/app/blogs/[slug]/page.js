import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import BlogDetailsMain from "@/components/layout/main/BlogDetailsMain";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import BlogViewTracker from "@/components/shared/BlogViewTracker";
import { getAllBlogsFromAPI, getBlogBySlug } from "@/libs/getAllBlogs";
import { notFound } from "next/navigation";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const blog = await getBlogBySlug(slug);

	if (!blog || !blog.title) {
		return {
			title: "Blog - Sparrow Softtech | Innovation Unlimited",
			description: "Read our latest blog posts about technology trends and industry insights.",
		};
	}

	return {
		title: `${blog.title} - Blog | Sparrow Softtech | Innovation Unlimited`,
		description: blog.content?.[0] || `Read about ${blog.title} on Sparrow Softtech blog.`,
	};
}

export default async function BlogDetails({ params }) {
	const { slug } = await params;

	// Fetch blog from API by slug
	const blog = await getBlogBySlug(slug);

	if (!blog) {
		notFound();
	}

	return (
		<div>
			<BlogViewTracker blogId={blog._id?.toString()} blogSlug={blog.slug} />
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<BlogDetailsMain blog={blog} />
						<Cta />
					</main>
					<Footer />
				</div>
			</div>
			<ClientWrapper />
		</div>
	);
}

export async function generateStaticParams() {
	try {
		const items = await getAllBlogsFromAPI();
		return items?.map(({ slug }) => ({
			slug: slug,
		})) || [];
	} catch (error) {
		console.error("Error generating static params:", error);
		return [];
	}
}
