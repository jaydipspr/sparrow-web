"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function AdminLoginPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setError("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		api.post("/api/admin/auth/login", formData)
			.then((response) => {
				if (response.data.success && response.data.data?.token) {
					// Store token in localStorage
					localStorage.setItem("adminToken", response.data.data.token);
					// Redirect to admin dashboard
					router.push("/admin");
				} else {
					throw new Error(response.data.error || "Login failed");
				}
			})
			.catch((err) => {
				console.error("Login error:", err);
				setError(err.response?.data?.error || err.message || "An error occurred during login");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div className="admin-login-wrapper">
			<div className="admin-login-container">
				<div className="admin-login-card">
					<div className="admin-login-header">
						<div className="admin-login-logo">
							<i className="fa-light fa-shield-check"></i>
							<h2>Admin Login</h2>
						</div>
						<p className="admin-login-subtitle">
							Sign in to access the admin panel
						</p>
					</div>

					<form onSubmit={handleSubmit} className="admin-login-form">
						{error && (
							<div className="admin-login-error">
								<i className="fa-light fa-circle-exclamation"></i>
								<span>{error}</span>
							</div>
						)}

						<div className="admin-login-field">
							<label htmlFor="email">Email Address</label>
							<div className="admin-login-input-wrapper">
								<i className="fa-light fa-envelope"></i>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="Enter your email"
									required
									disabled={loading}
								/>
							</div>
						</div>

						<div className="admin-login-field">
							<label htmlFor="password">Password</label>
							<div className="admin-login-input-wrapper">
								<i className="fa-light fa-lock"></i>
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Enter your password"
									required
									disabled={loading}
								/>
								<button
									type="button"
									className="admin-login-password-toggle"
									onClick={() => setShowPassword(!showPassword)}
									disabled={loading}
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									<i className={showPassword ? "fa-light fa-eye-slash" : "fa-light fa-eye"}></i>
								</button>
							</div>
						</div>

						<button
							type="submit"
							className="admin-login-submit"
							disabled={loading}
						>
							{loading ? (
								<>
									<i className="fa-light fa-spinner fa-spin"></i>
									<span>Signing in...</span>
								</>
							) : (
								<>
									<span>Sign In</span>
									<i className="fa-light fa-arrow-right"></i>
								</>
							)}
						</button>
					</form>

					<div className="admin-login-footer">
						<Link href="/" className="admin-login-back-link">
							<i className="fa-light fa-arrow-left"></i>
							<span>Back to Website</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
