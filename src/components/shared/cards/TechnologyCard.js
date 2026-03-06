"use client";
import Image from "next/image";
import Link from "next/link";

const TechnologyCard = ({ technology, idx }) => {
	const { name, title, id, _id, img, description, category } = technology || {};
	const technologyId = id || _id?.toString();
	const displayTitle = title || name;
	const displayDesc = description || "";
	
	return (
		<div className="tj-service-card-4">
			<div className="service-card-image">
				<Link href={`/technology/${technologyId}`}>
					{img ? (
						<Image
							src={img}
							alt={displayTitle || "Technology"}
							width={370}
							height={270}
							style={{ height: "auto" }}
						/>
					) : (
						<div className="service-icon-placeholder">
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
