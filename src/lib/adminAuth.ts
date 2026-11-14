import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const ADMIN_COOKIE_NAME = "portfolio_admin_auth";

/**
 * Check if current runtime is strictly local development
 */
export function isLocalDev(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Enforce local development only; returns 404 in production
 */
export function assertLocalDev() {
  if (!isLocalDev()) {
    notFound();
  }
}

/**
 * Check whether the current request is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  if (!isLocalDev()) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";
  return token === expectedPassword;
}

