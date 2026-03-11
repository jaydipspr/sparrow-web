import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import PrivacyPolicyPrimary from "@/components/sections/registration/PrivacyPolicyPrimary";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";

export const metadata = {
	title: "Privacy Policy - Sparrow Softtech",
	description: "Privacy Policy for Sparrow Softtech. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicy() {
	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<HeroInner
							title={"Privacy Policy"}
							text={"Privacy Policy"}
						/>
						<PrivacyPolicyPrimary />
						<Cta />
					</main>
					<Footer />
				</div>
			</div>
			<ClientWrapper />
		</div>
	);
}
