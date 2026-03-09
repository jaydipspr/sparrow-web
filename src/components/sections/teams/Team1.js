"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import TeamCard from "@/components/shared/cards/TeamCard";
import Paginations from "@/components/shared/others/Paginations";
import usePagination from "@/hooks/usePagination";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useEffect, useState } from "react";

const Team1 = ({ type }) => {
	const { teamMembers: apiTeamMembers, loading, error } = useTeamMembers();
	const [items, setItems] = useState([]);
	const limit = type === 2 ? 8 : 4;

	useEffect(() => {
		if (!loading) {
			if (Array.isArray(apiTeamMembers) && apiTeamMembers.length > 0) {
				const mappedTeamMembers = apiTeamMembers.map((teamMember) => ({
					...teamMember,
					id: teamMember._id?.toString() || teamMember.id,
					desig: teamMember.position || "", // Map position to desig for compatibility
				}));
				setItems(mappedTeamMembers);
			} else {
				setItems([]);
			}
		}
	}, [apiTeamMembers, loading]);
	// get pagination details
	const {
		currentItems,
		currentpage,
		setCurrentpage,
		paginationItems,
		currentPaginationItems,
		totalPages,
		handleCurrentPage,
		firstItem,
		lastItem,
	} = usePagination(items, limit);
	const totalItems = items?.length;
	const totalItemsToShow = currentItems?.length;

	if (loading) {
		return (
			<section
				className={` ${
					type === 2
						? "tj-team-section section-gap"
						: type === 3
						? "tj-team-section-3 section-gap section-gap-x"
						: "tj-team-section section-separator"
				}`}
			>
				<div className="container">
					<div className="admin-loading">
						<i className="fa-light fa-spinner fa-spin"></i>
						<span>Loading team members...</span>
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section
				className={` ${
					type === 2
						? "tj-team-section section-gap"
						: type === 3
						? "tj-team-section-3 section-gap section-gap-x"
						: "tj-team-section section-separator"
				}`}
			>
				<div className="container">
					<div className="admin-alert admin-alert-error">
						<i className="fa-light fa-circle-exclamation"></i>
						<span>Error: {error}</span>
					</div>
				</div>
			</section>
		);
	}

	if (items.length === 0) {
		return (
			<section
				className={` ${
					type === 2
						? "tj-team-section section-gap"
						: type === 3
						? "tj-team-section-3 section-gap section-gap-x"
						: "tj-team-section section-separator"
				}`}
			>
				<div className="container">
					<div className="admin-empty-state">
						<i className="fa-light fa-inbox"></i>
						<p>No team members found.</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			className={` ${
				type === 2
					? "tj-team-section section-gap"
					: type === 3
					? "tj-team-section-3 section-gap section-gap-x"
					: "tj-team-section section-separator"
			}`}
		>
			<div className="container">
				{type === 2 ? (
					""
				) : (
					<div className="row">
						<div className="col-12">
							<div
								className={`sec-heading text-center  ${
									type === 3 ? "" : "style-2"
								}`}
							>
								<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
									{type === 3 ? <i className="tji-box"></i> : ""}
									Meet Our Team
								</span>
								{type === 3 ? (
									<h2 className="sec-title title-anim">
										Success <span>Stories</span> Fuel our Innovation.
									</h2>
								) : (
									<h2
										className={`sec-title ${
											type === 2 ? "title-anim" : "text-anim"
										}`}
									>
										People Behind <span>Bexon.</span>
									</h2>
								)}
							</div>
						</div>
					</div>
				)}

				<div className="row leftSwipeWrap">
					{currentItems?.length
						? currentItems.map((item, idx) => (
								<div key={item.id || item._id || idx} className="col-lg-3 col-sm-6">
									<TeamCard teamMember={item} />
								</div>
						  ))
						: ""}
				</div>
				{type === 2 ? (
					""
				) : (
					<div
						className="team-btn d-md-none mt-40 text-center wow fadeInUp"
						data-wow-delay="0.9s"
					>
						<ButtonPrimary text={"More member"} url={"/team"} />
					</div>
				)}
				{type === 2 && totalItemsToShow < totalItems ? (
					<Paginations
						paginationDetails={{
							currentItems,
							currentpage,
							setCurrentpage,
							paginationItems,
							currentPaginationItems,
							totalPages,
							handleCurrentPage,
							firstItem,
							lastItem,
						}}
					/>
				) : (
					""
				)}
			</div>
		</section>
	);
};

export default Team1;
