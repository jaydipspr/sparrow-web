"use client";
import Image from "next/image";
import Link from "next/link";

const TechnologyCard = ({ technology, idx }) => {
	const { title, shortTitle, slug, img, iconName, shortDesc, category } = technology || {};
	return (
		<div className="tj-service-card-4">
			<div className="service-card-image">
				<Link href={`/technology/${slug}`}>
					{img ? (
						<Image
							src={img}
							alt={title || "Technology"}
							width={370}
							height={270}
							style={{ height: "auto" }}
						/>
					) : (
						<div className="service-icon-placeholder">
							<i className={iconName || "tji-service-1"}></i>
						</div>
					)}
				</Link>
			</div>
			<div className="service-card-content">
				{category && (
					<span className="service-category">{category}</span>
				)}
				<h4 className="service-title">
					<Link href={`/technology/${slug}`}>{shortTitle || title}</Link>
				</h4>
				<p className="service-desc">{shortDesc}</p>
				<Link href={`/technology/${slug}`} className="service-link">
					Learn More <i className="tji-arrow-right"></i>
				</Link>
			</div>
		</div>
	);
};

export default TechnologyCard;
