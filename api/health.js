module.exports = async (_req, res) => {
    const smtpConfigured = Boolean(
        process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS
    );

    return res.status(200).json({ ok: true, smtpConfigured });
};
