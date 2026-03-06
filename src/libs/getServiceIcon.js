import getNavItems from "./getNavItems";

/**
 * Get the icon for a service by matching its name with nav-items.json
 * @param {string} serviceName - The name of the service
 * @returns {string} - The icon class name (e.g., "tji-service-1")
 */
export function getServiceIcon(serviceName) {
	if (!serviceName) {
		return "tji-service-1"; // Default icon
	}

	const navItems = getNavItems();
	const servicesNav = navItems?.find((item) => item.name === "Services");
	const servicesSubmenu = servicesNav?.submenu || [];

	// Find matching service in nav-items by name (case-insensitive)
	const matchingNavService = servicesSubmenu.find(
		(navService) =>
			navService.name?.toLowerCase() === serviceName.toLowerCase()
	);

	// Return the icon from nav-items if found, otherwise default
	return matchingNavService?.icon || "tji-service-1";
}

export default getServiceIcon;
