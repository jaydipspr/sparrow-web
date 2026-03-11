import Link from "next/link";

const TermsAndConditionsPrimary = () => {
	return (
		<section className="terms-and-conditions section-gap">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-10">
						<div className="terms-and-conditions-wrapper">
							<div>
								<h2>Terms &amp; Conditions</h2>
								<p className="muted">Last Updated: 08/10/2025</p>
								<p>
									Welcome to Sparrow Softtech. By accessing or using our website
									and services, you agree to be bound by the following Terms and
									Conditions. Please read them carefully before using our services.
								</p>
							</div>

							<div>
								<h3>1. Introduction</h3>
								<p>
									Sparrow Softtech ("we", "our", "us") is a service-based company
									that provides software development, embedded systems solutions,
									and technology services as per client requirements.
								</p>
								<p>
									These Terms govern your use of our website, services, and any
									products developed or delivered by us.
								</p>
							</div>

							<div>
								<h3>2. Scope of Services</h3>
								<p>
									Sparrow Softtech provides custom development services, including
									but not limited to website design, software development, embedded
									systems, mobile applications, and digital solutions.
								</p>
								<p>
									All projects are executed strictly according to the
									specifications, materials, and instructions provided by the
									client.
								</p>
								<p>
									The client is responsible for providing complete, accurate, and
									lawful content or instructions for the project.
								</p>
							</div>

							<div>
								<h3>3. Client Responsibility</h3>
								<p>
									The client must ensure that all materials, data, and information
									shared with us do not violate any copyright, trademark, or
									applicable law.
								</p>
								<p>
									The client assumes full responsibility for how the final product
									or service is used, managed, or distributed.
								</p>
								<p>
									Once a project is delivered and approved, Sparrow Softtech is not
									responsible for further maintenance, misuse, or operational issues
									unless a separate support agreement is signed.
								</p>
							</div>

							<div>
								<h3>4. Service Disclaimer</h3>
								<p>Sparrow Softtech acts solely as a service provider.</p>
								<p>
									All websites, applications, software, and embedded systems are
									developed as per client specifications.
								</p>
								<p>
									Once delivered, Sparrow Softtech holds no ownership, control, or
									responsibility for the operation, content, or purpose of the
									developed solution.
								</p>
								<p>Sparrow Softtech shall not be held liable for any:</p>
								<ul>
									<li>misuse or illegal use of the delivered project,</li>
									<li>
										financial loss or business damage caused by the use of the
										service,
									</li>
									<li>
										security issues, downtime, or third-party misuse after project
										delivery.
									</li>
								</ul>
								<p>
									Our duty is limited to providing the requested service and
									receiving payment for that service. After delivery, we are not
									associated with the client's business or its activities.
								</p>
							</div>

							<div>
								<h3>5. Intellectual Property</h3>
								<p>
									All source code, designs, and materials created by Sparrow
									Softtech remain our property until full payment is received.
								</p>
								<p>
									Upon full payment, the ownership rights of the final deliverables
									are transferred to the client, except any pre-existing components,
									frameworks, or third-party assets used in development.
								</p>
								<p>
									Sparrow Softtech reserves the right to display non-confidential
									work in our portfolio or promotional materials unless otherwise
									agreed upon in writing.
								</p>
							</div>

							<div>
								<h3>6. Payments and Refund Policy</h3>
								<p>
									All payments are to be made according to the terms specified in
									the invoice or project agreement.
								</p>
								<p>
									Once a project is started, payments made are non-refundable, as
									development work begins immediately.
								</p>
								<p>
									Any additional features or modifications requested after the
									final delivery will be treated as a new service and billed
									separately.
								</p>
							</div>

							<div>
								<h3>7. Limitation of Liability</h3>
								<p>
									In no event shall Sparrow Softtech or its team be liable for any:
								</p>
								<ul>
									<li>indirect, incidental, consequential, or special damages,</li>
									<li>loss of profit, revenue, data, or goodwill,</li>
									<li>
										claims resulting from the use or inability to use our services.
									</li>
								</ul>
								<p>
									Our total liability under any agreement shall not exceed the total
									amount paid by the client for the specific service.
								</p>
							</div>

							<div>
								<h3>8. Third-Party Services</h3>
								<p>
									Some projects may use third-party tools, APIs, or integrations.
									Sparrow Softtech is not responsible for any downtime, pricing
									change, or malfunction of third-party services used within the
									project.
								</p>
							</div>

							<div>
								<h3>9. Confidentiality</h3>
								<p>
									Both Sparrow Softtech and the client agree to keep confidential
									all non-public business information, code, or materials shared
									during the project, unless disclosure is required by law.
								</p>
							</div>

							<div>
								<h3>10. Termination</h3>
								<p>
									Either party may terminate a project with written notice if the
									other party breaches these Terms. All work completed up to
									termination must be paid for in full.
								</p>
							</div>

							<div>
								<h3>11. Governing Law</h3>
								<p>
									These Terms shall be governed by and interpreted according to the
									laws of India, and any disputes shall be subject to the exclusive
									jurisdiction of the courts in Bhavnagar, Gujarat.
								</p>
							</div>

							<div>
								<h3>12. Contact Information</h3>
								<p>
									If you have any questions about these Terms, please contact us
									at:
								</p>
								<p>
									📧{" "}
									<Link href="mailto:info@sparrowsofttech.com">
										info@sparrowsofttech.com
									</Link>
								</p>
							</div>

							<div>
								<h3>13. Default Applicability of Terms</h3>
								<p>
									In the absence of any separately signed written agreement or
									contract, all services, projects, or deliverables provided by
									Sparrow Softtech shall automatically be governed by the Terms
									&amp; Conditions and Privacy Policy published on our official
									website{" "}
									<Link
										href="https://sparrowsofttech.com"
										target="_blank"
										rel="noopener"
									>
										https://sparrowsofttech.com
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TermsAndConditionsPrimary;
