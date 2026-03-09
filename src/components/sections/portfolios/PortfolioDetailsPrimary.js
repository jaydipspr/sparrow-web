"use client";
import Image from "next/image";
import Link from "next/link";

const PortfolioDetailsPrimary = ({ option }) => {
	const {
		currentItem,
		items,
		currentId,
		isPrevItem,
		isNextItem,
		prevId,
		nextId,
	} = option || {};
	const {
		name,
		title,
		img,
		description,
		category,
		keyHighlights,
		technology,
		projectLink,
	} = currentItem || {};

	const displayTitle = title || name || "Portfolio Details";
	const displayName = name || title || "Portfolio";
	const sidebarItems = items?.slice(0, 6);

	return (
		<section className="tj-blog-section section-gap">
			<div className="container">
				<div className="row rg-50">
					<div className="col-lg-8">
						<div className="post-details-wrapper">
							{img && (
								<div className="blog-images wow fadeInUp" data-wow-delay=".1s">
									<Image
										src={img}
										alt={displayName}
										width={868}
										height={450}
										style={{ width: "100%", height: "auto", maxHeight: "450px", objectFit: "cover" }}
									/>
								</div>
							)}
							<h2 className="title title-anim">
								{displayTitle || displayName}
							</h2>
							<div className="blog-text">
								{description && (
									<p className="wow fadeInUp" data-wow-delay=".3s">
										{description}
									</p>
								)}

								{keyHighlights && keyHighlights.length > 0 && (
									<>
										<h3 className="wow fadeInUp" data-wow-delay=".3s">
											Key Highlights
										</h3>
										<ul className="wow fadeInUp" data-wow-delay=".3s">
											{keyHighlights.map((highlight, index) => (
												<li key={index}>
													<span>
														<i className="tji-check"></i>
													</span>
													{highlight}
												</li>
											))}
										</ul>
									</>
								)}

							</div>
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
										<Link href={isPrevItem ? `/portfolios/${prevId}` : "#"}>
											<span>
												<i className="tji-arrow-left"></i>
											</span>
											Previous
										</Link>
									</div>
								</div>
								<Link href={"/portfolios"} className="tj-nav-post__grid">
									<i className="tji-window"></i>
								</Link>
								{/* <!-- next post --> */}
								<div
									className="tj-nav__post next"
									style={{ visibility: isNextItem ? "visible" : "hidden" }}
								>
									<div className="tj-nav-post__nav next_post">
										<Link href={isNextItem ? `/portfolios/${nextId}` : "#"}>
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
						<aside className="tj-main-sidebar">
							{/* <!-- Project Info --> */}
							<div
								className="tj-sidebar-widget widget-categories wow fadeInUp"
								data-wow-delay=".1s"
							>
								<h4 className="widget-title">Project Info</h4>
								{category && (
									<div className="infos-item">
										<div className="project-icons">
											<i className="tji-chart"></i>
										</div>
										<div className="project-text">
											<span>Category</span>
											<h6 className="title">{category}</h6>
										</div>
									</div>
								)}
								{technology && technology.length > 0 && (
									<div className="infos-item">
										<div className="project-icons">
											<i className="tji-service-1"></i>
										</div>
										<div className="project-text">
											<span>Technology</span>
											<div className="title" style={{ display: "flex", flexWrap: "wrap", gap: "6px 4px", alignItems: "center" }}>
												{technology.map((tech, idx) => {
													const techName = typeof tech === "string" ? tech : tech.name;
													const techSlug = typeof tech === "string" ? null : tech.slug;
													return (
														<span key={idx} style={{ whiteSpace: "nowrap" }}>
															{techSlug ? (
																<Link href={`/technology/${techSlug}`} style={{ color: "inherit", textDecoration: "underline" }}>
																	{techName}
																</Link>
															) : (
																techName
															)}
															{idx < technology.length - 1 && ","}
														</span>
													);
												})}
											</div>
										</div>
									</div>
								)}
								{projectLink && (
									<div className="infos-item">
										<div className="project-icons">
											<i className="tji-worldwide"></i>
										</div>
										<div className="project-text">
											<span>Project Link</span>
											<h6 className="title">
												<Link href={projectLink} target="_blank" rel="noopener noreferrer">
													Visit Project
												</Link>
											</h6>
										</div>
									</div>
								)}
							</div>

							{/* <!-- More Portfolios --> */}
							{sidebarItems && sidebarItems.length > 1 && (
								<div
									className="tj-sidebar-widget service-categories wow fadeInUp"
									data-wow-delay=".2s"
								>
									<h4 className="widget-title">More Projects</h4>
									<ul>
								{sidebarItems.map(({ name, title, id, slug }, idx) => {
										const linkId = slug || id;
										return (
											<li key={idx}>
												<Link
													className={`${currentId === linkId ? "active" : ""}`}
													href={`/portfolios/${linkId}`}
												>
													{name || title}
													<span className="icon">
														<i className="tji-arrow-right"></i>
													</span>
												</Link>
											</li>
										);
									})}
									</ul>
								</div>
							)}

						</aside>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PortfolioDetailsPrimary;
