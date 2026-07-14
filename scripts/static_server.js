#!/usr/bin/env node

const fs = require("fs");
const http = require("http");
const path = require("path");

const ROOT = process.cwd();
const args = process.argv.slice(2);
const portFlagIndex = args.indexOf("--port");
const port = portFlagIndex >= 0 ? Number(args[portFlagIndex + 1]) : 4173;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function send(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, headers);
  response.end(body);
}

function safeResolve(urlPath) {
  const normalizedPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = normalizedPath === "/" ? "/index.html" : normalizedPath;
  const absolutePath = path.resolve(ROOT, `.${requestedPath}`);
  if (!absolutePath.startsWith(ROOT)) {
    return null;
  }
  return absolutePath;
}

const server = http.createServer((request, response) => {
  const absolutePath = safeResolve(request.url || "/");
  if (!absolutePath) {
    send(response, 403, "Forbidden");
    return;
  }

  let filePath = absolutePath;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    send(response, 404, "Not Found");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] || "application/octet-stream";
  const body = fs.readFileSync(filePath);
  send(response, 200, body, {
    "Content-Type": contentType,
    "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=3600",
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static server listening on http://127.0.0.1:${port}`);
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
