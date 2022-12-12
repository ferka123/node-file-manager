import * as readline from "readline/promises";
import { commandParser } from "./commandParser.js";
import { exitHandler } from "./components/io.js";
import { printCurrentDir } from "./components/fs.js";

export function initCommandInterface() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", async (input) => {
    rl.pause();
    await commandParser(input);
    printCurrentDir();
    rl.resume();
  });

  rl.on("SIGINT", exitHandler);
}
