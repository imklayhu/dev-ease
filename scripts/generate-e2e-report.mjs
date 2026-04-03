import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const inputPath = path.join(root, "test-results", "e2e-results.json");
const outDir = path.join(root, ".cursor", "docs", "test-reports");
const date = new Date().toISOString().slice(0, 10);
const outPath = path.join(outDir, `${date}-e2e-report.md`);

if (!fs.existsSync(inputPath)) {
  console.error(`Missing Playwright JSON report: ${inputPath}`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

let total = 0;
let passed = 0;
let failed = 0;
let skipped = 0;

const failedCases = [];

function walkSuites(suites = []) {
  for (const suite of suites) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        for (const result of test.results || []) {
          total += 1;
          if (result.status === "passed") passed += 1;
          else if (result.status === "failed") {
            failed += 1;
            failedCases.push({
              title: `${spec.title} (${test.projectName || "default"})`,
              error: result.error?.message || "Unknown error",
            });
          } else if (result.status === "skipped") skipped += 1;
        }
      }
    }
    walkSuites(suite.suites || []);
  }
}

walkSuites(report.suites || []);

fs.mkdirSync(outDir, { recursive: true });

const lines = [
  `# E2E Test Report - ${date}`,
  "",
  "## Summary",
  `- Total: ${total}`,
  `- Passed: ${passed}`,
  `- Failed: ${failed}`,
  `- Skipped: ${skipped}`,
  "",
  "## Artifacts",
  "- HTML report: `playwright-report/index.html`",
  "- JSON report: `test-results/e2e-results.json`",
  "- JUnit report: `test-results/e2e-junit.xml`",
  "",
];

if (failedCases.length > 0) {
  lines.push("## Failed Cases", "");
  for (const item of failedCases) {
    lines.push(`- ${item.title}`);
    lines.push(`  - ${item.error.replace(/\n/g, " ")}`);
  }
  lines.push("");
} else {
  lines.push("## Failed Cases", "", "- None", "");
}

fs.writeFileSync(outPath, `${lines.join("\n")}\n`, "utf-8");
console.log(`Generated: ${outPath}`);
