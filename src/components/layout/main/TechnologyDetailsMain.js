import HeroInner from "@/components/sections/hero/HeroInner";
import TechnologyDetailsPrimary from "@/components/sections/technology/TechnologyDetailsPrimary";
import TechnologyTeamSection from "@/components/sections/technology/TechnologyTeamSection";
import { getAllTechnologiesFromAPI } from "@/libs/getAllTechnologies";

const TechnologyDetailsMain = async ({ technology }) => {
	// Fetch all technologies for navigation
	const items = await getAllTechnologiesFromAPI();
	
	// Serialize technology to plain object (already done in getTechnologyById, but ensure it's plain)
	const currentItem = {
		_id: technology._id?.toString() || technology._id,
		id: technology._id?.toString() || technology.id,
		name: technology.name,
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
	
	// Find current technology index for prev/next navigation (using ID)
	const currentTechnologyId = currentItem.id;
	const currentIndex = items.findIndex((item) => 
		item.id === currentTechnologyId
	);
	
	const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
	const nextItem = currentIndex < items.length - 1 && currentIndex >= 0 ? items[currentIndex + 1] : null;
	
	// Use ID for navigation links
	const prevId = prevItem?.id;
	const nextId = nextItem?.id;
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
					currentId: currentTechnologyId,
					prevId,
					nextId,
					isPrevItem,
					isNextItem,
				}}
			/>
			<TechnologyTeamSection />
		</div>
	);
};

export default TechnologyDetailsMain;
