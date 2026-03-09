import Image from "next/image";
import Link from "next/link";

const PortfolioCard3 = ({ portfolio }) => {
	const {
		name,
		title = "Event Management Platform",
		img,
		img3 = "/images/project/project-6.webp",
		shortDesc,
		id,
		_id,
		dataFilter,
		category = "Connect",
	} = portfolio ? portfolio : {};

	const { slug } = portfolio || {};
	const portfolioId = slug || _id || id;
	const displayTitle = name || title;
	const displayImg = img || img3;

	return (
		<div className="project-item">
			<div className="project-img" style={{ width: "100%", height: "300px", position: "relative", overflow: "hidden" }}>
				<Image
					src={displayImg}
					alt={displayTitle}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					style={{ objectFit: "cover" }}
				/>
			</div>
			<div className="project-content">
				<span className="categories">
					<Link href={`/portfolios/${portfolioId}`}>{category}</Link>
				</span>
				<div className="project-text">
					<h4 className="title">
						<Link href={`/portfolios/${portfolioId}`}>{displayTitle}</Link>
					</h4>
					<Link className="project-btn" href={`/portfolios/${portfolioId}`}>
						<i className="tji-arrow-right-big"></i>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PortfolioCard3;
