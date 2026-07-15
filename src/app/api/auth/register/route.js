import { db } from "@/lib/db";
import { userByEmail, users } from "@/lib/schema";
import { hashPassword, createAuthResponse } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json();
  const { name, email, password } = body || {};

  if (!name || !email || !password) {
    return new Response(
      JSON.stringify({ error: "Name, email, and password are required." }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );
  }

  const existingUser = await db.query.users.findFirst({
    where: userByEmail(email),
  });

  if (existingUser) {
    return new Response(
      JSON.stringify({ error: "Email is already registered." }),
      {
        status: 409,
        headers: { "content-type": "application/json" },
      },
    );
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

  return createAuthResponse(createdUser);
}
