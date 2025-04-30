const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

module.exports = function start() {
  const configPath = path.resolve(process.cwd(), "devcontrol.config.js");

  if (!fs.existsSync(configPath)) {
    console.log("❌ Missing devcontrol.config.js. Run `devcontrol-agent init` first.");
    return;
  }

  const config = require(configPath);
  const app = express();
  app.use(express.json());

  app.post("/trigger", async (req, res) => {
    const body = req.body || {};
  
    const { action, branch, user } = body;
  
    if (!action) {
      return res.status(400).send("Missing 'action' in request body.");
    }
  
    const message = config.message?.({ branch, user, action }) ?? `Received ${action} action`;
    console.log("📝 Message:", message);
  
    const cmd = action === "deploy"
      ? config.onDeploy?.()
      : action === "deny"
      ? config.onDeny?.()
      : null;
  
    if (!cmd) return res.status(400).send("Unknown action");
  
    exec(cmd, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
        console.log("🔧 Executing command:", cmd);
        if (err) {
          console.error("❌ Error:", stderr || "No error message");
          return res.status(500).send(`Execution failed: ${stderr || "Unknown error"}`);
        }
        console.log("✅ Output:", stdout || "No output");
        console.log("⚠️ Stderr:", stderr || "No stderr");
        res.send("Command executed.");
      });
  });
  

  const PORT = process.env.PORT || 9010;
  app.listen(PORT, () => {
    console.log(`🚀 devcontrol-agent running on port ${PORT}`);
  });
};
