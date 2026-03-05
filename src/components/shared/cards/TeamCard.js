import Link from "next/link";

const TeamCard = ({ teamMember }) => {
	const {
		id,
		name,
		desig,
		img = "/images/team/team-1.webp",
	} = teamMember || {};
	return (
		<div className="team-item left-swipe">
			<div className="team-img">
				<div className="team-img-inner">
					<img src={img} alt="" />
				</div>
			</div>
			<div className="team-content">
				<h4 className="title">
					<Link href={`/team/${id}`}>{name}</Link>
				</h4>
				<span className="designation">{desig}</span>
			</div>
		</div>
	);
};

export default TeamCard;
