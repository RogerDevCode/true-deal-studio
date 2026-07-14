#!/usr/bin/env node

const { spawnSync } = require("child_process");
process.exitCode = spawnSync("npm", ["run", "test_artesanias"], { stdio: "inherit", shell: true }).status || 0;
