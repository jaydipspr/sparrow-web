"use client";
import PortfolioCard3 from "@/components/shared/cards/PortfolioCard3";
import Paginations from "@/components/shared/others/Paginations";
import usePagination from "@/hooks/usePagination";
import { usePortfolios } from "@/hooks/usePortfolios";
import makeWowDelay from "@/libs/makeWowDelay";
import { useEffect, useState } from "react";

const PortfoliosPrimary = () => {
	const { portfolios, loading, error } = usePortfolios();
	const [items, setItems] = useState([]);
	const limit = 6;

	useEffect(() => {
		if (!loading) {
			if (Array.isArray(portfolios) && portfolios.length > 0) {
				setItems(portfolios);
			} else {
				setItems([]);
			}
		}
	}, [portfolios, loading]);

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
						<span> Loading portfolios...</span>
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
						<p>No portfolios found.</p>
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
									<PortfolioCard3 key={idx} portfolio={item} />
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

export default PortfoliosPrimary;
