"use client";
import { useState } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";

const Contact3 = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatusMessage({ type: "", text: "" });

		// Basic validation
		if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
			setStatusMessage({ type: "error", text: "Please fill in all required fields." });
			return;
		}

		setSubmitting(true);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: formData.name.trim(),
					email: formData.email.trim(),
					phone: formData.phone.trim(),
					subject: formData.subject.trim(),
					message: formData.message.trim(),
				}),
			});

			const data = await res.json();

			if (res.ok && data.success) {
				setStatusMessage({ type: "success", text: data.message || "Message sent successfully!" });
				setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
			} else {
				setStatusMessage({ type: "error", text: data.error || "Failed to send message. Please try again." });
			}
		} catch (error) {
			setStatusMessage({ type: "error", text: "Something went wrong. Please try again later." });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section className="tj-contact-section-2 section-bottom-gap">
			<div className="container">
				<div className="row">
					<div className="col-lg-6">
						<div className="contact-form wow fadeInUp" data-wow-delay=".1s">
							<h3 className="title">
								Feel Free to Get in Touch or Visit our Location.
							</h3>
							{statusMessage.text && (
								<div
									style={{
										padding: "12px 16px",
										marginBottom: "20px",
										borderRadius: "8px",
										fontSize: "14px",
										fontWeight: 500,
										background: statusMessage.type === "success" ? "#d4edda" : "#f8d7da",
										color: statusMessage.type === "success" ? "#155724" : "#721c24",
										border: `1px solid ${statusMessage.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
									}}
								>
									{statusMessage.text}
								</div>
							)}
							<form id="contact-form" onSubmit={handleSubmit}>
								<div className="row">
									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="text"
												name="name"
												placeholder="Full Name*"
												value={formData.name}
												onChange={handleChange}
												required
											/>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="email"
												name="email"
												placeholder="Email Address*"
												value={formData.email}
												onChange={handleChange}
												required
											/>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="tel"
												name="phone"
												placeholder="Phone number"
												value={formData.phone}
												onChange={(e) => {
													const val = e.target.value.replace(/[^0-9+\-() ]/g, "");
													setFormData((prev) => ({ ...prev, phone: val }));
												}}
											/>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="text"
												name="subject"
												placeholder="Subject*"
												value={formData.subject}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className="col-sm-12">
										<div className="form-input message-input">
											<textarea
												name="message"
												id="message"
												placeholder="Type message*"
												value={formData.message}
												onChange={handleChange}
												required
											></textarea>
										</div>
									</div>
									<div className="submit-btn">
										<ButtonPrimary
											type={"submit"}
											text={submitting ? "Sending..." : "Submit Now"}
											disabled={submitting}
										/>
									</div>
								</div>
							</form>
						</div>
					</div>
					<div className="col-lg-6">
						<div className="map-area wow fadeInUp" data-wow-delay=".3s">
							<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3705.4093019953766!2d72.12613309999999!3d21.7644145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f508ea757954b%3A0xb036ca1b9b996084!2sSparrow%20Softtech!5e0!3m2!1sen!2sin!4v1773061440932!5m2!1sen!2sin"></iframe>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact3;
