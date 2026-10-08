export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str, len = 60) {
  if (!str) return '';
  return str.length > len ? `${str.slice(0, len)}...` : str;
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}