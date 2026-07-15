import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createAuthResponse } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body || {};

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required." }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );
  }

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!existingUser) {
    return new Response(
      JSON.stringify({ error: "Invalid email or password." }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      },
    );
  }

  const validPassword = await verifyPassword(
    password,
    existingUser.passwordHash,
  );
  if (!validPassword) {
    return new Response(
      JSON.stringify({ error: "Invalid email or password." }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      },
    );
  }

  return createAuthResponse(existingUser);
}
