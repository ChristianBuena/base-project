const nodemailer = require('nodemailer');

function validatePayload(payload = {}) {
    const { name, email, contactNumber, message } = payload;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+()\-\s]{7,20}$/;

    if (!name || !email || !contactNumber || !message) {
        return { ok: false, error: 'All fields are required.' };
    }

    if (!emailPattern.test(email)) {
        return { ok: false, error: 'Invalid email format.' };
    }

    if (!phonePattern.test(contactNumber)) {
        return { ok: false, error: 'Invalid contact number format.' };
    }

    return { ok: true };
}

function hasSmtpConfig(env = process.env) {
    return Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS);
}

function transporterFromEnv(env = process.env) {
    return nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT),
        secure: String(env.SMTP_SECURE || 'false') === 'true',
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS
        }
    });
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const validation = validatePayload(req.body || {});
    if (!validation.ok) {
        return res.status(400).json({ error: validation.error });
    }

    if (!hasSmtpConfig()) {
        return res.status(500).json({
            error: 'SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.'
        });
    }

    const { name, email, contactNumber, message } = req.body;

    const subject = `New Inquiry from ${name}`;
    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;

    const text = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Contact Number: ${contactNumber}`,
        '',
        'Message:',
        message
    ].join('\n');

    const html = `
        <h2>New Website Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact Number:</strong> ${contactNumber}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, '<br>')}</p>
    `;

    try {
        const transporter = transporterFromEnv();

        await transporter.sendMail({
            from: `"${name} via The Base Project" <${process.env.SMTP_USER}>`,
            to: toEmail,
            replyTo: email,
            subject,
            text,
            html
        });

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Vercel SMTP send failed:', error);
        return res.status(500).json({ error: 'Failed to send email.' });
    }
};
