const args = process.argv.slice(2);

if (args[0] === "init") {
  require("../src/init")();
} else if (args[0] === "start") {
  require("../src/start")();
} else {
  console.log("Usage: devcontrol-agent [init|start]");
}