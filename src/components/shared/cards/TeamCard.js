import Image from "next/image";

const TeamCard = ({ teamMember }) => {
	const {
		id,
		name,
		desig,
		position,
		img = "/images/team/team-1.webp",
	} = teamMember || {};
	// Use position if desig is not available (for API data)
	const designation = desig || position || "";
	return (
		<div className="team-item left-swipe">
			<div className="team-img">
				<div className="team-img-inner">
					<Image
						src={img}
						alt={name || "Team member"}
						width={308}
						height={375}
						style={{
							width: "100%",
							height: "375px",
							objectFit: "cover",
						}}
					/>
				</div>
			</div>
			<div className="team-content">
				<h4 className="title">
					{name}
					{/* Removed Link - details page not implemented yet */}
				</h4>
				<span className="designation">{designation}</span>
			</div>
		</div>
	);
};

export default TeamCard;
