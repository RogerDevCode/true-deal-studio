const { test, expect } = require("@playwright/test");
const { PROD_URL, PAGES, run } = require("../scripts/production_smoke");

function responseFor(title) {
  return {
    ok: true,
    status: 200,
    headers: new Headers({ "cache-control": "public, max-age=0" }),
    text: async () => `<!doctype html><html lang="es-CL"><head><title>${title}</title><meta property="og:title"><meta property="og:description"><meta property="og:image"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">{}</script></head><body><h1>Demo</h1></body></html>`,
  };
}

test("production smoke covers every Vercel public page", async () => {
  const requested = [];

  await run(async (url) => {
    requested.push(url);
    const page = PAGES.find(({ path }) => new URL(path, PROD_URL).toString() === url);
    return responseFor(page.expectedTitle);
  }, () => {});

  expect(PROD_URL).toBe("https://true-deal-studio.vercel.app/");
  expect(PAGES).toHaveLength(16);
  expect(requested).toEqual(PAGES.map(({ path }) => new URL(path, PROD_URL).toString()));
});

test("production smoke rejects an unexpected page title", async () => {
  await expect(run(async () => responseFor("Título incorrecto"), () => {})).rejects.toThrow("Titulo inesperado");
});
