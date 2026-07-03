import net from "node:net";
import { spawn } from "node:child_process";

const port = Number(process.env.TWILLO_FRONT_PORT ?? "3200");
const host = "127.0.0.1";

function isListening() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.once("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.setTimeout(800, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

if (await isListening()) {
  console.log(`frontend already running at http://localhost:${port}`);
  process.exit(0);
}

const script = port === 3200 ? "dev" : `dev:${port}`;
const child = spawn("npm", ["--prefix", "../twillo-callbot-front", "run", script], {
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
