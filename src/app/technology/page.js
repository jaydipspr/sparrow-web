import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import TechnologyPrimary from "@/components/sections/technology/TechnologyPrimary";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";

export const metadata = {
	title: "Technology - Sparrow Softtech | Innovation Unlimited",
	description: "Discover the technologies we use including React.js, Node.js, Flutter, Python, JavaScript, and more. Expert solutions in Web Development, Application Development, and Backend & Database.",
};

export default function Technology() {
	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<HeroInner title={"Technology"} text={"Our Technologies"} />
						<TechnologyPrimary />
						<Cta />
					</main>
					<Footer />
				</div>
			</div>
			<ClientWrapper />
		</div>
	);
}
