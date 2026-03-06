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
	const limit = 9;
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
			<div className="tj-service-section service-4 section-gap">
				<div className="container">
					<div className="row">
						<div className="col-12 text-center">
							<p>Loading technologies...</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="tj-service-section service-4 section-gap">
				<div className="container">
					<div className="row">
						<div className="col-12 text-center">
							<p style={{ color: "red" }}>Error: {error}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="tj-service-section service-4 section-gap">
			<div className="container">
				<div className="row row-gap-4">
					{currentItems?.length
						? currentItems?.map((item, idx) => (
								<div
									key={item.id || item._id || idx}
									className="col-lg-4 col-md-6 wow fadeInUp"
									data-wow-delay={makeWowDelay(idx, 0.1)}
								>
									<TechnologyCard technology={item} idx={idx} />
								</div>
						  ))
						: !loading && (
							<div className="col-12 text-center">
								<p>No technologies found.</p>
							</div>
						)}
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
		</div>
	);
};

export default TechnologyPrimary;
