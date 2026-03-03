import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import ServiceDetailsMain from "@/components/layout/main/ServiceDetailsMain";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import getALlServices from "@/libs/getALlServices";
import getAService from "@/libs/getAService";
import { notFound } from "next/navigation";
const items = getALlServices();

export async function generateMetadata({ params }) {
	const { id } = await params;
	const service = getAService(id);
	
	if (!service || !service.title) {
		return {
			title: "Service - Sparrow Softtech | Innovation Unlimited",
			description: "Explore our comprehensive technology services.",
		};
	}

	return {
		title: `${service.title} - Sparrow Softtech | Innovation Unlimited`,
		description: service.shortDesc || service.desc || `Learn more about ${service.title} services from Sparrow Softtech.`,
	};
}

export default async function ServiceDetails({ params }) {
	const { id } = await params;

	const isExistItem = items?.find(({ id: id1 }) => id1 === parseInt(id));
	if (!isExistItem) {
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
						<ServiceDetailsMain currentItemId={parseInt(id)} />
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
	return items?.map(({ id }) => ({ id: id.toString() }));
}
