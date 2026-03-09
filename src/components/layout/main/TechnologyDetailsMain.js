import HeroInner from "@/components/sections/hero/HeroInner";
import TechnologyDetailsPrimary from "@/components/sections/technology/TechnologyDetailsPrimary";

import { getAllTechnologiesFromAPI } from "@/libs/getAllTechnologies";
import { getPortfoliosByTechnology } from "@/libs/getAllPortfolios";

const TechnologyDetailsMain = async ({ technology }) => {
	// Fetch all technologies for navigation and related portfolios in parallel
	const [items, relatedPortfolios] = await Promise.all([
		getAllTechnologiesFromAPI(),
		getPortfoliosByTechnology(technology.id || technology._id, technology.slug),
	]);
	
	// Serialize technology to plain object
	const currentItem = {
		_id: technology._id?.toString() || technology._id,
		id: technology._id?.toString() || technology.id,
		name: technology.name,
		slug: technology.slug,
		category: technology.category,
		title: technology.title || technology.name,
		titleLarge: technology.title || technology.name,
		img: technology.img,
		desc: technology.description,
		desc1: "",
		desc2: "",
		desc3: "",
		features: Array.isArray(technology.features) ? [...technology.features] : [],
		isActive: Boolean(technology.isActive),
		createdAt: technology.createdAt ? new Date(technology.createdAt).toISOString() : null,
		updatedAt: technology.updatedAt ? new Date(technology.updatedAt).toISOString() : null,
	};
	
	// Find current technology index for prev/next navigation
	const currentTechnologyId = currentItem.id;
	const currentIndex = items.findIndex((item) => 
		item.id === currentTechnologyId
	);
	
	const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
	const nextItem = currentIndex < items.length - 1 && currentIndex >= 0 ? items[currentIndex + 1] : null;
	
	// Use slug for navigation links, fallback to id
	const prevId = prevItem?.slug || prevItem?.id;
	const nextId = nextItem?.slug || nextItem?.id;
	const isPrevItem = !!prevItem;
	const isNextItem = !!nextItem;
	
	const { title, name } = currentItem || {};
	const displayName = name || title || "Technology Details";
	
	return (
		<div>
			<HeroInner
				title={displayName}
				text={displayName}
				breadcrums={[{ name: "Technology", path: "/technology" }]}
			/>
			<TechnologyDetailsPrimary
				option={{
					currentItem,
					items,
					currentId: currentItem.slug || currentItem.id,
					prevId,
					nextId,
					isPrevItem,
					isNextItem,
					relatedPortfolios,
				}}
			/>
		</div>
	);
};

export default TechnologyDetailsMain;
