import { Mona_Sans } from "next/font/google";
import "react-range-slider-input/dist/style.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "./assets/css/animate.min.css";
import "./assets/css/bexon-icons.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/font-awesome-pro.min.css";
import "./assets/css/glightbox.min.css";
import "./assets/css/meanmenu.css";
import "./assets/css/nice-select2.css";
import "./assets/css/odometer-theme-default.css";
import "./globals.scss";
import TawkToWidget from "@/components/shared/TawkToWidget";
import PageViewTracker from "@/components/shared/PageViewTracker";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const bodyFont = Mona_Sans({
	variable: "--tj-ff-body",
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
	display: "swap",
});
const headingFont = Mona_Sans({
	variable: "--tj-ff-heading",
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
	display: "swap",
});

export const metadata = {
	title: "Sparrow Softtech - Innovation Unlimited",
	description: "Sparrow Softtech - Empowering Your Business with Smart Solutions. We provide innovative technology solutions including AI, Automation, Robotics, Software Development, and more.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" data-scroll-behavior="smooth" dir="ltr">
		<body className={`${bodyFont.variable} ${headingFont.variable}`} suppressHydrationWarning>
			<PageViewTracker />
			{children}
			<TawkToWidget />
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</body>
		</html>
	);
}
