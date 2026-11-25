#!/usr/bin/env node
// Summarizes data/metrics.json: project count, platforms covered, status breakdown.
// Usage: node scripts/portfolio-stats.js

const fs = require("fs");
const path = require("path");

function summarize(data) {
  const projects = data.projects || [];
  const platforms = new Set();
  const status = {};
  for (const project of projects) {
    (project.platform || []).forEach((p) => platforms.add(p));
    status[project.status] = (status[project.status] || 0) + 1;
  }
  const missing = projects.filter((p) => p.screens_designed == null).map((p) => p.name);
  return { total: projects.length, platforms: [...platforms].sort(), status, missing };
}

if (require.main === module) {
  const file = path.join(__dirname, "..", "data", "metrics.json");
  const summary = summarize(JSON.parse(fs.readFileSync(file, "utf8")));
  console.log(`Projects:  ${summary.total}`);
  console.log(`Platforms: ${summary.platforms.join(", ")}`);
  console.log(`Status:    ${JSON.stringify(summary.status)}`);
  if (summary.missing.length) console.log(`Missing screen counts: ${summary.missing.join(", ")}`);
}

module.exports = { summarize };
