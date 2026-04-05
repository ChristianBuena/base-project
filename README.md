# The Base Project

Landing page + portfolio website with a contact form that sends real emails through an SMTP backend.

## Project structure

- `public/` - frontend files (`index.html`, `style.css`, `script.js`, `assets/`)
- `server/` - backend code (`index.js`, `mailer.js`, `validators.js`)
- `server.js` - compatibility bootstrap (loads `server/index.js`)
- `.env` - private SMTP configuration

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Then edit `.env` with your SMTP provider credentials.

For Gmail, use an App Password (not your account password):
- Enable 2-step verification
- Create an App Password
- Use it as `SMTP_PASS`

Example `.env` values:

```env
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=thebaseproject.team@gmail.com
SMTP_PASS=your-google-app-password
CONTACT_TO_EMAIL=thebaseproject.team@gmail.com
SMTP_FROM=The Base Project <thebaseproject.team@gmail.com>
```

## 3. Run locally

```bash
npm run dev
```

Open:

- `http://localhost:3000`

Validate SMTP locally:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/smtp-check
```

## How it works

- Frontend form submits JSON to `POST /api/contact`
- `server/index.js` validates input and sends email via Nodemailer/SMTP
- Recipient inbox is `CONTACT_TO_EMAIL`

## Vercel deployment

This project is configured for Vercel using:
- `public/` for static files
- `api/*.js` for serverless endpoints (`/api/contact`, `/api/health`, `/api/smtp-check`)
- `vercel.json` rewrites for root static paths

### Deploy steps

1. Push this project to GitHub
2. Import repository in Vercel
3. In Vercel Project Settings > Environment Variables, add:
	- `SMTP_HOST`
	- `SMTP_PORT`
	- `SMTP_SECURE`
	- `SMTP_USER`
	- `SMTP_PASS`
	- `CONTACT_TO_EMAIL`
	- `SMTP_FROM`
4. Redeploy

### Verify on production

After deploy, open:

- `/api/health`
- `/api/smtp-check`

If `smtpConfigured` is false, env vars are missing or misspelled in Vercel.

## SMTP troubleshooting

Check if server sees your SMTP config:

```bash
curl http://localhost:3000/api/health
```

Expected: `"smtpConfigured": true`

Verify SMTP login/connectivity directly:

```bash
curl http://localhost:3000/api/smtp-check
```

Expected: `{"ok":true,"message":"SMTP connection verified."}`

If it fails:
- confirm `.env` exists in project root
- confirm app was restarted after `.env` changes
- for Gmail, use an App Password (not normal password)

## Production notes

- Keep `.env` private
- Prefer a dedicated SMTP provider (Postmark, SendGrid, Resend, Mailgun) for better deliverability
- Add rate limiting and bot protection (hCaptcha/Turnstile) before launch
