"use server";

import { clearAuthCookie } from "@/lib/auth";

export async function logoutAction() {
  clearAuthCookie();
  return { success: true };
}
