// Save this file as: app/api/ai/route.js

export async function POST(request) {
  try {
    const { summary } = await request.json();

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are a sharp UK personal finance coach. Be direct, no fluff. Use £. Give 3-4 specific actionable insights with emoji bullets. End with one 'this week' action.",
        messages: [{ role: "user", content: `Analyse my budget: ${summary}` }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || "No response.";
    return Response.json({ text });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
