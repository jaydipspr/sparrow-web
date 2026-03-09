import BlogCard4 from "@/components/shared/cards/BlogCard4";

const Blogs4 = ({ blogs = [] }) => {
	const displayBlogs = blogs.slice(0, 3);
	return (
		<section className="tj-blog-section-4 section-gap">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading style-4 text-center">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								<i className="tji-box"></i>Read Blogs
							</span>
							<h2 className="sec-title title-anim">Strategies and Insights.</h2>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="h4-blog-wrap">
							{displayBlogs?.length
								? displayBlogs?.map((blog, idx) => (
										<BlogCard4 key={idx} blog={blog} idx={idx} />
								  ))
								: ""}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Blogs4;
