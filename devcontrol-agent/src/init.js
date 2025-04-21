const fs = require("fs");
const path = require("path");

module.exports = function init() {
  const configPath = path.resolve(process.cwd(), "devcontrol.config.js");

  if (fs.existsSync(configPath)) {
    console.log("⚠️ devcontrol.config.js already exists.");
    return;
  }

  const templatePath = path.resolve(__dirname, "../templates/devcontrol.config.js");
  fs.copyFileSync(templatePath, configPath);
  console.log("✅ devcontrol.config.js created successfully.");
};
