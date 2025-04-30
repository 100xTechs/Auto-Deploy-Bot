#!/usr/bin/env node

console.log("🚀 DevControl Agent CLI started");

const args = process.argv.slice(2);
console.log("Received args:", args);

if (args[0] === "init") {
  console.log("📦 Initializing config...");
  // your logic...
  require("../src/init")();
} else if (args[0] === "start") {
  console.log("🔧 Starting agent...");
  // your logic...
  require("../src/start")();
} else {
  console.log("❓ Unknown command:", args[0]);
}
