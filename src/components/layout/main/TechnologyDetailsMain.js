import HeroInner from "@/components/sections/hero/HeroInner";
import TechnologyDetailsPrimary from "@/components/sections/technology/TechnologyDetailsPrimary";
import getTechnologies from "@/libs/getTechnologies";
import getPreviousNextTechnology from "@/libs/getPreviousNextTechnology";

const TechnologyDetailsMain = ({ currentSlug }) => {
	const items = getTechnologies();
	const { prevSlug, nextSlug, currentItem, isPrevItem, isNextItem } =
		getPreviousNextTechnology(items, currentSlug);
	const { title } = currentItem || {};
	return (
		<div>
			<HeroInner
				title={title ? title : "Technology Details"}
				text={title ? title : "Technology Details"}
				breadcrums={[{ name: "Technology", path: "/technology" }]}
			/>
			<TechnologyDetailsPrimary
				option={{
					currentItem,
					items,
					currentSlug,
					prevSlug,
					nextSlug,
					isPrevItem,
					isNextItem,
				}}
			/>
		</div>
	);
};

export default TechnologyDetailsMain;
