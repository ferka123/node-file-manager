import { exitHandler } from "./components/io.js";
import { printCurrentDir, goUp } from "./components/fs.js";

export function commandParser(data) {
  const [command, ...args] = data.toString().trim().split(" ");

  switch (command) {
    case ".exit":
      exitHandler();
      break;

    case "up":
      goUp();
      printCurrentDir();
  }
}
