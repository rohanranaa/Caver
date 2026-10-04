import http from "node:http";
import { pathToFileURL } from "node:url";
import { validRequest, analyze } from "./analysis.mjs";
export function createServer(config, fetcher = fetch) {
  const quotas = new Map();
  return http.createServer(async (req, res) => {
    const origin = req.headers.origin;
    const allowed = config.origins.includes(origin);
    if (origin && !allowed) {
      res.writeHead(403);
      res.end();
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(allowed
        ? {
            "Access-Control-Allow-Origin": origin,
            Vary: "Origin",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          }
        : {}),
    };
    const send = (status, data) => {
      if (!res.writableEnded) {
        res.writeHead(status, headers);
        res.end(JSON.stringify(data));
      }
    };
    if (req.method === "OPTIONS") {
      send(204, {});
      return;
    }
    if (req.url === "/health" && req.method === "GET") {
      send(200, {
        status: "ok",
        analysisConfigured: Boolean(
          config.supabaseUrl && config.supabaseKey && config.openaiKey,
        ),
      });
      return;
    }
    if (req.url !== "/api/outfit-check" || req.method !== "POST") {
      send(404, { error: "Not found" });
      return;
    }
    if (!config.supabaseUrl || !config.supabaseKey || !config.openaiKey) {
      send(503, {
        error: "AI outfit checks are awaiting service configuration.",
      });
      return;
    }
    const authorization = req.headers.authorization;
    if (!/^Bearer \S+$/.test(authorization || "")) {
      send(401, { error: "Log in to request an outfit check." });
      return;
    }
    try {
      const userResponse = await fetcher(`${config.supabaseUrl}/auth/v1/user`, {
        headers: { apikey: config.supabaseKey, Authorization: authorization },
        signal: AbortSignal.timeout(10000),
      });
      if (!userResponse.ok) {
        send(401, { error: "Your session expired. Please log in again." });
        return;
      }
      const user = await userResponse.json();
      if (typeof user.id !== "string" || !user.id) {
        send(401, { error: "Please log in again." });
        return;
      }
      const now = Date.now();
      for (const [id, entry] of quotas)
        if (entry.reset <= now) quotas.delete(id);
      const quota = quotas.get(user.id) || { count: 0, reset: now + 3600000 };
      if (quota.count >= 10 || (quotas.size >= 10000 && !quotas.has(user.id))) {
        send(429, {
          error: "Outfit check limit reached. Please try again later.",
        });
        return;
      }
      quota.count++;
      quotas.set(user.id, quota);
      let size = 0;
      const chunks = [];
      req.setTimeout(15000, () => req.destroy());
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 3000000) {
          send(413, { error: "Use a photo smaller than 2 MB." });
          req.resume();
          return;
        }
        chunks.push(chunk);
      }
      let body;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        send(400, { error: "Invalid request." });
        return;
      }
      if (!validRequest(body)) {
        send(400, {
          error:
            "Choose a JPEG, PNG, or WebP outfit photo and a valid occasion.",
        });
        return;
      }
      const result = await analyze(body, config, fetcher);
      send(200, result);
    } catch {
      send(502, {
        error:
          "Could not complete the outfit check. Please retry with a clear outfit photo.",
      });
    }
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const config = {
    supabaseUrl: process.env.SUPABASE_URL?.replace(/\/$/, ""),
    supabaseKey: process.env.SUPABASE_PUBLISHABLE_KEY,
    openaiKey: process.env.OPENAI_API_KEY,
    openaiBase: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    origins: (process.env.WEB_ORIGINS || "http://localhost:3000")
      .split(",")
      .map((value) => value.trim()),
  };
  const server = createServer(config);
  server.requestTimeout = 60000;
  server.headersTimeout = 15000;
  server.listen(Number(process.env.PORT || 3001), "0.0.0.0", () =>
    console.log("StyleMatch analysis server ready"),
  );
}
