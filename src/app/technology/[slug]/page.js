import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import TechnologyDetailsMain from "@/components/layout/main/TechnologyDetailsMain";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { getTechnologyById } from "@/libs/getAllTechnologies";
import { notFound } from "next/navigation";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const technology = await getTechnologyById(slug);
	
	if (!technology || !technology.title) {
		return {
			title: "Technology - Sparrow Softtech | Innovation Unlimited",
			description: "Discover the technologies we use for innovative solutions.",
		};
	}

	return {
		title: `${technology.title || technology.name} - Sparrow Softtech | Innovation Unlimited`,
		description: technology.description || `Learn more about ${technology.name} technology from Sparrow Softtech.`,
	};
}

export default async function TechnologyDetails({ params }) {
	const { slug } = await params;
	const technology = await getTechnologyById(slug);

	if (!technology) {
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
						<TechnologyDetailsMain technology={technology} />
						<Cta />
					</main>
					<Footer />
				</div>
			</div>

			<ClientWrapper />
		</div>
	);
}
