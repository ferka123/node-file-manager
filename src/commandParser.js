import { fileCommands } from "./components/fs.js";
import { parseArg as parseOsArg } from "./components/os.js";
import { hash } from "./components/hash.js";
import { compress, decompress } from "./components/zlib.js";

const commandsList = {
  ...fileCommands,
  hash,
  compress,
  decompress,
  os: parseOsArg,
};

export async function commandParser(input) {
  const [command, ...args] = input
    .match(/(".*?"|\S+)/g)
    .map((el) => el.replaceAll('"', ""));

  if (command in commandsList) await commandsList[command](...args);
  else console.log("Invalid input");
}
