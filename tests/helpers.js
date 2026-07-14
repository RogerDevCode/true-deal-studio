const { expect } = require("@playwright/test");

async function attachPageGuards(page) {
  const consoleIssues = [];
  const requestIssues = [];
  const pageErrors = [];

  page.on("console", (message) => {
    const text = message.text();
    const ignorable404 = text === "Failed to load resource: the server responded with a status of 404 (Not Found)";
    if (["error", "warning", "assert"].includes(message.type()) && !ignorable404) {
      consoleIssues.push(`${message.type()}: ${text}`);
    }
  });

  page.on("pageerror", (error) => {
    const details = [error && error.name, error && error.message, error && String(error)]
      .filter(Boolean)
      .join(": ");
    if (!["Object", "[object Object]", "Object: Object", "Error: [object Object]"].includes(details.trim())) {
      pageErrors.push(details);
    }
  });

  page.on("requestfailed", (request) => {
    const failure = request.failure();
    if (!request.url().includes("favicon")) {
      requestIssues.push(`${request.url()} :: ${failure ? failure.errorText : "unknown request failure"}`);
    }
  });

  return {
    async assertHealthyContext() {
      expect.soft(consoleIssues, `Console issues: ${consoleIssues.join(" | ")}`).toEqual([]);
      expect.soft(pageErrors, `Page errors: ${pageErrors.join(" | ")}`).toEqual([]);
      expect.soft(requestIssues, `Network failures: ${requestIssues.join(" | ")}`).toEqual([]);
    },
  };
}

async function waitForAlpine(page) {
  await page.waitForFunction(() => window.Alpine && document.body && document.body._x_dataStack);
}

module.exports = {
  attachPageGuards,
  waitForAlpine,
};
