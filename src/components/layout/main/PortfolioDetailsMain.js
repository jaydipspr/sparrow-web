import HeroInner from "@/components/sections/hero/HeroInner";
import PortfolioDetailsPrimary from "@/components/sections/portfolios/PortfolioDetailsPrimary";
import { getAllPortfoliosFromAPI } from "@/libs/getAllPortfolios";

const PortfolioDetailsMain = async ({ portfolio }) => {
	// Fetch all portfolios for navigation
	const items = await getAllPortfoliosFromAPI();

	// Serialize portfolio to plain object
	const currentItem = {
		_id: portfolio._id?.toString() || portfolio._id,
		id: portfolio._id?.toString() || portfolio.id,
		name: portfolio.name,
		slug: portfolio.slug,
		title: portfolio.title,
		img: portfolio.img,
		description: portfolio.description,
		category: portfolio.category,
		keyHighlights: Array.isArray(portfolio.keyHighlights) ? [...portfolio.keyHighlights] : [],
		technology: Array.isArray(portfolio.technology) ? [...portfolio.technology] : [],
		projectLink: portfolio.projectLink,
		isActive: Boolean(portfolio.isActive),
		createdAt: portfolio.createdAt ? new Date(portfolio.createdAt).toISOString() : null,
		updatedAt: portfolio.updatedAt ? new Date(portfolio.updatedAt).toISOString() : null,
	};

	// Find current portfolio index for prev/next navigation
	const currentPortfolioId = currentItem.id;
	const currentIndex = items.findIndex((item) => item.id === currentPortfolioId);

	const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
	const nextItem = currentIndex < items.length - 1 && currentIndex >= 0 ? items[currentIndex + 1] : null;

	// Use slug for navigation links, fallback to id
	const prevId = prevItem?.slug || prevItem?.id;
	const nextId = nextItem?.slug || nextItem?.id;
	const isPrevItem = !!prevItem;
	const isNextItem = !!nextItem;

	const displayName = currentItem.name || currentItem.title || "Portfolio Details";

	return (
		<div>
			<HeroInner
				title={displayName}
				text={displayName}
				breadcrums={[{ name: "Portfolio", path: "/portfolios" }]}
				noNeedTitleAnim={true}
			/>
			<PortfolioDetailsPrimary
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

export default PortfolioDetailsMain;
