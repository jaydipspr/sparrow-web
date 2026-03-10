import Link from "next/link";

const HeaderTop = ({ type }) => {
	return (
		<div className="header-top">
			<div className="container-fluid">
				<div className="row">
					<div className="col-12">
						<div className="header-top-content">
							<p className="topbar-text">
								<i className="tji-excellence"></i>Recognized for Excellence{" "}
								<Link href="/contact">Join us Now</Link>
							</p>
							<div className="header-info">
								<div className="info-item">
									<span>
										<i className="tji-location"></i>
									</span>
									<Link href="#">Find a Location!</Link>
								</div>
								<div className="info-item">
									<span>
										<i className="tji-phone-3"></i>
									</span>
									<Link href="tel:+919409354326">+91 9409354326</Link>
								</div>
								<div className="info-item">
									<div className="social-links style-2">
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
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeaderTop;
