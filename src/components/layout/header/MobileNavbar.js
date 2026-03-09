"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import getNavItems from "@/libs/getNavItems";
import { useServices } from "@/hooks/useServices";
import { useTechnologies } from "@/hooks/useTechnologies";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import MobileMenuItem from "./MobileMenuItem";
import TechnologyDropdownTeam from "./TechnologyDropdownTeam";

const MobileNavbar = () => {
	const navItems = getNavItems();
	const { services: apiServices } = useServices();
	const { technologies: apiTechnologies } = useTechnologies();
	
	// Merge nav items with actual service and technology data from API
	const mergedNavItems = useMemo(() => {
		const updatedNavItems = [...navItems];
		
		// Update Services
		if (apiServices && apiServices.length > 0) {
			const servicesNavIndex = updatedNavItems.findIndex(item => item.name === "Services");
			
			if (servicesNavIndex !== -1 && updatedNavItems[servicesNavIndex].submenu) {
				// Map each nav item to actual service from API by matching name
				// Only include services that exist in the API (active services)
				updatedNavItems[servicesNavIndex].submenu = updatedNavItems[servicesNavIndex].submenu
					.map(navService => {
						// Find matching service from API by name (case-insensitive)
						const matchingService = apiServices.find(apiService => 
							apiService.name?.toLowerCase() === navService.name?.toLowerCase() ||
							apiService.title?.toLowerCase() === navService.name?.toLowerCase()
						);
						
					if (matchingService) {
						// Update path with slug, fallback to ID
						const serviceLink = matchingService.slug || matchingService._id?.toString() || matchingService.id;
						return {
							...navService,
							path: `/services/${serviceLink}`,
						};
					}
						
						// Return null for services not found in API (inactive services)
						return null;
					})
					.filter(service => service !== null); // Remove inactive services
			}
		}
		
		// Update Technologies
		if (apiTechnologies && apiTechnologies.length > 0) {
			const technologyNavIndex = updatedNavItems.findIndex(item => item.name === "Technology");
			
			if (technologyNavIndex !== -1 && updatedNavItems[technologyNavIndex].submenu) {
				// Group technologies by category
				const technologiesByCategory = {
					"Web Development": [],
					"Application Development": [],
					"Backend & Database": []
				};
				
				apiTechnologies.forEach(tech => {
					const category = tech.category;
					if (technologiesByCategory[category]) {
						const techLink = tech.slug || tech._id?.toString() || tech.id;
						technologiesByCategory[category].push({
							id: techLink,
							name: tech.name,
							path: `/technology/${techLink}`,
							badge: null
						});
					}
				});
				
				// Update each category submenu with API technologies
				updatedNavItems[technologyNavIndex].submenu = updatedNavItems[technologyNavIndex].submenu.map(categoryItem => {
					const categoryName = categoryItem.name;
					const apiTechItems = technologiesByCategory[categoryName] || [];
					
					if (apiTechItems.length > 0) {
						return {
							...categoryItem,
							items: apiTechItems
						};
					}
					
					return categoryItem; // Keep original if no API technologies for this category
				});
			}
		}
		
		return updatedNavItems;
	}, [navItems, apiServices, apiTechnologies]);
	
	const homeNav = mergedNavItems[0];
	const pagesNav = mergedNavItems[1];
	const serviceNav = mergedNavItems[2];
	const portfolioNav = mergedNavItems[3];
	const blogNav = mergedNavItems[4];
	const contactNav = mergedNavItems[5];
	return (
		<div className="hamburger_menu">
			<div className="mobile_menu mean-container">
				<div className="mean-bar">
					<Link
						href="#nav"
						className="meanmenu-reveal"
						style={{ right: 0, left: "auto" }}
					>
						<span>
							<span>
								<span></span>
							</span>
						</span>
					</Link>
					<nav className="mean-nav">
						<ul>
							{homeNav?.submenu?.length ? (
								<MobileMenuItem
									text={homeNav?.name}
									url={homeNav?.path ? homeNav?.path : "#"}
									submenuClass={"header__mega-menu mega-menu"}
								>
									<li>
										<div className="mega-menu-wrapper">
											<div className="container-fluid gap-60-25">
												<div className="row">
													{homeNav?.submenu?.map((item, idx) => (
															<div
																key={idx}
																className={`col-xl-3 col-lg-3 col-12 ${
																	item?.isComming ? "d-none" : ""
																}`}
															>
																<div className="tj-demo-thumb">
																	<div className="image">
																		<Image
																			src={
																				item?.img
																					? item?.img
																					: "/images/header/demo/home-1.webp"
																			}
																			alt=""
																			width={570}
																			height={434}
																		/>
																		{item?.badge ? (
																			<span className="tj-demo-badge tj-zoom-in-out-anim">
																				{item?.badge}
																			</span>
																		) : (
																			""
																		)}
																		<div className="tj-demo-button">
																			<ButtonPrimary
																				text={"View demo"}
																				url={item?.path}
																				className={"header_btn"}
																			/>
																		</div>
																	</div>
																	<h6 className="tj-demo-title">
																		<Link href={item?.path ? item?.path : "#"}>
																			{item?.name}
																		</Link>
																	</h6>
																</div>
															</div>
													  ))}
												</div>
											</div>
										</div>
									</li>
								</MobileMenuItem>
							) : (
								<li>
									<Link href={homeNav?.path ? homeNav?.path : "#"}>
										{homeNav?.name}
									</Link>
								</li>
							)}
							<MobileMenuItem
								text={pagesNav?.name}
								url={pagesNav?.path}
								submenuClass={"header__mega-menu mega-menu mega-menu-pages"}
							>
								<li>
									<div className="mega-menu-wrapper">
										{pagesNav?.submenu?.length
											? pagesNav?.submenu?.map((pageItem, idx) => (
													<div key={idx} className="mega-menu-pages-single">
														<div className="mega-menu-pages-single-inner">
															<h6 className="mega-menu-title">
																{pageItem?.name}
															</h6>
															<div className="mega-menu-list">
																{pageItem?.items?.length
																	? pageItem?.items?.map((item, idx2) => (
																			<Link
																				key={100 + idx2}
																				href={item?.path ? item?.path : "/"}
																				className={
																					item?.isActive ? "active" : ""
																				}
																			>
																				{item?.name}
																				{item?.badge ? (
																					<span
																						className={`mega-menu-badge tj-zoom-in-out-anim ${
																							item?.badge === "HOT"
																								? "mega-menu-badge-hot"
																								: ""
																						}`}
																					>
																						{item?.badge}
																					</span>
																				) : (
																					""
																				)}
																			</Link>
																	  ))
																	: ""}
															</div>
														</div>
													</div>
											  ))
											: ""}
										<TechnologyDropdownTeam />
									</div>
								</li>
							</MobileMenuItem>
							<MobileMenuItem
								text={serviceNav?.name}
								url={serviceNav?.path ? serviceNav?.path : "#"}
								submenuClass={"mega-menu-service"}
							>
								{serviceNav?.submenu?.length
									? serviceNav?.submenu?.map((item, idx) => (
											<li key={idx}>
												<Link
													className="mega-menu-service-single"
													href={item?.path ? item?.path : "/"}
												>
													{" "}
													<span className="mega-menu-service-icon">
														<i
															className={
																item?.icon ? item?.icon : "tji-service-1"
															}
														></i>
													</span>{" "}
													<span className="mega-menu-service-title">
														{item?.name
															? item?.name
															: "Business process optimization"}
													</span>{" "}
													<span className="mega-menu-service-nav">
														<i className="tji-arrow-right-long"></i>
														<i className="tji-arrow-right-long"></i>
													</span>
												</Link>
											</li>
									  ))
									: ""}
							</MobileMenuItem>
							{portfolioNav?.submenu?.length ? (
								<MobileMenuItem
									text={portfolioNav?.name}
									url={portfolioNav?.path ? portfolioNav?.path : "#"}
								>
									{portfolioNav?.submenu?.map((item, idx) => (
											<li
												key={idx}
												className={item?.isActive ? "current-menu-item" : ""}
											>
												<Link href={item?.path ? item?.path : "/portfolios"}>
													{item?.name ? item?.name : "Portfolio"}
												</Link>
											</li>
									  ))}
								</MobileMenuItem>
							) : (
								<li>
									<Link href={portfolioNav?.path ? portfolioNav?.path : "#"}>
										{portfolioNav?.name}
									</Link>
								</li>
							)}
							{blogNav?.submenu?.length ? (
								<MobileMenuItem
									text={blogNav?.name}
									url={blogNav?.path ? blogNav?.path : "#"}
								>
									{blogNav?.submenu?.map((item, idx) => (
											<li
												key={idx}
												className={item?.isActive ? "current-menu-item" : ""}
											>
												<Link href={item?.path ? item?.path : "/blogs"}>
													{item?.name ? item?.name : "Blog"}
												</Link>
											</li>
									  ))}
								</MobileMenuItem>
							) : (
								<li>
									<Link href={blogNav?.path ? blogNav?.path : "#"}>
										{blogNav?.name}
									</Link>
								</li>
							)}
							<li className="mean-last">
								<Link href={contactNav?.path ? contactNav?.path : "#"}>
									{" "}
									{contactNav?.name ? contactNav?.name : "Contact"}
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	);
};

export default MobileNavbar;
