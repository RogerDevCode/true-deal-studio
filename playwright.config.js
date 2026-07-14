const fs = require("fs");

const systemChrome = ["/usr/bin/google-chrome-stable", "/usr/bin/google-chrome", "/usr/bin/chromium"]
  .find((candidate) => fs.existsSync(candidate));

/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  testDir: "./tests",
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    headless: true,
    launchOptions: systemChrome ? { executablePath: systemChrome } : {},
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
      },
    },
  ],
  webServer: {
    command: "node scripts/static_server.js --port 4173",
    env: {
      FORCE_COLOR: "1",
    },
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 20_000,
  },
};
