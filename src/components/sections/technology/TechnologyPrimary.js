"use client";
import TechnologyCard from "@/components/shared/cards/TechnologyCard";
import Paginations from "@/components/shared/others/Paginations";
import usePagination from "@/hooks/usePagination";
import { useTechnologies } from "@/hooks/useTechnologies";
import makeWowDelay from "@/libs/makeWowDelay";
import { useEffect, useState } from "react";

const TechnologyPrimary = () => {
	const { technologies: apiTechnologies, loading, error } = useTechnologies();
	const [items, setItems] = useState([]);
	
	// Use only API technologies - no JSON fallback
	useEffect(() => {
		if (!loading) {
			if (Array.isArray(apiTechnologies) && apiTechnologies.length > 0) {
				// Map API technologies to match expected format
				const mappedTechnologies = apiTechnologies.map((technology) => ({
					...technology,
					id: technology._id?.toString() || technology.id,
				}));
				setItems(mappedTechnologies);
			} else {
				setItems([]);
			}
		}
	}, [apiTechnologies, loading]);
	const limit = 6;
	// get pagination details
	const {
		currentItems,
		currentpage,
		setCurrentpage,
		paginationItems,
		currentPaginationItems,
		totalPages,
		handleCurrentPage,
		firstItem,
		lastItem,
	} = usePagination(items, limit);
	const totalItems = items?.length;
	const totalItemsToShow = currentItems?.length;
	if (loading) {
		return (
			<section className="tj-project-section section-gap">
				<div className="container">
					<div className="admin-loading" style={{ textAlign: "center", padding: "40px 0" }}>
						<i className="fa-light fa-spinner fa-spin"></i>
						<span> Loading technologies...</span>
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="tj-project-section section-gap">
				<div className="container">
					<div className="admin-alert admin-alert-error">
						<i className="fa-light fa-circle-exclamation"></i>
						<span>Error: {error}</span>
					</div>
				</div>
			</section>
		);
	}

	if (items.length === 0) {
		return (
			<section className="tj-project-section section-gap">
				<div className="container">
					<div className="admin-empty-state" style={{ textAlign: "center", padding: "40px 0" }}>
						<i className="fa-light fa-inbox" style={{ fontSize: "48px", color: "#ccc", display: "block", marginBottom: "16px" }}></i>
						<p>No technologies found.</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="tj-project-section section-gap">
			<div className="container">
				<div className="row row-gap-4">
					{currentItems?.length
						? currentItems?.map((item, idx) => (
								<div
									key={item.id || item._id || idx}
									className="col-xl-4 col-md-6 wow fadeInUp"
									data-wow-delay={makeWowDelay(idx, 0.1)}
								>
									<TechnologyCard key={idx} technology={item} />
								</div>
						  ))
						: ""}
				</div>
				{/* <!-- post pagination --> */}
				{totalItemsToShow < totalItems ? (
					<Paginations
						paginationDetails={{
							currentItems,
							currentpage,
							setCurrentpage,
							paginationItems,
							currentPaginationItems,
							totalPages,
							handleCurrentPage,
							firstItem,
							lastItem,
						}}
					/>
				) : (
					""
				)}
			</div>
		</section>
	);
};

export default TechnologyPrimary;
