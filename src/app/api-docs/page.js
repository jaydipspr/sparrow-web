"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocs() {
	const [spec, setSpec] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch the Swagger spec from an API route
		fetch("/api/swagger.json")
			.then((res) => res.json())
			.then((data) => {
				setSpec(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error loading Swagger spec:", err);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div style={{ padding: "40px", textAlign: "center" }}>
				<p>Loading API documentation...</p>
			</div>
		);
	}

	if (!spec) {
		return (
			<div style={{ padding: "40px", textAlign: "center" }}>
				<p>Failed to load API documentation.</p>
			</div>
		);
	}

	return (
		<div style={{ padding: "20px" }}>
			<SwaggerUI spec={spec} />
		</div>
	);
}
