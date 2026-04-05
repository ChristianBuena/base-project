const nodemailer = require('nodemailer');

module.exports = async (_req, res) => {
    const hasSmtpConfig = Boolean(
        process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS
    );

    if (!hasSmtpConfig) {
        return res.status(400).json({
            ok: false,
            error: 'SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.'
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: String(process.env.SMTP_SECURE || 'false') === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.verify();
        return res.status(200).json({ ok: true, message: 'SMTP connection verified.' });
    } catch (error) {
        return res.status(500).json({ ok: false, error: 'SMTP verify failed.', details: error.message });
    }
};
