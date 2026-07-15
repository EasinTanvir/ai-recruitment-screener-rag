import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { users } from "./schema";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const COOKIE_NAME = "auth_token";

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export function createAuthToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getUserByEmail(email) {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  return user || null;
}

export async function getUserById(id) {
  const [user] = await db.select().from(users).where(eq(users.id, id));

  return user || null;
}

export async function getAuthTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

export async function setAuthTokenCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
}

export async function getCurrentUser() {
  const token = getAuthTokenFromCookies();
  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload || !payload.userId) return null;

  return getUserById(payload.userId);
}

export function createAuthResponse(user) {
  const token = createAuthToken({ userId: user.id, role: user.role });
  const response = new Response(
    JSON.stringify({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    },
  );

  response.headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
  );

  return response;
}

export function clearAuthResponse() {
  const response = new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });

  response.headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  );

  return response;
}
