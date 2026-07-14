#!/usr/bin/env node

const { chromium } = require("@playwright/test");
const { spawn } = require("child_process");

const ROOT = process.cwd();
const QA_PORT = 4174;
const BASE_URL = `http://127.0.0.1:${QA_PORT}`;

const PAGE_BUDGETS = [
  {
    path: "/",
    name: "landing",
    maxRequests: 35,
    maxImageBytes: 550000,
    maxStylesheetBytes: 90000,
    requiredSelectors: ["h1", "#demos", "#contacto"],
  },
  {
    path: "/demo-psicologa/index.html",
    name: "demo-psicologa",
    maxRequests: 20,
    maxImageBytes: 100000,
    maxStylesheetBytes: 90000,
    requiredSelectors: ["h1", "#preguntas"],
  },
  {
    path: "/demo-contabilidad/index.html",
    name: "demo-contabilidad",
    maxRequests: 20,
    maxImageBytes: 180000,
    maxStylesheetBytes: 90000,
    requiredSelectors: ["h1", "#calculadora"],
  },
];

function waitForServer(url) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const attempt = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          resolve();
          return;
        }
      } catch {}
      if (Date.now() - startedAt > 15000) {
        reject(new Error("Static server did not become ready in time."));
        return;
      }
      setTimeout(attempt, 300);
    };
    attempt();
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function closeServer(server) {
  return new Promise((resolve) => {
    if (!server || server.killed) {
      resolve();
      return;
    }

    const finalize = () => resolve();
    server.once("exit", finalize);
    server.kill("SIGINT");

    setTimeout(() => {
      if (!server.killed) {
        server.kill("SIGTERM");
      }
    }, 2000);
  });
}

async function auditPage(page, config) {
  const responseSizes = [];
  const consoleIssues = [];
  const accessibilityIssues = [];

  page.on("response", async (response) => {
    try {
      const headers = response.headers();
      const contentLengthHeader = headers["content-length"];
      const contentType = headers["content-type"] || "";
      const bodySize = contentLengthHeader ? Number(contentLengthHeader) : (await response.body()).length;
      responseSizes.push({
        url: response.url(),
        type: contentType,
        size: bodySize,
      });
    } catch {
      // Ignore cross-process fetch errors.
    }
  });

  page.on("console", (message) => {
    if (["error", "warning", "assert"].includes(message.type())) {
      const text = message.text();
      if (text !== "Failed to load resource: the server responded with a status of 404 (Not Found)") {
        consoleIssues.push(`${message.type()}: ${text}`);
      }
    }
  });

  await page.goto(`${BASE_URL}${config.path}`, { waitUntil: "networkidle" });

  for (const selector of config.requiredSelectors) {
    await page.locator(selector).waitFor({ state: "visible" });
  }

  const metrics = await page.evaluate(async () => {
    const images = [...document.images].map((img) => ({
      src: img.currentSrc || img.src,
      width: img.naturalWidth,
      height: img.naturalHeight,
      loading: img.loading || "eager",
      alt: img.getAttribute("alt"),
    }));

    const stylesheets = [...document.querySelectorAll('link[rel="stylesheet"], link[rel="preload"][as="style"]')]
      .map((node) => ({
        href: node.getAttribute("href"),
        rel: node.getAttribute("rel"),
      }));

    const missingButtonNames = [...document.querySelectorAll("button")]
      .filter((button) => !button.innerText.trim() && !button.getAttribute("aria-label"))
      .length;

    const lowContrastNodes = [...document.querySelectorAll("*")]
      .filter((node) => {
        const style = window.getComputedStyle(node);
        if (style.color !== "rgb(0, 119, 182)" || style.backgroundColor !== "rgb(23, 42, 69)") {
          return false;
        }

        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      })
      .length;

    return {
      images,
      stylesheets,
      h1Count: document.querySelectorAll("h1").length,
      missingButtonNames,
      lowContrastNodes,
    };
  });

  assert(metrics.h1Count === 1, `${config.name}: se detectaron ${metrics.h1Count} h1`);
  assert(metrics.missingButtonNames === 0, `${config.name}: hay botones sin nombre accesible`);
  assert(metrics.lowContrastNodes === 0, `${config.name}: se detectaron nodos con contraste deficiente`);
  assert(consoleIssues.length === 0, `${config.name}: errores de consola ${consoleIssues.join(" | ")}`);

  const requestCount = responseSizes.length;
  const imageBytes = responseSizes
    .filter((item) => item.type.startsWith("image/"))
    .reduce((sum, item) => sum + item.size, 0);
  const stylesheetBytes = responseSizes
    .filter((item) => item.type.includes("text/css"))
    .reduce((sum, item) => sum + item.size, 0);

  assert(requestCount <= config.maxRequests, `${config.name}: demasiadas requests iniciales (${requestCount})`);
  assert(imageBytes <= config.maxImageBytes, `${config.name}: exceso de peso en imagenes (${imageBytes} bytes)`);
  assert(stylesheetBytes <= config.maxStylesheetBytes, `${config.name}: exceso de peso en CSS (${stylesheetBytes} bytes)`);

  console.log(`PASS ${config.name} requests=${requestCount} imageBytes=${imageBytes} cssBytes=${stylesheetBytes}`);
}

async function main() {
  const server = spawn(process.execPath, ["scripts/static_server.js", "--port", String(QA_PORT)], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => process.stdout.write(chunk));
  server.stderr.on("data", (chunk) => process.stderr.write(chunk));

  try {
    await waitForServer(BASE_URL);
    const browser = await chromium.launch({ headless: true });
    try {
      for (const config of PAGE_BUDGETS) {
        const page = await browser.newPage();
        try {
          await auditPage(page, config);
        } finally {
          await page.close();
        }
      }
    } finally {
      await browser.close();
    }
  } finally {
    await closeServer(server);
  }
}

main().catch((error) => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
