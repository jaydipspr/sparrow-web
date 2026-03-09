"use client";
import Image from "next/image";
import Link from "next/link";

const TechnologyCard = ({ technology, idx }) => {
	const { name, title, id, _id, slug, img, description, category } = technology || {};
	const technologyId = slug || id || _id?.toString();
	const displayTitle = title || name;
	const displayDesc = description || "";
	
	return (
		<div className="tj-service-card-4">
			<div className="service-card-image" style={{ width: "100%", height: "250px", position: "relative", overflow: "hidden" }}>
				<Link href={`/technology/${technologyId}`} style={{ display: "block", width: "100%", height: "100%" }}>
					{img ? (
						<Image
							src={img}
							alt={displayTitle || "Technology"}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							style={{ objectFit: "cover" }}
						/>
					) : (
						<div className="service-icon-placeholder" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
							<i className="tji-service-1"></i>
						</div>
					)}
				</Link>
			</div>
			<div className="service-card-content">
				{category && (
					<span className="service-category">{category}</span>
				)}
				<h4 className="service-title">
					<Link href={`/technology/${technologyId}`}>{displayTitle}</Link>
				</h4>
				<p className="service-desc">{displayDesc}</p>
				<Link href={`/technology/${technologyId}`} className="service-link">
					Learn More <i className="tji-arrow-right"></i>
				</Link>
			</div>
		</div>
	);
};

export default TechnologyCard;
