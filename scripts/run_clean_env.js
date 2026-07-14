#!/usr/bin/env node

const { spawn } = require("child_process");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: node scripts/run_clean_env.js <command> [...args]");
  process.exit(1);
}

const [command, ...commandArgs] = args;
const env = { ...process.env, FORCE_COLOR: "1" };

delete env.NO_COLOR;

const child = spawn(command, commandArgs, {
  cwd: process.cwd(),
  env,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
