import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import TechnologyDetailsMain from "@/components/layout/main/TechnologyDetailsMain";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import getTechnologies from "@/libs/getTechnologies";
import getATechnology from "@/libs/getATechnology";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const technology = getATechnology(slug);
	
	if (!technology || !technology.title) {
		return {
			title: "Technology - Sparrow Softtech | Innovation Unlimited",
			description: "Discover the technologies we use for innovative solutions.",
		};
	}

	return {
		title: `${technology.title} - Sparrow Softtech | Innovation Unlimited`,
		description: technology.shortDesc || technology.desc || `Learn more about ${technology.title} technology from Sparrow Softtech.`,
	};
}

export default async function TechnologyDetails({ params }) {
	const { slug } = await params;
	const items = getTechnologies();

	const isExistItem = items?.find((item) => item.slug === slug);
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
						<TechnologyDetailsMain currentSlug={slug} />
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
	const items = getTechnologies();
	return items?.map(({ slug }) => ({ slug }));
}
