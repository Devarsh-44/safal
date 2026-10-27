/** A 10-digit Indian mobile number, optionally with +91 and a space or dash in the middle. */
export const validPhone = (p) => /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(p.trim());
