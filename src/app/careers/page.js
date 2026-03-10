import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import CareerApplicationForm from "@/components/sections/careers/CareerApplicationForm";
import CareerCulture from "@/components/sections/careers/CareerCulture";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";

export const metadata = {
	title: "Career - Sparrow Softtech | Innovation Unlimited",
	description: "Join Sparrow Softtech! We are looking for exceptionally bright individuals. Hard work and eagerness for growth is what defines you? Let Sparrow Softtech be your launch pad!",
};

export default function Careers() {
	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<HeroInner title={"Career"} text={"Work we done is better than perfect so the door is Open for Big Thinkers"} />
						<CareerCulture />
						<CareerApplicationForm />
						<Cta />
					</main>
					<Footer />
				</div>
			</div>

			<ClientWrapper />
		</div>
	);
}
