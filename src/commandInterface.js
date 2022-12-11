import * as readline from "readline/promises";
import { commandParser } from "./commandParser.js";
import { exitHandler } from "./components/io.js";

export function initCommandInterface() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", async (input) => {
    rl.pause();
    await commandParser(input);
    rl.resume();
  });

  rl.on("SIGINT", exitHandler);
}