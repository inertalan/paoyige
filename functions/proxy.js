export async function onRequest(context) {
  const request = context.request;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key, anthropic-version",
      }
    });
  }

  const url = new URL(request.url);
  const target = url.searchParams.get("target");
  const body = await request.text();
  const reqHeaders = Object.fromEntries(request.headers);

  let apiUrl, headers;

  if (target === "claude") {
    apiUrl = "https://api.anthropic.com/v1/messages";
    headers = {
      "Content-Type": "application/json",
      "x-api-key": reqHeaders["x-api-key"],
      "anthropic-version": "2023-06-01",
    };
  } else {
    apiUrl = "https://api.moonshot.cn/v1/chat/completions";
    headers = {
      "Content-Type": "application/json",
      "Authorization": reqHeaders["authorization"],
    };
  }

  const res = await fetch(apiUrl, { method: "POST", headers, body });
  const data = await res.text();

  return new Response(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }
  });
}
