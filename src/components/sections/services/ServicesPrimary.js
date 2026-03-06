"use client";
import ServiceCard4 from "@/components/shared/cards/ServiceCard4";
import Paginations from "@/components/shared/others/Paginations";
import usePagination from "@/hooks/usePagination";
import { useServices } from "@/hooks/useServices";
import makeWowDelay from "@/libs/makeWowDelay";
import { useEffect, useState } from "react";

const ServicesPrimary = () => {
	const { services: apiServices, loading } = useServices();
	const [items, setItems] = useState([]);
	
	// Use only API services - no JSON fallback
	useEffect(() => {
		if (apiServices && apiServices.length > 0) {
			// Map API services to match expected format
			const mappedServices = apiServices.map((service) => ({
				...service,
				id: service._id?.toString() || service.id,
				slug: service.slug || service._id?.toString(),
			}));
			setItems(mappedServices);
		} else {
			setItems([]);
		}
	}, [apiServices, loading]);
	
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
									<ServiceCard4 service={item} idx={idx} />
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

export default ServicesPrimary;
