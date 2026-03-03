"use client";
import TechnologyCard from "@/components/shared/cards/TechnologyCard";
import Paginations from "@/components/shared/others/Paginations";
import usePagination from "@/hooks/usePagination";
import getTechnologies from "@/libs/getTechnologies";
import makeWowDelay from "@/libs/makeWowDelay";

const TechnologyPrimary = () => {
	const items = getTechnologies();
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
	return (
		<div className="tj-service-section service-4 section-gap">
			<div className="container">
				<div className="row row-gap-4">
					{currentItems?.length
						? currentItems?.map((item, idx) => (
								<div
									key={idx}
									className="col-lg-4 col-md-6 wow fadeInUp"
									data-wow-delay={makeWowDelay(idx, 0.1)}
								>
									<TechnologyCard technology={item} idx={idx} />
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
		</div>
	);
};

export default TechnologyPrimary;
