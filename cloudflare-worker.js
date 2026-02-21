// Cloudflare Worker – proxies requests to the Railway backend
// Deploy this at: https://workers.cloudflare.com (free, no card needed)
// After deploying, copy the *.workers.dev URL and update BACKEND_URL in script.js

const RAILWAY_BACKEND = "https://mummy-birthday-production.up.railway.app";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Forward the path + query to Railway
    const target = new URL(url.pathname + url.search, RAILWAY_BACKEND);

    const modifiedRequest = new Request(target.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
      redirect: "follow",
    });

    const response = await fetch(modifiedRequest);

    // Add CORS headers so the browser never blocks the request
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");
    newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    newHeaders.set("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: newHeaders });
    }

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
