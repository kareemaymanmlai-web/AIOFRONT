"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = process.env.PORT || 3000;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

const apps = [
  ["End User", "End user"],
  ["Tenant Admin", "TenantAdmin"],
  ["Super Admin 2", "super2"],
  ["Super Admin 3", "super3"]
];

function send(res, status, body, type = "text/html; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function homePage() {
  const links = apps
    .map(([name, folder]) => `<a href="/${encodeURIComponent(folder)}/">${name}</a>`)
    .join("");

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sub Pay Frontends</title>
  <style>
    body{margin:0;font-family:Arial,Tahoma,sans-serif;background:#f6f7fb;color:#111827;display:grid;place-items:center;min-height:100vh}
    main{width:min(720px,calc(100% - 32px));background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:28px;box-shadow:0 20px 50px rgba(15,23,42,.08)}
    h1{font-size:24px;margin:0 0 8px}
    p{margin:0 0 22px;color:#6b7280;line-height:1.7}
    div{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
    a{display:block;text-decoration:none;color:#fff;background:#4f46e5;padding:14px 16px;border-radius:8px;font-weight:700;text-align:center}
    a:hover{background:#4338ca}
  </style>
</head>
<body>
  <main>
    <h1>Sub Pay Frontends</h1>
    <p>اختار الواجهة اللي عايز تجربها.</p>
    <div>${links}</div>
  </main>
</body>
</html>`;
}

function safeResolve(requestPath) {
  const decodedPath = decodeURIComponent(requestPath.split("?")[0]);
  const cleanPath = decodedPath.replace(/^\/+/, "");
  const resolved = path.resolve(root, cleanPath);

  if (!resolved.startsWith(root)) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
  if (!req.url || req.url === "/" || req.url === "/index.html") {
    send(res, 200, homePage());
    return;
  }

  const requested = safeResolve(req.url);
  if (!requested) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  let filePath = requested;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, "Not found", "text/plain; charset=utf-8");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, contentTypes[ext] || "application/octet-stream");
  });
});

server.listen(port, () => {
  console.log(`Static frontend server running on port ${port}`);
});
