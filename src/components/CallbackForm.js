/** Indian mobile number check shared by every form (the callback form itself now lives in home/Porthole.js as the visit coupon). */
export const validPhone = (p) => /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(p.trim());
