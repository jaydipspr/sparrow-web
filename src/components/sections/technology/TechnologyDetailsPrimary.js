"use client";
import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";
import Image from "next/image";
import Link from "next/link";
import CtaSidebar from "../cta/CtaSidebar";

const TechnologyDetailsPrimary = ({ option }) => {
	const {
		currentItem,
		items,
		currentSlug,
		isPrevItem,
		isNextItem,
		prevSlug,
		nextSlug,
	} = option || {};
	const { title, titleLarge, slug, iconName, img, desc, desc1, desc2, desc3, features } = currentItem || {};
	const sidebarItems = items?.slice(0, 6);
	return (
		<section className="tj-service-area section-gap">
			<div className="container">
				<div className="row row-gap-5">
					<div className="col-lg-8">
						<div className="post-details-wrapper">
							{img && (
								<div className="blog-images wow fadeInUp" data-wow-delay=".1s">
									<Image
										src={img}
										alt={title || "Technology"}
										width={870}
										height={450}
										style={{ height: "auto" }}
									/>
								</div>
							)}
							<h2 className="title title-anim">{titleLarge || title}</h2>
							<div className="blog-text">
								<p className="wow fadeInUp" data-wow-delay=".2s">
									{desc}
								</p>
								<p className="wow fadeInUp" data-wow-delay=".2s">
									{desc1}
								</p>
								<p className="wow fadeInUp" data-wow-delay=".2s">
									{desc2}
								</p>
								<p className="wow fadeInUp" data-wow-delay=".2s">
									{desc3}
								</p>
							</div>
							{features && features.length > 0 && (
								<>
									<h3 className="wow fadeInUp" data-wow-delay=".3s" style={{ marginTop: "40px", marginBottom: "20px" }}>
										Key Features
									</h3>
									<div className="details-content-box" style={{ marginTop: "0" }}>
										{features.map((feature, idx) => (
											<div
												key={idx}
												className="service-details-item wow fadeInUp"
												data-wow-delay={`${0.2 + idx * 0.1}s`}
												style={{ padding: "30px 20px 25px 20px" }}
											>
												<span 
													className="number" 
													style={{ 
														marginBottom: "20px", 
														display: "inline-flex",
														alignItems: "center",
														justifyContent: "center"
													}}
												>
													{(idx + 1).toString().padStart(2, "0")}.
												</span>
												<h6 className="title" style={{ marginBottom: "0" }}>{feature}</h6>
											</div>
										))}
									</div>
								</>
							)}
							{/* <!-- post navigation --> */}
							<div className="post-navigation wow fadeInUp" data-wow-delay=".4s">
								<div className="row">
									{isPrevItem && prevSlug ? (
										<div className="col-6">
											<div className="post-nav-item prev-post">
												<Link href={`/technology/${prevSlug}`}>
													<span className="nav-label">Previous</span>
													<span className="nav-title">
														{items?.find((item) => item.slug === prevSlug)?.title}
													</span>
												</Link>
											</div>
										</div>
									) : (
										<div className="col-6"></div>
									)}
									{isNextItem && nextSlug ? (
										<div className={`col-6 ${!isPrevItem ? "offset-6" : ""}`}>
											<div className="post-nav-item next-post">
												<Link href={`/technology/${nextSlug}`}>
													<span className="nav-label">Next</span>
													<span className="nav-title">
														{items?.find((item) => item.slug === nextSlug)?.title}
													</span>
												</Link>
											</div>
										</div>
									) : (
										""
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="col-lg-4">
						<aside className="tj-main-sidebar">
							{/* <!-- Technology List --> */}
							<div
								className="tj-sidebar-widget service-categories wow fadeInUp"
								data-wow-delay=".1s"
							>
								<h4 className="widget-title">More Technologies</h4>
								<ul>
									{sidebarItems?.length
										? sidebarItems?.map(({ shortTitle, slug }, idx) => (
												<li key={idx}>
													<Link
														className={`${currentSlug === slug ? "active" : ""}`}
														href={`/technology/${slug}`}
													>
														{shortTitle}
														<span className="icon">
															<i className="tji-arrow-right"></i>
														</span>
													</Link>
												</li>
										  ))
										: ""}
								</ul>
							</div>

							{/* <!-- cta --> */}
							<div
								className="tj-sidebar-widget widget-feature-item wow fadeInUp"
								data-wow-delay=".3s"
							>
								<CtaSidebar />
							</div>
						</aside>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TechnologyDetailsPrimary;
