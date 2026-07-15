import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  clearAuthCookie();
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
