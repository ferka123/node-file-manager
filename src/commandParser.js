import { fsCommands } from "./components/fs.js";
import { parseArg as parseOsArg } from "./components/os.js";
import { hash } from "./components/hash.js";
import { compress, decompress } from "./components/zlib.js";

const commandsList = {
  ...fsCommands,
  hash,
  compress,
  decompress,
  os: parseOsArg,
  ".exit": () => process.exit(1),
};

export async function commandParser(input) {
  const [cmd, ...args] =
    input.match(/(".*?"|\S+)/g)?.map((el) => el.replaceAll('"', "")) ?? [];

  if (validateCommand(cmd, args)) {
    try {
      await commandsList[cmd](...args);
    } catch {
      console.log("Operation failed");
    }
  } else console.log("Invalid input");
}

function validateCommand(cmd, args) {
  if (!commandsList.hasOwnProperty(cmd)) return false;
  return commandsList[cmd].length === args.length && args.every(Boolean);
}
