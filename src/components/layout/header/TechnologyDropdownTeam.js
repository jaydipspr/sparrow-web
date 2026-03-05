"use client";
import TeamCard from "@/components/shared/cards/TeamCard";
import getTeamMembers from "@/libs/getTeamMembers";
import Link from "next/link";

const TechnologyDropdownTeam = () => {
	const items = getTeamMembers();
	// Show first 3 team members for the dropdown
	const teamMembers = items?.slice(0, 3);

	if (!teamMembers || teamMembers.length === 0) {
		return null;
	}

	return (
		<div className="col-12 col-lg-3 mega-menu-pages-single">
			<div className="mega-menu-pages-single-inner">
				<div className="feature-box">
					<div className="feature-content">
						<h2 className="title">Our Team</h2>
						<span>Expert Professionals</span>
						<div className="team-dropdown-preview">
							{teamMembers.map((member, idx) => (
								<Link
									key={member.id || idx}
									href={`/team/${member.id}`}
									className="team-dropdown-item"
								>
									<div className="team-dropdown-avatar">
										<img src={member.img || "/images/team/team-1.webp"} alt={member.name} />
									</div>
									<div className="team-dropdown-info">
										<h6 className="team-dropdown-name">{member.name}</h6>
										<span className="team-dropdown-role">{member.desig}</span>
									</div>
								</Link>
							))}
						</div>
						<Link className="read-more feature-contact" href="/team">
							<i className="tji-arrow-right"></i>
							<span>View All Team</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TechnologyDropdownTeam;
