"use client";
import { useState } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";

const CareerApplicationForm = () => {
	const [formData, setFormData] = useState({
		name: "",
		address: "",
		designation: "",
		experience: "",
		email: "",
		phone: "",
		resume: null,
	});
	const [submitting, setSubmitting] = useState(false);
	const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData((prev) => ({ ...prev, resume: file }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatusMessage({ type: "", text: "" });

		// Validate each required field individually with specific messages
		if (!formData.name || !formData.name.trim()) {
			setStatusMessage({ type: "error", text: "Please enter your name." });
			return;
		}

		if (!formData.email || !formData.email.trim()) {
			setStatusMessage({ type: "error", text: "Please enter your email address." });
			return;
		}

		if (!formData.designation) {
			setStatusMessage({ type: "error", text: "Please select a designation." });
			return;
		}

		if (!formData.experience) {
			setStatusMessage({ type: "error", text: "Please select your experience level." });
			return;
		}

		// Validate resume is required
		if (!formData.resume) {
			setStatusMessage({ type: "error", text: "Please upload your resume to submit application." });
			return;
		}

		setSubmitting(true);

		try {
			const formDataToSend = new FormData();
			formDataToSend.append("name", formData.name.trim());
			formDataToSend.append("address", formData.address.trim());
			formDataToSend.append("designation", formData.designation);
			formDataToSend.append("experience", formData.experience);
			formDataToSend.append("email", formData.email.trim());
			formDataToSend.append("phone", formData.phone.trim());
			if (formData.resume) {
				formDataToSend.append("resume", formData.resume);
			}

			const res = await fetch("/api/career", {
				method: "POST",
				body: formDataToSend,
			});

			const data = await res.json();

			if (res.ok && data.success) {
				setStatusMessage({ type: "success", text: data.message || "Application submitted successfully!" });
				setFormData({ name: "", address: "", designation: "", experience: "", email: "", phone: "", resume: null });
				// Reset file input
				const fileInput = document.querySelector('input[type="file"]');
				if (fileInput) fileInput.value = "";
			} else {
				setStatusMessage({ type: "error", text: data.error || "Failed to submit application. Please try again." });
			}
		} catch (error) {
			setStatusMessage({ type: "error", text: "Something went wrong. Please try again later." });
		} finally {
			setSubmitting(false);
		}
	};

	const designations = [
		"WordPress Developer",
		"PHP Developer",
		"React JS Developer",
		"React Native Developer",
		"Front-End Developer",
		"Graphic Designer",
		"App Developer",
		"Creative Content Writer",
		"BDE (Business Development Executive)",
	];

	const experienceOptions = [
		"0-1 Year",
		"2-3 Year",
		"3-4 Year",
		"5-6 Year",
		"7-8 Year",
		"9-10 Year",
	];

	return (
		<section className="tj-contact-section-2 section-gap">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading text-center">
							<span className="sub-title wow fadeInUp" data-wow-delay=".1s">
								<i className="tji-box"></i>Apply Now
							</span>
							<h2 className="sec-title title-anim wow fadeInUp" data-wow-delay=".2s">
								Apply from below available <span>vacancies:</span>
							</h2>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-lg-10">
						<div className="contact-form wow fadeInUp" data-wow-delay=".3s">
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
							<form id="career-form" onSubmit={handleSubmit}>
								<div className="row">
									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="text"
												name="name"
												placeholder="Enter Name*"
												value={formData.name}
												onChange={handleChange}
												required
											/>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="text"
												name="address"
												placeholder="Enter Address"
												value={formData.address}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<select
												name="designation"
												value={formData.designation}
												onChange={handleChange}
												required
											>
												<option value="">Select Designation</option>
												{designations.map((designation, idx) => (
													<option key={idx} value={designation}>
														{designation}
													</option>
												))}
											</select>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<select
												name="experience"
												value={formData.experience}
												onChange={handleChange}
												required
											>
												<option value="">Select Year of Experience</option>
												{experienceOptions.map((exp, idx) => (
													<option key={idx} value={exp}>
														{exp}
													</option>
												))}
											</select>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="email"
												name="email"
												placeholder="Enter Email Address*"
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
												placeholder="Enter Mobile Number"
												value={formData.phone}
												onChange={(e) => {
													const val = e.target.value.replace(/[^0-9+\-() ]/g, "");
													setFormData((prev) => ({ ...prev, phone: val }));
												}}
											/>
										</div>
									</div>
									<div className="col-sm-12">
										<div className="form-input">
											<div className="file-upload-wrapper">
												<input
													type="file"
													name="resume"
													id="resume-upload"
													accept=".pdf,.doc,.docx"
													onChange={handleFileChange}
													required
													style={{ display: "none" }}
												/>
												<label htmlFor="resume-upload" className="file-upload-label">
													<i className="tji-envelop"></i>
													<span>{formData.resume ? formData.resume.name : "Upload Resume Here"} <span style={{ color: "var(--tj-color-theme-primary)", fontWeight: 600 }}>*</span></span>
												</label>
												{formData.resume && (
													<button
														type="button"
														onClick={() => {
															setFormData((prev) => ({ ...prev, resume: null }));
															const fileInput = document.getElementById("resume-upload");
															if (fileInput) fileInput.value = "";
														}}
														className="file-remove-btn"
													>
														<i className="fa-light fa-times"></i>
													</button>
												)}
											</div>
										</div>
									</div>
									<div className="col-12">
										<div className="submit-btn">
											<ButtonPrimary
												type={"submit"}
												text={submitting ? "Submitting..." : "Submit Application"}
												disabled={submitting}
											/>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CareerApplicationForm;
