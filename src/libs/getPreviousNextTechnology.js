const getPreviousNextTechnology = (items, currentSlug) => {
	const totalItems = items?.length;
	const currentIndex = items?.findIndex((item) => item.slug === currentSlug);
	const prevIndex = currentIndex > 0 ? currentIndex - 1 : -1;
	const nextIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : -1;
	const prevSlug = prevIndex >= 0 ? items[prevIndex]?.slug : null;
	const nextSlug = nextIndex >= 0 ? items[nextIndex]?.slug : null;
	const currentItem = items?.find((item) => item.slug === currentSlug);
	const isPrevItem = currentIndex > 0;
	const isNextItem = currentIndex < totalItems - 1;
	return { prevSlug, nextSlug, currentItem, isPrevItem, isNextItem };
};

export default getPreviousNextTechnology;
