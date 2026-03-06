import Link from "next/link";
import ButtonPrimary from "../buttons/ButtonPrimary";
import { getServiceIcon } from "@/libs/getServiceIcon";

const ServiceCard4 = ({ service, idx, lastItem }) => {
	const {
		title,
		name,
		description,
		desc,
		id,
		slug,
		totalProject,
		img2 = "/images/service/service-2.webp",
		svg,
		iconName,
	} = service || {};

	const displayTitle = name || title;
	const displayDesc = description || desc;
	// Use ID as primary, fallback to slug for backward compatibility
	const serviceId = id || service?._id?.toString() || slug;
	
	// Get icon from nav-items.json based on service name, fallback to iconName or default
	const serviceIcon = getServiceIcon(name) || iconName || "tji-service-1";

	return (
		<div className="service-item style-4">
			<div className="service-icon">
				<i className={serviceIcon}></i>
			</div>
			<div className="service-content">
				<h4 className="title">
					<Link href={`/services/${serviceId}`}>{displayTitle}</Link>
				</h4>
				<p className="desc">{displayDesc}</p>
				<ButtonPrimary
					text={"Learn More"}
					url={`/services/${serviceId}`}
					isTextBtn={true}
				/>
			</div>
		</div>
	);
};

export default ServiceCard4;
