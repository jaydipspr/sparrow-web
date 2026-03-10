import Image from "next/image";
import Link from "next/link";

const TechnologyCard = ({ technology }) => {
	const { name, title, id, _id, slug, img, category } = technology || {};
	const technologyId = slug || _id || id;
	const displayTitle = title || name;
	const displayImg = img;

	return (
		<div className="project-item">
			<div className="project-img" style={{ width: "100%", height: "300px", position: "relative", overflow: "hidden" }}>
				{displayImg ? (
					<Image
						src={displayImg}
						alt={displayTitle}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						style={{ objectFit: "cover" }}
					/>
				) : (
					<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0" }}>
						<i className="tji-service-1" style={{ fontSize: "48px", color: "#ccc" }}></i>
					</div>
				)}
			</div>
			<div className="project-content">
				{category && (
					<span className="categories">
						<Link href={`/technology/${technologyId}`}>{category}</Link>
					</span>
				)}
				<div className="project-text">
					<h4 className="title">
						<Link href={`/technology/${technologyId}`}>{displayTitle}</Link>
					</h4>
					<Link className="project-btn" href={`/technology/${technologyId}`}>
						<i className="tji-arrow-right-big"></i>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default TechnologyCard;
