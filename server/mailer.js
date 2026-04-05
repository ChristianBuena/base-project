const nodemailer = require('nodemailer');

const requiredEnvKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];

function hasRequiredSmtpConfig(env = process.env) {
    return requiredEnvKeys.every((key) => Boolean(env[key]));
}

function createTransporter(env = process.env) {
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

async function sendContactEmail({ name, email, contactNumber, message }, env = process.env) {
    const toEmail = env.CONTACT_TO_EMAIL || env.SMTP_USER;
    const subject = `New Inquiry from ${name}`;

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

    const transporter = createTransporter(env);

    await transporter.sendMail({
        from: `"${name} via The Base Project" <${env.SMTP_USER}>`,
        to: toEmail,
        replyTo: email,
        subject,
        text,
        html
    });
}

async function verifySmtpConnection(env = process.env) {
    const transporter = createTransporter(env);
    await transporter.verify();
}

module.exports = {
    hasRequiredSmtpConfig,
    sendContactEmail,
    verifySmtpConnection
};
