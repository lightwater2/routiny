const AUTH_KEY = 'routiny_admin_auth';

export function verifyPassword(password: string): boolean {
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn('VITE_ADMIN_PASSWORD is not set');
    return false;
  }
  return password === adminPassword;
}

export function setAuthenticated(): void {
  sessionStorage.setItem(AUTH_KEY, 'true');
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}
