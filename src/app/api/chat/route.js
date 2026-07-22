import { agent } from "@/lib/ai/agent";

export async function POST(req) {
  const { message } = await req.json();

  const response = await agent.invoke({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });

  return Response.json(response);
}
