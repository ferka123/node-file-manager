import { store } from "../store.js";
import { sep as pathSeparator } from "path";

export function printCurrentDir() {
  console.log(`You are currently in ${store.currentDir}`);
}

export function goUp() {
  const dir = store.currentDir
    .split(pathSeparator)
    .slice(0,-1)
    .join(pathSeparator);
  store.currentDir = dir || pathSeparator;
}
