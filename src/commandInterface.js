import { createInterface } from "readline/promises";
import { commandParser } from "./commandParser.js";
import { EOL, homedir } from "os";
import { getUserName } from "./components/cli.js";

export function initCommandInterface() {
  const userName = getUserName();
  console.log(`Welcome to the File Manager, ${userName}!`);
  process.chdir(homedir());

  process.on("exit", () =>
    console.log(`Thank you for using File Manager, ${userName}, goodbye!`)
  );

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  promptUser(rl);

  rl.on("SIGINT", () => process.exit(1));
}

async function promptUser(rl) {
  const input = await rl.question(`You are currently in ${process.cwd()}${EOL}> `);
  rl.pause();
  await commandParser(input);
  promptUser(rl);
}
