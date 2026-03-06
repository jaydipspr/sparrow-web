"use client";
import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";
import Image from "next/image";
import Link from "next/link";
import CtaSidebar from "../cta/CtaSidebar";
import TechnologyTeamSection from "./TechnologyTeamSection";

const TechnologyDetailsPrimary = ({ option }) => {
	const {
		currentItem,
		items,
		currentId,
		isPrevItem,
		isNextItem,
		prevId,
		nextId,
	} = option || {};
	const { title, titleLarge, img, desc, desc1, desc2, desc3, features } = currentItem || {};
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
											{items?.find((item) => item.id === prevId)?.title || items?.find((item) => item.id === prevId)?.name || "Previous"}
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
											{items?.find((item) => item.id === nextId)?.title || items?.find((item) => item.id === nextId)?.name || "Next"}
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
												const technologyId = item.id || item._id?.toString();
												const technologyTitle = item.title || item.name;
												return (
													<li key={idx}>
														<Link
															className={`${currentId === technologyId ? "active" : ""}`}
															href={`/technology/${technologyId}`}
														>
															{technologyTitle}
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
