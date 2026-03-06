"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import useActiveLink from "@/hooks/useActiveLink";
import getNavItems from "@/libs/getNavItems";
import { useServices } from "@/hooks/useServices";
import { useTechnologies } from "@/hooks/useTechnologies";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import TechnologyDropdownTeam from "./TechnologyDropdownTeam";

const Navbar = ({ headerType, isStickyHeader }) => {
	const makeActiveLink = useActiveLink();
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
							// Update path with actual MongoDB ObjectId
							const serviceId = matchingService._id?.toString() || matchingService.id;
							return {
								...navService,
								path: `/services/${serviceId}`,
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
						const techId = tech._id?.toString() || tech.id;
						technologiesByCategory[category].push({
							id: techId,
							name: tech.name,
							path: `/technology/${techId}`,
							badge: null // You can add badge logic here if needed
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
	
	const homeNav = makeActiveLink(mergedNavItems[0]);
	const pagesNav = makeActiveLink(mergedNavItems[1]);
	const serviceNav = makeActiveLink(mergedNavItems[2]);
	const portfolioNav = makeActiveLink(mergedNavItems[3]);
	const blogNav = makeActiveLink(mergedNavItems[4]);
	const contactNav = makeActiveLink(mergedNavItems[5]);

	return (
		<div className="menu-area d-none d-lg-inline-flex align-items-center">
			<nav id="mobile-menu" className="mainmenu">
				<ul>
					<li
						className={`${homeNav?.submenu?.length ? "has-dropdown" : ""} ${
							homeNav?.isActive ? "current-menu-ancestor" : ""
						}`}
					>
						<Link href={homeNav?.path ? homeNav?.path : "#"}>
							{homeNav?.name}
						</Link>
						{homeNav?.submenu?.length ? (
							<ul className="sub-menu header__mega-menu mega-menu  ">
								<li>
									<div className="mega-menu-wrapper">
										<div className="container-fluid gap-60-25">
											<div className="row">
												{homeNav?.submenu?.map((item, idx) => (
														<div key={idx} className="col-xl-3 col-lg-3 col-12">
															<div
																className={`tj-demo-thumb ${
																	item?.isComming ? "coming" : ""
																}`}
															>
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
																	{!item?.isComming ? (
																		<div className="tj-demo-button">
																			<ButtonPrimary
																				text={"View demo"}
																				url={item?.path}
																				className={"header_btn"}
																			/>
																		</div>
																	) : (
																		""
																	)}
																</div>
																<h6 className="tj-demo-title">
																	{item?.isComming ? (
																		item?.name
																	) : (
																		<Link href={item?.path ? item?.path : "#"}>
																			{item?.name}
																		</Link>
																	)}
																</h6>
															</div>
														</div>
												  ))}
											</div>
										</div>
									</div>
								</li>
							</ul>
						) : null}
					</li>
					<li
						className={`has-dropdown ${
							pagesNav?.isActive ? "current-menu-ancestor" : ""
						}`}
					>
						<Link href={pagesNav?.path}>{pagesNav?.name}</Link>
						<ul className="sub-menu header__mega-menu mega-menu mega-menu-pages">
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
																			className={item?.isActive ? "active" : ""}
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
						</ul>
					</li>
					<li
						className={`has-dropdown ${
							serviceNav?.isActive ? "current-menu-ancestor" : ""
						}`}
					>
						<Link href={serviceNav?.path ? serviceNav?.path : "#"}>
							{serviceNav?.name}
						</Link>
						<ul className="sub-menu  mega-menu-service">
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
						</ul>
					</li>
					<li
						className={`${portfolioNav?.submenu?.length ? "has-dropdown" : ""} ${
							portfolioNav?.isActive ? "current-menu-ancestor" : ""
						}`}
					>
						<Link href={portfolioNav?.path ? portfolioNav?.path : "#"}>
							{portfolioNav?.name}
						</Link>
						{portfolioNav?.submenu?.length ? (
							<ul className="sub-menu">
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
							</ul>
						) : null}
					</li>
					<li
						className={`${blogNav?.submenu?.length ? "has-dropdown" : ""} ${
							blogNav?.isActive ? "current-menu-ancestor" : ""
						}`}
					>
						<Link href={blogNav?.path ? blogNav?.path : "#"}>
							{blogNav?.name}
						</Link>
						{blogNav?.submenu?.length ? (
							<ul className="sub-menu">
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
							</ul>
						) : null}
					</li>
					<li className={contactNav?.isActive ? "current-menu-ancestor" : ""}>
						<Link href={contactNav?.path ? contactNav?.path : "#"}>
							{contactNav?.name ? contactNav?.name : "Contact"}
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Navbar;
