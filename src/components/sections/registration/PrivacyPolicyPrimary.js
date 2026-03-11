import Link from "next/link";

const PrivacyPolicyPrimary = () => {
	return (
		<section className="terms-and-conditions section-gap">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-10">
						<div className="terms-and-conditions-wrapper">
							<div>
								<h2>Privacy Policy</h2>
								<p className="muted">Last Updated: 08/10/2025</p>
								<p>
									At Sparrow Softtech, accessible from{" "}
									<Link
										href="https://sparrowsofttech.com"
										target="_blank"
										rel="noopener"
									>
										https://sparrowsofttech.com
									</Link>{" "}
									your privacy is one of our top priorities. This Privacy Policy
									describes how we collect, use, disclose, and protect the personal
									information of our clients, website visitors, and users of our
									services.
								</p>
								<p>
									By using our website or services, you agree to the collection and
									use of information in accordance with this policy.
								</p>
							</div>

							<div>
								<h3>1. Information We Collect</h3>
								<p>We may collect the following types of information:</p>
								<h4>1.1 Personal Information</h4>
								<p>
									When you contact us or use our services, we may collect:
								</p>
								<ul>
									<li>
										Name, email address, phone number, and company name
									</li>
									<li>Project details or requirements you share with us</li>
									<li>Billing or payment information (when applicable)</li>
								</ul>
								<h4>1.2 Technical Information</h4>
								<p>
									When you visit our website, we may automatically collect:
								</p>
								<ul>
									<li>
										Your IP address, browser type, and operating system
									</li>
									<li>
										The pages you visit and time spent on our website
									</li>
									<li>
										Device identifiers and cookies for analytics purposes
									</li>
								</ul>
								<h4>1.3 Information from Third Parties</h4>
								<p>
									We may receive information from external platforms like job
									portals, payment gateways, or social media platforms when you
									interact with us through them.
								</p>
							</div>

							<div>
								<h3>2. How We Use Your Information</h3>
								<p>We use the collected data for purposes such as:</p>
								<ul>
									<li>Responding to your inquiries or service requests</li>
									<li>
										Managing and executing software or embedded development
										projects
									</li>
									<li>
										Sending important updates about your project or our services
									</li>
									<li>Processing payments and maintaining billing records</li>
									<li>Improving our website and service experience</li>
									<li>Compliance with legal obligations</li>
								</ul>
								<p>
									We do not sell, rent, or trade your personal information with
									any third party.
								</p>
							</div>

							<div>
								<h3>3. Data Retention</h3>
								<p>
									We retain personal information only as long as it is necessary
									to:
								</p>
								<ul>
									<li>
										Complete your project or fulfill our contractual obligations,
									</li>
									<li>
										Comply with legal or regulatory requirements, or
									</li>
									<li>Resolve disputes and enforce our agreements.</li>
								</ul>
								<p>Afterward, we securely delete or anonymize your data.</p>
							</div>

							<div>
								<h3>4. Sharing of Information</h3>
								<p>We may share information only in the following cases:</p>
								<ul>
									<li>
										With trusted partners or subcontractors strictly for completing
										your project (under confidentiality agreements),
									</li>
									<li>
										With third-party payment processors for billing purposes,
									</li>
									<li>When required by law, regulation, or court order.</li>
								</ul>
								<p>
									We do not share, sell, or disclose your data for marketing by
									others.
								</p>
							</div>

							<div>
								<h3>5. Cookies and Tracking Technologies</h3>
								<p>
									Our website may use cookies and analytics tools (such as Google
									Analytics) to improve user experience and analyze site
									performance. Cookies do not give us access to your computer or
									personal information other than the data you choose to share with
									us.
								</p>
								<p>
									You can disable cookies in your browser settings if you prefer.
								</p>
							</div>

							<div>
								<h3>6. Data Security</h3>
								<p>
									We take the protection of your data seriously and use
									appropriate technical and organizational security measures to
									safeguard it. However, no method of transmission over the
									Internet or electronic storage is 100% secure, and we cannot
									guarantee absolute security.
								</p>
							</div>

							<div>
								<h3>7. Your Rights</h3>
								<p>
									Depending on your jurisdiction, you may have the right to:
								</p>
								<ul>
									<li>Access and receive a copy of your data</li>
									<li>Request correction or deletion of your data</li>
									<li>Withdraw consent for data processing</li>
									<li>
										Object to the use of your data for certain purposes
									</li>
								</ul>
								<p>
									To exercise these rights, you can contact us directly.
								</p>
							</div>

							<div>
								<h3>8. External Links</h3>
								<p>
									Our website may contain links to external sites not operated by
									Sparrow Softtech. We are not responsible for the content or
									privacy practices of those third-party websites.
								</p>
							</div>

							<div>
								<h3>9. Children's Privacy</h3>
								<p>
									Our services are intended for businesses and individuals aged 18
									and above. We do not knowingly collect personal information from
									children. If you believe a child has provided us with their
									data, please contact us, and we will promptly delete it.
								</p>
							</div>

							<div>
								<h3>10. Changes to This Policy</h3>
								<p>
									Sparrow Softtech may update this Privacy Policy from time to
									time. Any changes will be posted on this page with an updated
									"Last Updated" date. You are encouraged to review this page
									periodically to stay informed about how we protect your data.
								</p>
							</div>

							<div>
								<h3>11. Contact Us</h3>
								<p>
									If you have any questions, concerns, or complaints about this
									Privacy Policy or our data handling practices, please contact us
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
								<h3>12. Acceptance of This Policy</h3>
								<p>
									By using our website or engaging with Sparrow Softtech for any
									service, you automatically consent to our Privacy Policy and
									agree that it governs all data interactions and communications
									between you and our company — even in the absence of a signed
									written document.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PrivacyPolicyPrimary;
