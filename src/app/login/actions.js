"use server";

import {
  setAuthTokenCookie,
  verifyPassword,
  createAuthToken,
  getUserByEmail,
} from "@/lib/auth";

export async function loginAction({ email, password }) {
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);
  if (!isValidPassword) {
    return { error: "Invalid email or password." };
  }

  const token = createAuthToken({ userId: user.id, role: user.role });
  setAuthTokenCookie(token);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
