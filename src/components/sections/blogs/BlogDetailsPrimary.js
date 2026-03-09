"use client";
import BlogSidebar from "@/components/shared/sidebar/BlogSidebar";
import Image from "next/image";
import Link from "next/link";

const BlogDetailsPrimary = ({ option }) => {
	const { prevId, nextId, currentItem, items, currentId, isPrevItem, isNextItem } = option || {};
	const {
		title,
		img,
		author,
		category,
		content,
		thought,
		thoughtAuthor,
		keyLessons,
		conclusion,
		createdAt,
	} = currentItem || {};

	// Format date
	const formattedDate = createdAt
		? new Date(createdAt).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: "";

	return (
		<section className="tj-blog-section section-gap slidebar-stickiy-container">
			<div className="container">
				<div className="row row-gap-5">
					<div className="col-lg-8">
						<div className="post-details-wrapper">
							{img && (
								<div className="blog-images wow fadeInUp" data-wow-delay=".1s">
									<Image
										src={img}
										alt={title || "Blog"}
										width={870}
										height={450}
										style={{ width: "100%", height: "auto", maxHeight: "450px", objectFit: "cover" }}
									/>
								</div>
							)}
							<h2 className="title title-anim">{title}</h2>
							<div
								className="blog-category-two wow fadeInUp"
								data-wow-delay=".3s"
							>
								{author && (
									<div className="category-item">
										<div className="cate-icons">
											<i className="tji-user"></i>
										</div>
										<div className="cate-text">
											<span className="degination">Authored by</span>
											<h6 className="title">{author}</h6>
										</div>
									</div>
								)}
								{formattedDate && (
									<div className="category-item">
										<div className="cate-icons">
											<i className="tji-calendar"></i>
										</div>
										<div className="cate-text">
											<span className="degination">Date Released</span>
											<h6 className="text">{formattedDate}</h6>
										</div>
									</div>
								)}
								{category && (
									<div className="category-item">
										<div className="cate-icons">
											<i className="tji-chart"></i>
										</div>
										<div className="cate-text">
											<span className="degination">Category</span>
											<h6 className="text">{category}</h6>
										</div>
									</div>
								)}
							</div>
							<div className="blog-text">
								{/* Content Paragraphs */}
								{content && content.length > 0 && content.map((paragraph, index) => (
									<p key={index} className="wow fadeInUp" data-wow-delay=".3s">
										{paragraph}
									</p>
								))}

								{/* Thought / Quote */}
								{thought && (
									<blockquote className="wow fadeInUp" data-wow-delay=".3s">
										<p>{thought}</p>
										{thoughtAuthor && <cite>{thoughtAuthor}</cite>}
									</blockquote>
								)}

								{/* Key Lessons */}
								{keyLessons && keyLessons.length > 0 && (
									<>
										<h3 className="wow fadeInUp" data-wow-delay=".3s">
											Key Lessons
										</h3>
										<ul className="wow fadeInUp" data-wow-delay=".3s">
											{keyLessons.map((lesson, index) => (
												<li key={index}>
													<span>
														<i className="tji-check"></i>
													</span>
													{lesson}
												</li>
											))}
										</ul>
									</>
								)}

								{/* Conclusion */}
								{conclusion && (
									<>
										<h3 className="wow fadeInUp" data-wow-delay=".3s">
											Conclusion
										</h3>
										<p className="wow fadeInUp" data-wow-delay=".3s">
											{conclusion}
										</p>
									</>
								)}
							</div>

							{/* Tags */}
							<div className="tj-tags-post wow fadeInUp" data-wow-delay=".3s">
								{category && (
									<div className="tagcloud">
										<span>Category:</span>
										<Link href={`/blogs`}>
											{category}
										</Link>
									</div>
								)}
								<div className="post-share">
									<ul>
										<li> Share:</li>
										<li>
											<Link href="https://www.facebook.com/" target="_blank">
												<i className="fa-brands fa-facebook-f"></i>
											</Link>
										</li>
										<li>
											<Link href="https://x.com/" target="_blank">
												<i className="fa-brands fa-x-twitter"></i>
											</Link>
										</li>
										<li>
											<Link href="https://www.instagram.com/" target="_blank">
												<i className="fa-brands fa-instagram"></i>
											</Link>
										</li>
										<li>
											<Link href="https://www.linkedin.com/" target="_blank">
												<i className="fa-brands fa-linkedin-in"></i>
											</Link>
										</li>
									</ul>
								</div>
							</div>

							{/* Navigation */}
							<div
								className="tj-post__navigation wow fadeInUp"
								data-wow-delay="0.3s"
							>
								{/* previous post */}
								<div
									className="tj-nav__post previous"
									style={{ visibility: isPrevItem ? "visible" : "hidden" }}
								>
									<div className="tj-nav-post__nav prev_post">
										<Link href={isPrevItem ? `/blogs/${prevId}` : "#"}>
											<span>
												<i className="tji-arrow-left"></i>
											</span>
											Previous
										</Link>
									</div>
								</div>
								<Link href={"/blogs"} className="tj-nav-post__grid">
									<i className="tji-window"></i>
								</Link>
								{/* next post */}
								<div
									className="tj-nav__post next"
									style={{ visibility: isNextItem ? "visible" : "hidden" }}
								>
									<div className="tj-nav-post__nav next_post">
										<Link href={isNextItem ? `/blogs/${nextId}` : "#"}>
											Next
											<span>
												<i className="tji-arrow-right"></i>
											</span>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-4">
						<BlogSidebar />
					</div>
				</div>
			</div>
		</section>
	);
};

export default BlogDetailsPrimary;
