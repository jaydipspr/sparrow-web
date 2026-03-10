"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";

const FooterClient = () => {
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch services from API
		api.get("/api/services")
			.then((response) => {
				if (response.data.success) {
					const apiServices = response.data.data || [];
					setServices(apiServices.slice(0, 6));
				}
			})
			.catch((err) => {
				console.error("Error fetching services for footer:", err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const apiServices = services;
	const displayServices = apiServices?.slice(0, 6) || [];

	return (
		<footer className="tj-footer-section footer-1 section-gap-x">
			<div className="footer-main-area">
				<div className="container">
					<div className="row justify-content-between">
						<div className="col-xl-3 col-lg-4 col-md-6">
							<div className="footer-widget wow fadeInUp" data-wow-delay=".1s">
								<div className="footer-logo">
									<Link href="/">
										<img src="/images/logos/logo.webp" alt="Logos" />
									</Link>
								</div>
								<div className="footer-text">
									<p>
										Developing personalze our customer journeys to increase
										satisfaction & loyalty of our expansion.
									</p>
								</div>
								<div className="award-logo-area">
									<div className="award-logo">
										<img src="/images/footer/award-logo-1.webp" alt="" />
									</div>
									<div className="award-logo">
										<img src="/images/footer/award-logo-2.webp" alt="" />
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-lg-4 col-md-6">
							<div
								className="footer-widget widget-nav-menu wow fadeInUp"
								data-wow-delay=".3s"
							>
								<h5 className="title">Services</h5>
								<ul>
									{!loading && displayServices.length > 0
										? displayServices.map((service, idx) => {
												const serviceLink = service.slug || service._id?.toString() || service.id;
												return (
													<li key={serviceLink || idx}>
														<Link href={`/services/${serviceLink}`}>
															{service.name}
														</Link>
													</li>
												);
										  })
										: null}
									{!loading && apiServices && apiServices.length > 6 && (
										<li>
											<Link href="/services" className="view-more-link">
												View More <i className="tji-arrow-right"></i>
											</Link>
										</li>
									)}
								</ul>
							</div>
						</div>
						<div className="col-xl-2 col-lg-4 col-md-6">
							<div
								className="footer-widget widget-nav-menu wow fadeInUp"
								data-wow-delay=".5s"
							>
							<h5 className="title">Resources</h5>
							<ul>
								<li>
									<Link href="/contact">Contact us</Link>
								</li>
								<li>
									<Link href="/team">Team Member</Link>
								</li>
								<li>
									<Link href="/careers">
										Careers <span className="badge">New</span>
									</Link>
								</li>
								<li>
									<Link href="/technology">Technology</Link>
								</li>
								<li>
									<Link href="/portfolios">Portfolio</Link>
								</li>
								<li>
									<Link href="/products">Products</Link>
								</li>
								<li>
									<Link href="/blogs">Blog</Link>
								</li>
							</ul>
							</div>
						</div>
						<div className="col-xl-4 col-lg-5 col-md-6">
							<div
								className="footer-widget widget-subscribe wow fadeInUp"
								data-wow-delay=".7s"
							>
								<h3 className="title">Subscribe to Our Newsletter.</h3>
								<div className="subscribe-form">
									<form action="#">
										<input
											type="email"
											name="email"
											placeholder="Enter email"
										/>
										<button type="submit">
											<i className="tji-plane"></i>
										</button>
										<label htmlFor="agree">
											<input id="agree" type="checkbox" />
											Agree to our{" "}
											<Link href="/terms-and-conditions">
												Terms & Condition?
											</Link>
										</label>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="tj-copyright-area">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<div className="copyright-content-area">
								<div className="footer-contact">
									<ul>
										<li>
											<Link href="tel:10095447818">
												<span className="icon">
													<i className="tji-phone-2"></i>
												</span>
												<span className="text">+91 9409354326</span>
											</Link>
										</li>
										<li>
											<Link href="mailto:contact@sparrowsofttech.com">
												<span className="icon">
													<i className="tji-envelop-2"></i>
												</span>
												<span className="text">contact@sparrowsofttech.com</span>
											</Link>
										</li>
									</ul>
								</div>
								<div className="social-links">
									<ul>
										<li>
											<Link href="https://www.facebook.com/sparrowsofttech" target="_blank">
												<i className="fa-brands fa-facebook-f"></i>
											</Link>
										</li>
										<li>
											<Link href="https://www.instagram.com/sparrowsofttech?igsh=MWhyNjR2ODJubjRkYQ==" target="_blank">
												<i className="fa-brands fa-instagram"></i>
											</Link>
										</li>
										<li>
											<Link href="https://x.com/sparrowsofttech" target="_blank">
												<i className="fa-brands fa-x-twitter"></i>
											</Link>
										</li>
										<li>
											<Link href="https://www.youtube.com/channel/UC992i7AnX4XqgX0U9dewMEA" target="_blank">
												<i className="fa-brands fa-youtube"></i>
											</Link>
										</li>
										<li>
											<Link href="https://in.linkedin.com/company/sparrow-softtech" target="_blank">
												<i className="fa-brands fa-linkedin-in"></i>
											</Link>
										</li>
									</ul>
								</div>
								<div className="copyright-text">
									<p>
										&copy; 2025{" "}
										<Link
											href="https://themeforest.net/user/theme-junction/portfolio"
											target="_blank"
										>
											Sparrow Softtech
										</Link>{" "}
										All right reserved
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-shape-1">
				<img src="/images/shape/pattern-2.svg" alt="" />
			</div>
			<div className="bg-shape-2">
				<img src="/images/shape/pattern-3.svg" alt="" />
			</div>
		</footer>
	);
};

export default FooterClient;
