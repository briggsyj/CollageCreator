// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 John Briggs

// Serves a built site under a sub-path with no custom headers, the way GitHub
// Pages serves a project site (https://<user>.github.io/<repo>/). Used to test
// that the build works away from the site root.
//
//   node scripts/serve-subpath.mjs [dir=dist] [prefix=/CollageCreator/] [port=4174]

import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";

const [, , dirArg = "dist", prefix = "/CollageCreator/", port = "4174"] = process.argv;
const root = resolve(dirArg);

// Roughly what a static host knows about; anything else is a download.
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".map": "application/json",
};

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  if (!pathname.startsWith(prefix)) {
    res.writeHead(404).end("Not found");
    return;
  }
  let relative = decodeURIComponent(pathname.slice(prefix.length));
  if (relative === "" || relative.endsWith("/")) relative += "index.html";
  const file = resolve(join(root, relative));
  if (file !== root && !file.startsWith(root + sep)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(Number(port), () => {
  console.log(`Serving ${root} at http://localhost:${port}${prefix}`);
});
