"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminCatchAll() {
	const router = useRouter();

	return (
		<div style={{ 
			minHeight: "100vh", 
			display: "flex", 
			alignItems: "center", 
			justifyContent: "center",
			backgroundColor: "#f5f5f5",
			padding: "20px"
		}}>
			<div style={{ 
				maxWidth: "600px", 
				width: "100%",
				backgroundColor: "#ffffff",
				borderRadius: "8px",
				boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
				textAlign: "center",
				padding: "60px 40px"
			}}>
				<div style={{ marginBottom: "30px" }}>
					<i className="fa-light fa-triangle-exclamation" style={{ fontSize: "80px", color: "var(--tj-color-theme-primary)", marginBottom: "20px" }}></i>
				</div>
				<h1 style={{ fontSize: "72px", fontWeight: 700, color: "var(--tj-color-heading-primary)", margin: "0 0 20px 0", lineHeight: 1 }}>
					404
				</h1>
				<h2 style={{ fontSize: "28px", fontWeight: 600, color: "var(--tj-color-heading-primary)", margin: "0 0 15px 0" }}>
					Page Not Found
				</h2>
				<p style={{ fontSize: "16px", color: "var(--tj-color-text-body-3)", margin: "0 0 40px 0", lineHeight: 1.6 }}>
					The page you are looking for doesn't exist or has been moved.
				</p>
				<div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
					<Link href="/admin" className="admin-btn admin-btn-primary" style={{ textDecoration: "none" }}>
						<i className="fa-light fa-house"></i>
						<span>Go to Dashboard</span>
					</Link>
					<button
						type="button"
						className="admin-btn admin-btn-secondary"
						onClick={() => router.back()}
					>
						<i className="fa-light fa-arrow-left"></i>
						<span>Go Back</span>
					</button>
				</div>
			</div>
		</div>
	);
}
