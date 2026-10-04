import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "./index.mjs";
import { analyze, validRequest } from "./analysis.mjs";
const config = {
  supabaseUrl: "https://auth.example.test",
  supabaseKey: "synthetic-key",
  openaiKey: "synthetic-ai-key",
  openaiBase: "https://ai.example.test/v1",
  model: "test-model",
  origins: ["http://localhost:3000"],
};
const body = {
  image: "data:image/png;base64,aGVsbG8=",
  occasion: "Casual",
  items: [],
};
const output = {
  summary: "Try a light layer.",
  tips: ["Reuse your jacket."],
  suggestions: ["Jackets"],
};
test("vision boundary uses structured output and rejects malformed or incomplete feedback", async () => {
  assert.equal(
    validRequest({ ...body, image: "https://untrusted.test/x" }),
    false,
  );
  const result = await analyze(body, config, async (url, options) => {
    const request = JSON.parse(options.body);
    assert.equal(request.store, false);
    assert.equal(request.text.format.strict, true);
    assert.equal(request.input[0].content[1].type, "input_image");
    return {
      ok: true,
      json: async () => ({
        status: "completed",
        output: [
          { content: [{ type: "output_text", text: JSON.stringify(output) }] },
        ],
      }),
    };
  });
  assert.deepEqual(result, output);
  await assert.rejects(
    analyze(body, config, async () => ({
      ok: true,
      json: async () => ({ status: "incomplete" }),
    })),
    /complete/,
  );
});
test("HTTP boundary requires auth, validates content, applies quota and never accepts foreign origins", async () => {
  let providerCalls = 0;
  const server = createServer(config, async (url) => {
    if (url.endsWith("/user"))
      return { ok: true, json: async () => ({ id: "synthetic-user" }) };
    providerCalls++;
    return {
      ok: true,
      json: async () => ({
        status: "completed",
        output: [
          { content: [{ type: "output_text", text: JSON.stringify(output) }] },
        ],
      }),
    };
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/outfit-check`;
  try {
    assert.equal((await fetch(url, { method: "POST" })).status, 401);
    assert.equal(
      (
        await fetch(url, {
          method: "POST",
          headers: { Origin: "https://evil.test" },
        })
      ).status,
      403,
    );
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer synthetic-token",
    };
    assert.equal(
      (await fetch(url, { method: "POST", headers, body: "oops" })).status,
      400,
    );
    const concurrent = await Promise.all(
      Array.from({ length: 11 }, () =>
        fetch(url, { method: "POST", headers, body: JSON.stringify(body) }),
      ),
    );
    assert.equal(
      concurrent.filter((response) => response.status === 200).length,
      9,
    );
    assert.equal(
      concurrent.filter((response) => response.status === 429).length,
      2,
    );
    assert.equal(
      (
        await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        })
      ).status,
      429,
    );
    assert.equal(providerCalls, 9);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
