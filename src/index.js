import { store } from "./store.js";
import { getUserName } from "./components/cli.js";
import { commandParser } from "./commandParser.js";
import { exitHandler } from "./components/io.js";
import { printCurrentDir } from "./components/fs.js";

store.userName = getUserName();
console.log(`Welcome to the File Manager, ${store.userName}!`);
printCurrentDir();

process.stdin.on("data", commandParser);

process.on("SIGINT", exitHandler);
