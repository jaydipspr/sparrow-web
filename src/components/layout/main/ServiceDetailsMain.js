import HeroInner from "@/components/sections/hero/HeroInner";
import ServicesDetailsPrimary from "@/components/sections/services/ServicesDetailsPrimary";
import { getAllServicesFromAPI } from "@/libs/getALlServices";

const ServiceDetailsMain = async ({ service }) => {
	// Fetch all services for navigation
	const items = await getAllServicesFromAPI();
	
	// Serialize service to plain object (already done in getServiceBySlug, but ensure it's plain)
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
	
	// Find current service index for prev/next navigation (using ID)
	const currentServiceId = currentItem.id;
	const currentIndex = items.findIndex((item) => 
		item.id === currentServiceId
	);
	
	const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
	const nextItem = currentIndex < items.length - 1 && currentIndex >= 0 ? items[currentIndex + 1] : null;
	
	// Use ID for navigation links (primary), fallback to slug for backward compatibility
	const prevId = prevItem?.id || prevItem?.slug;
	const nextId = nextItem?.id || nextItem?.slug;
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
					currentId: currentItem.id || currentItem.slug,
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
