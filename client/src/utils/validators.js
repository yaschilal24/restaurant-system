export function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isPhone(phone) {
  return /^[+]?[\d\s-]{7,20}$/.test(phone);
}

export function validateRegister({ name, email, password, confirm }) {
  if (!name?.trim()) return 'Name is required';
  if (!isEmail(email)) return 'Valid email is required';
  if (!password || password.length < 6) return 'Password must be at least 6 characters';
  if (confirm !== undefined && password !== confirm) return 'Passwords do not match';
  return null;
}