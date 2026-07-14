#!/usr/bin/env node

const PROD_URL = "https://web-promotion.dev-n8n-stax.workers.dev/";
const PAGES = [
  { path: "", expectedTitle: "STAX | Se ve bien. Se vende mejor." },
  { path: "demo-psicologa/index.html", expectedTitle: "Ps. Clara Altieri | Psicología Clínica & Bienestar Emocional" },
  { path: "demo-contabilidad/index.html", expectedTitle: "ContaDigital | Asesoría Contable & Tributaria para Pymes - Santiago" },
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function findTag(content, regex, label) {
  assert(regex.test(content), `Falta ${label}`);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "web-promotion-production-smoke/1.0",
    },
  });
  assert(response.ok, `HTTP ${response.status} en ${url}`);
  return {
    headers: response.headers,
    text: await response.text(),
  };
}

async function run() {
  for (const page of PAGES) {
    const url = new URL(page.path, PROD_URL).toString();
    const { headers, text } = await fetchText(url);

    assert(text.includes(page.expectedTitle), `Titulo inesperado en ${url}`);
    findTag(text, /<html\b[^>]*lang=["']es-CL["']/i, "lang es-CL");
    findTag(text, /<h1\b/i, "<h1>");
    findTag(text, /<meta\b[^>]*property=["']og:title["']/i, "og:title");
    findTag(text, /<meta\b[^>]*property=["']og:description["']/i, "og:description");
    findTag(text, /<meta\b[^>]*property=["']og:image["']/i, "og:image");
    findTag(text, /<meta\b[^>]*name=["']twitter:card["'][^>]*summary_large_image/i, "twitter:card");
    findTag(text, /<script\b[^>]*type=["']application\/ld\+json["']/i, "application/ld+json");

    const cacheControl = headers.get("cache-control") || "";
    assert(cacheControl.length > 0, `Cache-Control ausente en ${url}`);
    console.log(`PASS ${url}`);
  }
}

run().catch((error) => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
