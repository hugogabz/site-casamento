import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE = "wedding-admin";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD;
}

function getAdminToken(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function isAdminConfigured() {
  return Boolean(getAdminPassword());
}

export function isValidAdminPassword(password: string) {
  const expectedPassword = getAdminPassword();
  if (!expectedPassword) return false;

  const submitted = Buffer.from(getAdminToken(password));
  const expected = Buffer.from(getAdminToken(expectedPassword));

  return timingSafeEqual(submitted, expected);
}

export async function isAdminAuthenticated() {
  const password = getAdminPassword();
  if (!password) return false;

  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === getAdminToken(password);
}

export async function createAdminSession() {
  const password = getAdminPassword();
  if (!password) throw new Error("ADMIN_PASSWORD não configurada.");

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, getAdminToken(password), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}
