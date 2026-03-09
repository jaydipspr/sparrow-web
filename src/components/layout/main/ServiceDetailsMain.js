import HeroInner from "@/components/sections/hero/HeroInner";
import ServicesDetailsPrimary from "@/components/sections/services/ServicesDetailsPrimary";
import { getAllServicesFromAPI } from "@/libs/getALlServices";

const ServiceDetailsMain = async ({ service }) => {
	// Fetch all services for navigation
	const items = await getAllServicesFromAPI();
	
	// Serialize service to plain object
	const currentItem = {
		_id: service._id?.toString() || service._id,
		id: service._id?.toString() || service.id,
		name: service.name,
		title: service.title,
		slug: service.slug,
		img: service.img,
		description: service.description,
		points: Array.isArray(service.points) ? [...service.points] : [],
		isActive: Boolean(service.isActive),
		createdAt: service.createdAt ? new Date(service.createdAt).toISOString() : null,
		updatedAt: service.updatedAt ? new Date(service.updatedAt).toISOString() : null,
	};
	
	// Find current service index for prev/next navigation
	const currentServiceId = currentItem.id;
	const currentIndex = items.findIndex((item) => 
		item.id === currentServiceId
	);
	
	const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
	const nextItem = currentIndex < items.length - 1 && currentIndex >= 0 ? items[currentIndex + 1] : null;
	
	// Use slug for navigation links, fallback to id
	const prevId = prevItem?.slug || prevItem?.id;
	const nextId = nextItem?.slug || nextItem?.id;
	const isPrevItem = !!prevItem;
	const isNextItem = !!nextItem;
	
	const { name, title } = currentItem || {};
	const displayTitle = title || name || "Service Details";
	const displayName = name || "Service";
	
	return (
		<div>
			<HeroInner
				title={displayName}
				text={displayName}
				breadcrums={[{ name: "Services", path: "/services" }]}
			/>
			<ServicesDetailsPrimary
				option={{
					currentItem,
					items,
					currentId: currentItem.slug || currentItem.id,
					prevId,
					nextId,
					isPrevItem,
					isNextItem,
				}}
			/>
		</div>
	);
};

export default ServiceDetailsMain;
