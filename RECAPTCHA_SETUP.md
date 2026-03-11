# reCAPTCHA Setup Guide

This project uses Google reCAPTCHA v2 to protect the contact form and career application form from spam submissions.

## Setup Instructions

### 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "Create" to register a new site
3. Fill in the form:
   - **Label**: Your site name (e.g., "Sparrow Softtech Website")
   - **reCAPTCHA type**: Select "reCAPTCHA v2" → "I'm not a robot" Checkbox
   - **Domains**: Add your domains:
     - `localhost` (for development)
     - Your production domain (e.g., `sparrowsofttech.com`)
   - Accept the reCAPTCHA Terms of Service
4. Click "Submit"
5. You'll receive two keys:
   - **Site Key** (public) - Used in the frontend
   - **Secret Key** (private) - Used in the backend

### 2. Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**Important Notes:**
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` must start with `NEXT_PUBLIC_` to be accessible in the browser
- `RECAPTCHA_SECRET_KEY` should NOT be exposed to the client (don't use `NEXT_PUBLIC_` prefix)
- Never commit your `.env.local` file to version control

### 3. Restart Development Server

After adding the environment variables, restart your Next.js development server:

```bash
npm run dev
```

## How It Works

1. **Frontend**: The reCAPTCHA widget is displayed on both the contact form and career application form
2. **User Interaction**: Users must complete the reCAPTCHA challenge before submitting
3. **Token Generation**: When completed, reCAPTCHA generates a token
4. **Backend Verification**: The token is sent to the server, which verifies it with Google's API
5. **Form Submission**: Only verified submissions are processed

## Testing

### Development Mode

If the reCAPTCHA keys are not configured, the forms will still work (for development purposes), but a warning will be logged to the console.

### Production Mode

In production, reCAPTCHA verification is required. Forms will not submit without a valid reCAPTCHA token.

## Troubleshooting

### reCAPTCHA not showing

- Check that `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set correctly
- Verify the domain is registered in your reCAPTCHA settings
- Check browser console for errors

### "reCAPTCHA verification failed" error

- Verify `RECAPTCHA_SECRET_KEY` is set correctly
- Check that the domain matches what's registered in reCAPTCHA
- Ensure the token hasn't expired (tokens expire after a few minutes)

## Forms Using reCAPTCHA

- **Contact Form** (`/contact` page)
- **Career Application Form** (`/careers` page)
