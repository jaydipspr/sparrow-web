"use client";
import { useEffect } from "react";
import TeamCard from "@/components/shared/cards/TeamCard";
import getTeamMembers from "@/libs/getTeamMembers";
import Link from "next/link";

const TechnologyTeamSection = () => {
	const items = getTeamMembers();
	// Show first 4 team members for the technology
	const teamMembers = items?.slice(0, 4);

	// Debug: Check if data is loaded
	useEffect(() => {
		console.log("TechnologyTeamSection - Component mounted");
		console.log("TechnologyTeamSection - items:", items);
		console.log("TechnologyTeamSection - teamMembers:", teamMembers);
	}, [items, teamMembers]);

	if (!items || items.length === 0) {
		console.warn("No team members found");
		return (
			<section className="tj-team-section section-gap">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<p>No team members available</p>
						</div>
					</div>
				</div>
			</section>
		);
	}

	if (!teamMembers || teamMembers.length === 0) {
		console.warn("No team members to display");
		return (
			<section className="tj-team-section section-gap">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<p>No team members to display</p>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="tj-team-section section-gap" style={{ paddingTop: "120px", paddingBottom: "90px" }}>
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading style-2 text-center">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								Our Team
							</span>
							<h2 className="sec-title text-anim">
								Meet Our <span>Expert Team</span>
							</h2>
							<p className="sec-text wow fadeInUp" data-wow-delay=".4s">
								Our skilled professionals are dedicated to delivering exceptional results
							</p>
						</div>
					</div>
				</div>

				<div className="row leftSwipeWrap">
					{teamMembers && teamMembers.length > 0 ? (
						teamMembers.map((item, idx) => (
							<div key={item.id || idx} className="col-lg-3 col-sm-6">
								<TeamCard teamMember={item} />
							</div>
						))
					) : (
						<div className="col-12">
							<p>No team members to display</p>
						</div>
					)}
				</div>

				<div className="row">
					<div className="col-12">
						<div className="team-btn mt-40 text-center wow fadeInUp" data-wow-delay="0.9s">
							<Link href="/team" className="tj-primary-btn">
								<span className="btn-text">
									<span>View All Team Members</span>
								</span>
								<span className="btn-icon">
									<i className="tji-arrow-right"></i>
								</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TechnologyTeamSection;
