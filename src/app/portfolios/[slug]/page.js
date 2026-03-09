import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import PortfolioDetailsMain from "@/components/layout/main/PortfolioDetailsMain";
import Cta from "@/components/sections/cta/Cta";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { getAllPortfoliosFromAPI, getPortfolioById } from "@/libs/getAllPortfolios";
import { notFound } from "next/navigation";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const portfolio = await getPortfolioById(slug);

	if (!portfolio || !portfolio.name) {
		return {
			title: "Portfolio - Sparrow Softtech | Innovation Unlimited",
			description: "Explore our portfolio of successful projects.",
		};
	}

	return {
		title: `${portfolio.name} - Portfolio | Sparrow Softtech | Innovation Unlimited`,
		description: portfolio.description || `View ${portfolio.name} project from Sparrow Softtech portfolio.`,
	};
}

export default async function PortfolioDetails({ params }) {
	const { slug } = await params;

	// Fetch portfolio from API by slug or id
	const portfolio = await getPortfolioById(slug);

	if (!portfolio) {
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
						<PortfolioDetailsMain portfolio={portfolio} />
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
		const items = await getAllPortfoliosFromAPI();
		return items?.map(({ slug, id, _id }) => ({
			slug: slug || id?.toString() || _id?.toString(),
		})) || [];
	} catch (error) {
		console.error("Error generating static params:", error);
		return [];
	}
}
