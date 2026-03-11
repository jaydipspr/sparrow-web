"use client";
import { forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const ReCaptcha = forwardRef(({ onChange, onExpired }, ref) => {
	// Get site key from environment variable
	const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

	if (!siteKey) {
		console.warn("reCAPTCHA site key is not configured. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your .env file.");
		return null;
	}

	return (
		<div style={{ marginTop: "20px", marginBottom: "20px" }}>
			<ReCAPTCHA
				ref={ref}
				sitekey={siteKey}
				onChange={onChange}
				onExpired={onExpired}
				theme="light"
			/>
		</div>
	);
});

ReCaptcha.displayName = "ReCaptcha";

export default ReCaptcha;
