"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

/**
 * React hook to fetch team members from API
 * @returns {Object} { teamMembers, loading, error }
 */
export function useTeamMembers() {
	const [teamMembers, setTeamMembers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);

		api.get("/api/team")
			.then((response) => {
				if (response.data.success && Array.isArray(response.data.data)) {
					// Map MongoDB _id to id for compatibility
					const mappedTeamMembers = response.data.data.map((teamMember) => ({
						...teamMember,
						id: teamMember._id?.toString() || teamMember.id,
					}));
					setTeamMembers(mappedTeamMembers);
				} else {
					setTeamMembers([]);
				}
			})
			.catch((err) => {
				console.error("Error fetching team members:", err);
				setError(err.response?.data?.error || err.message || "Failed to fetch team members");
				setTeamMembers([]);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return { teamMembers, loading, error };
}
