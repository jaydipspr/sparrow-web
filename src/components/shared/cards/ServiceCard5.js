import modifyNumber from "@/libs/modifyNumber";
import Link from "next/link";
import ButtonPrimary from "../buttons/ButtonPrimary";
import { getServiceIcon } from "@/libs/getServiceIcon";

const ServiceCard5 = ({ service, idx, lastItemIdx }) => {
	const {
		name,
		title,
		description,
		desc,
		id,
		slug,
		totalProject,
		img3 = "/images/service/service-6.webp",
		svg,
		iconName,
	} = service || {};

	const displayTitle = name || title;
	const displayDesc = description || desc;
	const serviceLink = slug || id || service?._id?.toString();
	const serviceIcon = getServiceIcon(name) || iconName || "tji-service-1";

	return (
		<div
			className={`service-item style-5 ${
				idx !== lastItemIdx ? "service-stack" : ""
			}`}
		>
			<div className="service-content-area">
				<div className="service-icon">
					<i className={serviceIcon}></i>
				</div>
				<div className="service-content">
					<span className="no">{modifyNumber(idx + 1)}.</span>
					<h3 className="title">
						<Link href={`/services/${serviceLink}`}>{displayTitle}</Link>
					</h3>
					<p className="desc">{displayDesc}</p>
					<ButtonPrimary text={"Learn More"} url={`/services/${serviceLink}`} />
				</div>
			</div>
			<div className="service-img">
				<img src={service?.img || img3} alt={displayTitle || ""} />
			</div>
		</div>
	);
};

export default ServiceCard5;
