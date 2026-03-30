import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key, anthropic-version",
};

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: CORS });
  }

  // API proxy
  if (url.pathname === "/api/proxy") {
    const target = url.searchParams.get("target");
    let apiUrl: string;
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (target === "claude") {
      apiUrl = "https://api.anthropic.com/v1/messages";
      headers["x-api-key"] = req.headers.get("x-api-key") || "";
      headers["anthropic-version"] = "2023-06-01";
    } else {
      apiUrl = "https://api.moonshot.cn/v1/chat/completions";
      headers["Authorization"] = req.headers.get("authorization") || "";
    }

    try {
      const body = await req.text();
      const res = await fetch(apiUrl, { method: "POST", headers, body });
      const data = await res.text();
      return new Response(data, {
        status: res.status,
        headers: { "Content-Type": "application/json", ...CORS },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS },
      });
    }
  }

  // Serve index.html
  try {
    const html = await Deno.readTextFile("./index.html");
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

serve(handler, { port: 8000 });
