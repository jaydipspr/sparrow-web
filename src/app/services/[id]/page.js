import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import ServiceDetailsMain from "@/components/layout/main/ServiceDetailsMain";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { getAllServicesFromAPI, getServiceBySlug } from "@/libs/getALlServices";
import { notFound } from "next/navigation";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
	const { id } = await params;
	// Try to fetch from API first (by slug or id)
	const service = await getServiceBySlug(id);
	
	if (!service || !service.title) {
		return {
			title: "Service - Sparrow Softtech | Innovation Unlimited",
			description: "Explore our comprehensive technology services.",
		};
	}

	return {
		title: `${service.title} - Sparrow Softtech | Innovation Unlimited`,
		description: service.description || `Learn more about ${service.title} services from Sparrow Softtech.`,
	};
}

export default async function ServiceDetails({ params }) {
	const { id } = await params;

	// Fetch service from API by slug or id
	const service = await getServiceBySlug(id);
	
	if (!service) {
		notFound();
	}

	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<ServiceDetailsMain service={service} />
						<Cta />
					</main>
					<Footer />
				</div>
			</div>

			<ClientWrapper />
		</div>
	);
}

export async function generateStaticParams() {
	try {
		const items = await getAllServicesFromAPI();
		// Use ID as primary, fallback to slug for backward compatibility
		return items?.map(({ id, _id, slug }) => ({ 
			id: id?.toString() || _id?.toString() || slug 
		})) || [];
	} catch (error) {
		console.error("Error generating static params:", error);
		return [];
	}
}
