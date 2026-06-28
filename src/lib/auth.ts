/**
 * Minimal single-password admin auth.
 * Set ADMIN_PASSWORD in .env.local (defaults to "admin123" for dev).
 * The session cookie stores a SHA-256 token derived from the password,
 * validated in both the API routes (Node) and middleware (Edge) via
 * Web Crypto (available in both runtimes).
 */
export const AUTH_COOKIE = "sadebal_admin";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export async function sessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`sadebal::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedToken(): Promise<string> {
  return sessionToken(getAdminPassword());
}

export async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  return token === (await expectedToken());
}
