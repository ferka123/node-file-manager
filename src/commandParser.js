import { exitHandler } from "./components/io.js";
import {
  printCurrentDir,
  goUp,
  ls,
  cd,
  cat,
  add,
  rn,
  cp,
  mv,
  rm,
} from "./components/fs.js";
import { parseArg as parseOsArg } from "./components/os.js";
import { hash } from "./components/hash.js";
import { compress, decompress } from "./components/zlib.js";

export async function commandParser(input) {
  const [command, ...args] = input
    .match(/(".*?"|\S+)/g)
    .map((el) => el.replaceAll('"', ""));

  switch (command) {
    case ".exit":
      exitHandler();
      break;
    case "up":
      goUp();
      break;
    case "ls":
      await ls();
      break;
    case "cd":
      await cd(args[0]);
      break;
    case "cat":
      await cat(args[0]);
      break;
    case "add":
      await add(args[0]);
      break;
    case "rn":
      await rn(args[0], args[1]);
      break;
    case "cp":
      await cp(args[0], args[1]);
      break;
    case "mv":
      await mv(args[0], args[1]);
      break;
    case "rm":
      await rm(args[0]);
      break;
    case "os":
      parseOsArg(args[0]);
      break;
    case "hash":
      await hash(args[0]);
      break;
    case "compress":
      await compress(args[0], args[1]);
      break;
    case "decompress":
      await decompress(args[0], args[1]);
      break;
    default:
      console.log("Wrong command")
  }
}
