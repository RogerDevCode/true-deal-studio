#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const net = require("net");
const { spawn } = require("child_process");

const ROOT = process.cwd();
const REQUIRED_TESTS = [
  "test_root.js",
  "test_cafe.js",
  "test_salon.js",
  "test_artesanias.js",
  "test_contabilidad.js",
  "check_consoles.js",
];
const HTML_EXTENSIONS = new Set([".html"]);
const TEXT_EXTENSIONS = new Set([".html", ".js", ".md", ".css"]);
const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/chrome",
].filter(Boolean);

function color(code, text) {
  return `${code}${text}\x1b[0m`;
}

function green(text) {
  return color("\x1b[32m", text);
}

function yellow(text) {
  return color("\x1b[33m", text);
}

function red(text) {
  return color("\x1b[31m", text);
}

function cyan(text) {
  return color("\x1b[36m", text);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === ".lighthouseci" || entry.name === "playwright-report" || entry.name === "test-results") {
      continue;
    }
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

function rel(filePath) {
  return path.relative(ROOT, filePath) || ".";
}

function exists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function addResult(container, status, message) {
  container.push({ status, message });
}

function summarizeResults(results) {
  if (results.some((item) => item.status === "FAIL")) {
    return "FAIL";
  }
  if (results.some((item) => item.status === "WARN")) {
    return "WARN";
  }
  return "PASS";
}

function printGate(name, result) {
  const formatter = result.status === "PASS" ? green : result.status === "WARN" ? yellow : red;
  console.log(`${formatter(result.status.padEnd(4))} ${cyan(name)}`);
  for (const item of result.items) {
    const itemFormatter = item.status === "PASS" ? green : item.status === "WARN" ? yellow : red;
    console.log(`  ${itemFormatter(item.status.padEnd(4))} ${item.message}`);
  }
  console.log("");
}

function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    if (candidate && exists(candidate)) {
      return candidate;
    }
  }
  return null;
}

function getHtmlFiles(allFiles) {
  return allFiles.filter((filePath) => HTML_EXTENSIONS.has(path.extname(filePath).toLowerCase()));
}

function getTextFiles(allFiles) {
  return allFiles.filter((filePath) => TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase()));
}

function countMatches(content, pattern) {
  return [...content.matchAll(pattern)].length;
}

function extractAttributes(content, attributeName) {
  const regex = new RegExp(`${attributeName}\\s*=\\s*["']([^"']+)["']`, "gi");
  const values = [];
  for (const match of content.matchAll(regex)) {
    values.push(match[1]);
  }
  return values;
}

function isIgnorableReference(reference) {
  return (
    !reference ||
    /[`{}$()]/.test(reference) ||
    reference.includes("||") ||
    /\s/.test(reference) ||
    /^[a-zA-Z0-9_.-]+$/.test(reference) ||
    reference.startsWith("#") ||
    reference.startsWith("http://") ||
    reference.startsWith("https://") ||
    reference.startsWith("mailto:") ||
    reference.startsWith("tel:") ||
    reference.startsWith("javascript:") ||
    reference.startsWith("data:")
  );
}

function resolveLocalReference(filePath, reference) {
  const cleanReference = reference.split("#")[0].split("?")[0];
  if (!cleanReference) {
    return null;
  }
  return path.resolve(path.dirname(filePath), cleanReference);
}

function isVoiceShopLink(reference) {
  return typeof reference === "string" && reference.includes("voiceshop-pro.zip");
}

function evaluateStaticGate(allFiles) {
  const items = [];
  const htmlFiles = getHtmlFiles(allFiles);
  const htmlPages = htmlFiles.map((filePath) => ({ filePath, content: read(filePath) }));

  if (htmlPages.length === 0) {
    addResult(items, "FAIL", "No se encontraron paginas HTML para validar.");
    return { status: "FAIL", items };
  }

  for (const page of htmlPages) {
    const htmlTagHasLang = /<html\b[^>]*\blang=["']es-CL["']/i.test(page.content);
    addResult(
      items,
      htmlTagHasLang ? "PASS" : "FAIL",
      `${rel(page.filePath)}: ${htmlTagHasLang ? "lang es-CL presente" : "falta lang=\"es-CL\""}`,
    );

    const h1Count = countMatches(page.content, /<h1\b/gi);
    addResult(
      items,
      h1Count === 1 ? "PASS" : "FAIL",
      `${rel(page.filePath)}: ${h1Count === 1 ? "1 h1 detectado" : `se esperaban 1 h1 y se encontraron ${h1Count}`}`,
    );

    const requiredMeta = [
      { key: "og:title", regex: /<meta\b[^>]*property=["']og:title["']/i },
      { key: "og:description", regex: /<meta\b[^>]*property=["']og:description["']/i },
      { key: "og:image", regex: /<meta\b[^>]*property=["']og:image["']/i },
      { key: "og:type", regex: /<meta\b[^>]*property=["']og:type["']/i },
      { key: "twitter:card", regex: /<meta\b[^>]*name=["']twitter:card["'][^>]*content=["']summary_large_image["']/i },
    ];

    for (const meta of requiredMeta) {
      const present = meta.regex.test(page.content);
      addResult(
        items,
        present ? "PASS" : "FAIL",
        `${rel(page.filePath)}: ${present ? `${meta.key} presente` : `falta ${meta.key}`}`,
      );
    }

    const hasJsonLd = /<script\b[^>]*type=["']application\/ld\+json["']/i.test(page.content);
    addResult(
      items,
      hasJsonLd ? "PASS" : "FAIL",
      `${rel(page.filePath)}: ${hasJsonLd ? "JSON-LD presente" : "falta application/ld+json"}`,
    );

    const usesCollapse = page.content.includes("x-collapse");
    if (usesCollapse) {
      const hasCollapsePlugin = page.content.includes("alpine-collapse.min.js");
      addResult(
        items,
        hasCollapsePlugin ? "PASS" : "FAIL",
        `${rel(page.filePath)}: ${hasCollapsePlugin ? "x-collapse con plugin" : "usa x-collapse sin plugin alpine-collapse.min.js"}`,
      );
    }

    const references = [
      ...extractAttributes(page.content, "href"),
      ...extractAttributes(page.content, "src"),
    ];

    for (const reference of references) {
      if (isVoiceShopLink(reference)) {
        addResult(items, "FAIL", `${rel(page.filePath)} -> ${reference}: no se permite enlazar voiceshop-pro.zip`);
        continue;
      }
      if (isIgnorableReference(reference)) {
        continue;
      }
      const absoluteReference = resolveLocalReference(page.filePath, reference);
      if (!absoluteReference) {
        continue;
      }
      addResult(
        items,
        exists(absoluteReference) ? "PASS" : "FAIL",
        `${rel(page.filePath)} -> ${reference}: ${exists(absoluteReference) ? "recurso encontrado" : "recurso faltante"}`,
      );
    }

    const demoDirectoryLinks = extractAttributes(page.content, "href").filter((href) =>
      /^(\.\/|\.\.\/)demo-[^"'#?]+\/$/i.test(href),
    );
    for (const href of demoDirectoryLinks) {
      addResult(items, "FAIL", `${rel(page.filePath)} -> ${href}: debe apuntar al archivo index.html para compatibilidad file://`);
    }
  }

  return { status: summarizeResults(items), items };
}

function runNodeScript(scriptPath) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [scriptPath], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

async function evaluateExistingTestsGate() {
  const items = [];

  for (const scriptName of REQUIRED_TESTS) {
    const scriptPath = path.join(ROOT, scriptName);
    if (!exists(scriptPath)) {
      addResult(items, "WARN", `${scriptName}: no existe en el proyecto activo; el gate no pudo ejecutarlo localmente.`);
      continue;
    }

    const result = await runNodeScript(scriptPath);
    const status = result.code === 0 ? "PASS" : "FAIL";
    const output = [result.stdout.trim(), result.stderr.trim()].filter(Boolean).join(" | ");
    addResult(
      items,
      status,
      `${scriptName}: ${result.code === 0 ? "ejecucion correcta" : `fallo con exit code ${result.code}`}${output ? ` | ${output.slice(0, 300)}` : ""}`,
    );
  }

  return { status: summarizeResults(items), items };
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
    server.on("error", reject);
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk.toString();
      });
      response.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    request.on("error", reject);
  });
}

class CDPClient {
  constructor(webSocketDebuggerUrl) {
    this.ws = new WebSocket(webSocketDebuggerUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.eventHandlers = new Map();
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });

    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) {
          return;
        }
        this.pending.delete(message.id);
        if (message.error) {
          pending.reject(new Error(message.error.message));
        } else {
          pending.resolve(message.result);
        }
        return;
      }

      const handlers = this.eventHandlers.get(message.method) || [];
      for (const handler of handlers) {
        handler(message.params || {});
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, handler) {
    if (!this.eventHandlers.has(method)) {
      this.eventHandlers.set(method, []);
    }
    this.eventHandlers.get(method).push(handler);
  }

  close() {
    this.ws.close();
  }
}

function waitForProcessExit(childProcess) {
  return new Promise((resolve) => {
    if (!childProcess || childProcess.exitCode !== null) {
      resolve();
      return;
    }
    childProcess.once("exit", () => resolve());
  });
}

async function launchChrome(rootUrl) {
  const chromePath = findChrome();
  if (!chromePath) {
    throw new Error("No se encontro un binario de Chrome/Chromium en el sistema.");
  }

  const port = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "preprod-gate-"));
  const chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--allow-file-access-from-files",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      rootUrl,
    ],
    {
      cwd: ROOT,
      stdio: ["ignore", "ignore", "pipe"],
    },
  );

  let stderr = "";
  chrome.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  const versionUrl = `http://127.0.0.1:${port}/json/version`;
  const targetsUrl = `http://127.0.0.1:${port}/json/list`;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const version = await httpGetJson(versionUrl);
      const targets = await httpGetJson(targetsUrl);
      const pageTarget = Array.isArray(targets)
        ? targets.find((target) => target.type === "page" && typeof target.webSocketDebuggerUrl === "string")
        : null;
      if (!pageTarget) {
        throw new Error("No se encontro un target de tipo page para DevTools.");
      }
      return { chromePath, chrome, userDataDir, version, pageTarget };
    } catch {
      await wait(200);
    }
  }

  chrome.kill("SIGKILL");
  throw new Error(`Chrome no respondio al puerto de depuracion. ${stderr.trim()}`.trim());
}

function normalizeFileUrl(filePath) {
  const normalized = path.resolve(filePath).split(path.sep).join("/");
  return `file://${normalized}`;
}

function sanitizeCDPValue(result) {
  if (!result) {
    return null;
  }
  if (Object.prototype.hasOwnProperty.call(result, "value")) {
    return result.value;
  }
  return null;
}

async function evaluateInPage(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return sanitizeCDPValue(result.result);
}

async function navigateTo(cdp, url, loadWaiter) {
  const loadPromise = loadWaiter();
  await cdp.send("Page.navigate", { url });
  await loadPromise;
}

function createLoadWaiter(cdp) {
  let resolver = null;
  cdp.on("Page.loadEventFired", () => {
    if (resolver) {
      resolver();
      resolver = null;
    }
  });

  return () =>
    new Promise((resolve, reject) => {
      resolver = resolve;
      setTimeout(() => {
        if (resolver) {
          resolver = null;
          reject(new Error("Timeout esperando Page.loadEventFired"));
        }
      }, 15000);
    });
}

function isIgnorableNetworkFailure(params) {
  const text = `${params.errorText || ""} ${params.blockedReason || ""}`.toLowerCase();
  return text.includes("favicon") || text.includes("err_unknown_url_scheme");
}

async function evaluateNavigationGate() {
  const items = [];
  const rootUrl = normalizeFileUrl(path.join(ROOT, "index.html"));
  const launch = await launchChrome(rootUrl);
  const cdp = new CDPClient(launch.pageTarget.webSocketDebuggerUrl);

  const consoleMessages = [];
  const exceptions = [];
  const networkFailures = [];

  try {
    await cdp.connect();
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");
    await cdp.send("Log.enable");

    cdp.on("Runtime.consoleAPICalled", (params) => {
      const text = (params.args || [])
        .map((arg) => arg.value)
        .filter((value) => value !== undefined)
        .join(" ");
      consoleMessages.push({ type: params.type, text });
    });
    cdp.on("Runtime.exceptionThrown", (params) => {
      exceptions.push(params.exceptionDetails?.text || "Exception sin detalle");
    });
    cdp.on("Log.entryAdded", (params) => {
      if (params.entry.level === "error" || params.entry.level === "warning") {
        consoleMessages.push({ type: params.entry.level, text: params.entry.text });
      }
    });
    cdp.on("Network.loadingFailed", (params) => {
      if (!isIgnorableNetworkFailure(params)) {
        networkFailures.push(`${params.errorText || "Error desconocido"} :: ${params.requestId}`);
      }
    });

    const waitForLoad = createLoadWaiter(cdp);
    await navigateTo(cdp, rootUrl, waitForLoad);

    const rootState = await evaluateInPage(
      cdp,
      `(() => ({
        title: document.title,
        h1Count: document.querySelectorAll('h1').length,
        demoLinks: [...new Set(
          [...document.querySelectorAll('a[href]')]
            .map((a) => a.getAttribute('href'))
            .filter((href) => href && /^\\.\\/demo-[^"'#?]+\\/index\\.html(?:#.*)?$/i.test(href))
        )]
      }))()`,
    );

    addResult(items, rootState.title ? "PASS" : "FAIL", `index.html: titulo cargado (${rootState.title || "sin titulo"})`);
    addResult(items, rootState.h1Count === 1 ? "PASS" : "FAIL", `index.html: ${rootState.h1Count === 1 ? "1 h1 detectado en runtime" : `se detectaron ${rootState.h1Count} h1 en runtime`}`);

    if (!Array.isArray(rootState.demoLinks) || rootState.demoLinks.length === 0) {
      addResult(items, "FAIL", "index.html: no se encontraron links a demos para validar navegacion file://.");
    } else {
      addResult(items, "PASS", `index.html: ${rootState.demoLinks.length} links de demo listos para navegacion file://`);
    }

    for (const href of rootState.demoLinks || []) {
      const targetUrl = normalizeFileUrl(path.join(ROOT, href.replace(/^\.\//, "")));
      await navigateTo(cdp, targetUrl, waitForLoad);

      const pageState = await evaluateInPage(
        cdp,
        `(() => ({
          title: document.title,
          h1Count: document.querySelectorAll('h1').length,
          backHref: ([...document.querySelectorAll('a[href]')].find((a) => {
            const href = a.getAttribute('href') || '';
            return href.startsWith('../index.html');
          }) || {}).getAttribute ? [...document.querySelectorAll('a[href]')].find((a) => {
            const href = a.getAttribute('href') || '';
            return href.startsWith('../index.html');
          }).getAttribute('href') : null
        }))()`,
      );

      addResult(items, pageState.title ? "PASS" : "FAIL", `${href}: titulo cargado (${pageState.title || "sin titulo"})`);
      addResult(items, pageState.h1Count === 1 ? "PASS" : "FAIL", `${href}: ${pageState.h1Count === 1 ? "1 h1 detectado en runtime" : `se detectaron ${pageState.h1Count} h1 en runtime`}`);
      addResult(items, pageState.backHref ? "PASS" : "FAIL", `${href}: ${pageState.backHref ? `link de retorno encontrado (${pageState.backHref})` : "falta link de retorno a ../index.html"}`);

      if (pageState.backHref) {
        const absoluteBackUrl = normalizeFileUrl(path.resolve(path.join(ROOT, href.replace(/^\.\//, "")), "..", pageState.backHref));
        await navigateTo(cdp, absoluteBackUrl, waitForLoad);
        const returnTitle = await evaluateInPage(cdp, "document.title");
        addResult(
          items,
          returnTitle === rootState.title ? "PASS" : "FAIL",
          `${href}: retorno a landing ${returnTitle === rootState.title ? "correcto" : `incorrecto (${returnTitle || "sin titulo"})`}`,
        );
      } else {
        await navigateTo(cdp, rootUrl, waitForLoad);
      }
    }

    if (exceptions.length === 0) {
      addResult(items, "PASS", "Navegacion runtime sin excepciones JavaScript.");
    } else {
      addResult(items, "FAIL", `Excepciones JavaScript detectadas: ${exceptions.slice(0, 5).join(" | ")}`);
    }

    const blockingConsole = consoleMessages.filter((entry) => ["error", "warning", "assert"].includes(entry.type));
    if (blockingConsole.length === 0) {
      addResult(items, "PASS", "Sin errores o warnings de consola relevantes durante la navegacion.");
    } else {
      addResult(items, "FAIL", `Consola reporto eventos relevantes: ${blockingConsole.slice(0, 5).map((entry) => `${entry.type}: ${entry.text}`).join(" | ")}`);
    }

    if (networkFailures.length === 0) {
      addResult(items, "PASS", "Sin fallos de carga de red/file:// relevantes.");
    } else {
      addResult(items, "FAIL", `Fallos de carga detectados: ${networkFailures.slice(0, 5).join(" | ")}`);
    }

    return { status: summarizeResults(items), items };
  } finally {
    cdp.close();
    launch.chrome.kill("SIGKILL");
    await waitForProcessExit(launch.chrome);
    try {
      fs.rmSync(launch.userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch {
      // Ignore temp profile cleanup race conditions in Chrome.
    }
  }
}

async function main() {
  const allFiles = walk(ROOT);
  const gates = [];

  gates.push({ name: "Static Repo Checks", result: evaluateStaticGate(allFiles) });
  gates.push({ name: "Existing Node Test Suite", result: await evaluateExistingTestsGate() });
  gates.push({ name: "Headless file:// Navigation", result: await evaluateNavigationGate() });

  for (const gate of gates) {
    printGate(gate.name, gate.result);
  }

  const finalStatus = gates.some((gate) => gate.result.status === "FAIL")
    ? "FAIL"
    : gates.some((gate) => gate.result.status === "WARN")
      ? "WARN"
      : "PASS";

  const formatter = finalStatus === "PASS" ? green : finalStatus === "WARN" ? yellow : red;
  console.log(`${formatter(finalStatus)} Preproduction Gate Summary`);
  for (const gate of gates) {
    const gateFormatter = gate.result.status === "PASS" ? green : gate.result.status === "WARN" ? yellow : red;
    console.log(`  ${gateFormatter(gate.result.status.padEnd(4))} ${gate.name}`);
  }

  process.exitCode = finalStatus === "FAIL" ? 1 : 0;
}

main().catch((error) => {
  console.error(red("FAIL"), error.stack || error.message);
  process.exitCode = 1;
});
