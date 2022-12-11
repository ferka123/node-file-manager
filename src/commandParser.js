import { exitHandler } from "./components/io.js";
import { printCurrentDir, goUp, ls, cd, cat, add } from "./components/fs.js";

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
      printCurrentDir();
      break;

    case "ls":
      await ls();
      printCurrentDir();
      break;

    case "cd":
      await cd(args[0]);
      printCurrentDir();
      break;

    case "cat":
      await cat(args[0]);
      printCurrentDir();
      break;

    case "add":
      await add(args[0]);
      printCurrentDir();
      break;
  }
}
