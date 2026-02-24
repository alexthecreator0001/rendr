const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";

const SYSTEM_PROMPT = `You are a professional HTML template generator for PDF documents. Generate a complete, self-contained HTML document based on the user's description.

Requirements:
- Return ONLY the raw HTML — no markdown fences, no explanation, no commentary
- Complete <!DOCTYPE html> document with <html>, <head>, and <body>
- All CSS must be inline in a <style> tag in <head> — no external stylesheets
- Use {{ variable_name }} placeholders for dynamic content (e.g. {{ company_name }}, {{ invoice_number }}, {{ date }})
- Responsive layout that also looks great when printed / rendered to PDF
- Print-ready: use cm/mm units for margins in @page, avoid viewport-dependent sizing
- Clean, modern typography — use system font stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- Professional color palette appropriate for the requested style
- Include sensible placeholder content so the template is immediately useful`;

export async function generateTemplate(
  prompt: string
): Promise<{ html: string } | { error: string }> {
  if (!OPENAI_API_KEY) {
    return { error: "OpenAI API key is not configured." };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[openai] API error:", res.status, body);
      return { error: "AI generation failed. Please try again." };
    }

    const data = await res.json();
    const content: string | undefined = data.choices?.[0]?.message?.content;

    if (!content) {
      return { error: "AI returned an empty response." };
    }

    // Strip markdown fences if the model wraps the output
    const html = content
      .replace(/^```html?\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "")
      .trim();

    return { html };
  } catch (err) {
    console.error("[openai] fetch error:", err);
    return { error: "Failed to reach AI service." };
  }
}
