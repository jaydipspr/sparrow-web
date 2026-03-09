"use client";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import Link from "next/link";
import { useEffect, useState } from "react";

const TechnologyDropdownTeam = () => {
	const { teamMembers: apiTeamMembers, loading } = useTeamMembers();
	const [teamMembers, setTeamMembers] = useState([]);

	useEffect(() => {
		if (!loading && Array.isArray(apiTeamMembers) && apiTeamMembers.length > 0) {
			const mappedTeamMembers = apiTeamMembers.map((teamMember) => ({
				...teamMember,
				id: teamMember._id?.toString() || teamMember.id,
				desig: teamMember.position || "", // Map position to desig for compatibility
			}));
			// Show first 3 team members for the dropdown
			setTeamMembers(mappedTeamMembers.slice(0, 3));
		} else {
			setTeamMembers([]);
		}
	}, [apiTeamMembers, loading]);

	if (loading || !teamMembers || teamMembers.length === 0) {
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
							{teamMembers.map((member, idx) => {
								const memberId = member.id || member._id?.toString();
								const designation = member.desig || member.position || "";
								return (
									<div
										key={memberId || idx}
										className="team-dropdown-item"
										// Removed Link - details page not implemented yet
									>
										<div className="team-dropdown-avatar">
											<img src={member.img || "/images/team/team-1.webp"} alt={member.name || "Team member"} />
										</div>
										<div className="team-dropdown-info">
											<h6 className="team-dropdown-name">{member.name}</h6>
											<span className="team-dropdown-role">{designation}</span>
										</div>
									</div>
								);
							})}
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
