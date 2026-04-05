const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-\s]{7,20}$/;

function validateContactPayload(payload = {}) {
    const { name, email, contactNumber, message } = payload;

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

module.exports = {
    validateContactPayload
};
