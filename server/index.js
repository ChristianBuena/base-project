const path = require('path');
const express = require('express');
require('dotenv').config();

const { validateContactPayload } = require('./validators');
const { hasRequiredSmtpConfig, sendContactEmail, verifySmtpConnection } = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '..', 'public');

app.use(express.json({ limit: '1mb' }));
app.use(express.static(publicDir));

app.get('/api/health', (_req, res) => {
    return res.status(200).json({
        ok: true,
        smtpConfigured: hasRequiredSmtpConfig()
    });
});

app.get('/api/smtp-check', async (_req, res) => {
    if (!hasRequiredSmtpConfig()) {
        return res.status(400).json({
            ok: false,
            error: 'SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.'
        });
    }

    try {
        await verifySmtpConnection();
        return res.status(200).json({ ok: true, message: 'SMTP connection verified.' });
    } catch (error) {
        return res.status(500).json({ ok: false, error: 'SMTP verify failed.', details: error.message });
    }
});

app.post('/api/contact', async (req, res) => {
    const payload = req.body || {};
    const validation = validateContactPayload(payload);

    if (!validation.ok) {
        return res.status(400).json({ error: validation.error });
    }

    if (!hasRequiredSmtpConfig()) {
        return res.status(500).json({
            error: 'SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.'
        });
    }

    try {
        await sendContactEmail(payload);
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Email send failed:', error);
        return res.status(500).json({ error: 'Failed to send email.' });
    }
});

app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`The Base Project running at http://localhost:${PORT}`);
});
