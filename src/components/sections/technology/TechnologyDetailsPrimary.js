"use client";
import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";
import Image from "next/image";
import Link from "next/link";
import CtaSidebar from "../cta/CtaSidebar";

const TechnologyDetailsPrimary = ({ option }) => {
	const {
		currentItem,
		items,
		currentId,
		isPrevItem,
		isNextItem,
		prevId,
		nextId,
		relatedPortfolios = [],
	} = option || {};
	const { name, title, titleLarge, img, desc, desc1, desc2, desc3, features } = currentItem || {};
	const sidebarItems = items?.slice(0, 6);
	const displayName = name || title || "Technology";
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
										alt={displayName}
										width={870}
										height={450}
										style={{ height: "auto" }}
									/>
								</div>
							)}
							<h2 className="title title-anim">{displayName}</h2>
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
									<div className="details-content-box">
										{features.map((feature, idx) => (
											<div
												key={idx}
												className="service-details-item wow fadeInUp"
												data-wow-delay={`${0.2 + idx * 0.1}s`}
											>
												<span className="number">
													{(idx + 1).toString().padStart(2, "0")}.
												</span>
												<h6 className="title">{feature}</h6>
											</div>
										))}
									</div>
								</>
							)}
						{/* Related Portfolio Projects */}
						{relatedPortfolios.length > 0 && (
							<div className="tech-related-portfolios wow fadeInUp" data-wow-delay=".3s">
								<h3>Projects Built with {displayName}</h3>
								<div className="tech-related-grid">
									{relatedPortfolios.map((portfolio) => {
										const portfolioSlug = portfolio.slug || portfolio._id || portfolio.id;
										const portfolioName = portfolio.name || portfolio.title;
										const portfolioImg = portfolio.img;
										const portfolioCategory = portfolio.category;

										return (
											<div key={portfolio._id || portfolio.id} className="tech-related-card">
												<div className="tech-related-img">
													{portfolioImg ? (
														<Image
															src={portfolioImg}
															alt={portfolioName}
															fill
															sizes="(max-width: 768px) 100vw, 50vw"
															style={{ objectFit: "cover" }}
														/>
													) : (
														<div className="tech-related-img-placeholder">
															<span>No Image</span>
														</div>
													)}
												</div>
												<div className="tech-related-info">
													{portfolioCategory && (
														<span className="tech-related-category">
															{portfolioCategory}
														</span>
													)}
													<h5 className="tech-related-title">
														<Link href={`/portfolios/${portfolioSlug}`}>{portfolioName}</Link>
													</h5>
													<Link className="tech-related-btn" href={`/portfolios/${portfolioSlug}`}>
														View Project <i className="tji-arrow-right"></i>
													</Link>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* <!-- post navigation --> */}
						<div
							className="tj-post__navigation mb-0 wow fadeInUp"
							data-wow-delay="0.3s"
						>
								{/* <!-- previous post --> */}
								<div
									className="tj-nav__post previous"
									style={{ visibility: isPrevItem ? "visible" : "hidden" }}
								>
									<div className="tj-nav-post__nav prev_post">
										<Link href={isPrevItem ? `/technology/${prevId}` : "#"}>
											<span>
												<i className="tji-arrow-left"></i>
											</span>
											{items?.find((item) => item.id === prevId)?.name || items?.find((item) => item.id === prevId)?.title || "Previous"}
										</Link>
									</div>
								</div>
								<Link href={"/technology"} className="tj-nav-post__grid">
									<i className="tji-window"></i>
								</Link>
								{/* <!-- next post --> */}
								<div
									className="tj-nav__post next"
									style={{ visibility: isNextItem ? "visible" : "hidden" }}
								>
									<div className="tj-nav-post__nav next_post">
										<Link href={isNextItem ? `/technology/${nextId}` : "#"}>
											{items?.find((item) => item.id === nextId)?.name || items?.find((item) => item.id === nextId)?.title || "Next"}
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
						<aside className="tj-main-sidebar">
							{/* <!-- Technology List --> */}
							<div
								className="tj-sidebar-widget service-categories wow fadeInUp"
								data-wow-delay=".1s"
							>
								<h4 className="widget-title">More Technologies</h4>
								<ul>
								{sidebarItems?.length
									? sidebarItems?.map((item, idx) => {
											const technologySlug = item.slug || item.id || item._id?.toString();
											const technologyName = item.name || item.title;
											return (
												<li key={idx}>
													<Link
														className={`${currentId === technologySlug ? "active" : ""}`}
														href={`/technology/${technologySlug}`}
													>
														{technologyName}
														<span className="icon">
															<i className="tji-arrow-right"></i>
														</span>
													</Link>
												</li>
											);
									  })
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
