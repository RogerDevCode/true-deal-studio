#!/usr/bin/env node

const { spawnSync } = require("child_process");
process.exitCode = spawnSync("npm", ["run", "check_consoles"], { stdio: "inherit", shell: true }).status || 0;
