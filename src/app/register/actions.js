"use server";

import {
  hashPassword,
  setAuthTokenCookie,
  createAuthToken,
  getUserByEmail,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

export async function registerAction({ name, email, password }) {
  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email is already registered." };
  }

  const passwordHash = await hashPassword(password);
  const [createdUser] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
      role: "USER",
    })
    .returning();

  const token = createAuthToken({
    userId: createdUser.id,
    role: createdUser.role,
  });
  setAuthTokenCookie(token);

  return {
    user: {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
    },
  };
}
