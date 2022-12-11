import { store } from "./store.js";
import { getUserName } from "./components/cli.js";
import { printCurrentDir } from "./components/fs.js";
import { initCommandInterface } from "./commandInterface.js";


store.userName = getUserName();
console.log(`Welcome to the File Manager, ${store.userName}!`);
printCurrentDir();
initCommandInterface();
