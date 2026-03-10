const CareerCulture = () => {
	const culturePoints = [
		"At Sparrow Softtech our professionally skilled teams are the foundation of our organization with our 8+ years of experience backed with an 30+ mindful team, we offer proficient software development services globally.",
		"We believe in keeping a transparent approach for all the employees.",
		"We Discuss, We Explore, We Photograph, We Work, We Create, We Play.",
		"We Grind Together, We Support Each Other, We Work Together, We Fail Sometimes, But Survive Together.",
		"When We Travel Along, We recharge ourselves, We build stronger bonds, and better understandings!",
		"We believe in Vision, We believe in Harmony, We are on A Mission to provide Out-of-the-Box Solutions!",
		"We are Sparrow Softtech...!",
	];

	return (
		<section className="tj-career-culture-section section-gap">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading text-center">
							<span className="sub-title wow fadeInUp" data-wow-delay=".1s">
								<i className="tji-box"></i>Join Us
							</span>
							<h2 className="sec-title title-anim wow fadeInUp" data-wow-delay=".2s">
								Work we done is better than perfect so the door is Open for{" "}
								<span>Big Thinkers</span>
							</h2>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-lg-10">
						<div className="culture-content wow fadeInUp" data-wow-delay=".3s">
							{culturePoints.map((point, idx) => (
								<div key={idx} className="culture-item">
									<span className="culture-icon">
										➤
									</span>
									<p>{point}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CareerCulture;
