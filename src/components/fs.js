import { store } from "../store.js";
import * as path from "path";
import * as fs from "fs/promises";
import { createReadStream } from "fs";
import { EOL } from "os";

const pathExists = (path) =>
  fs.stat(path).then(
    () => true,
    () => false
  );

const resolvePath = (pathToResolve) => {
  if (!path.isAbsolute(pathToResolve)) {
    return path.resolve(store.currentDir, pathToResolve);
  }
  return pathToResolve;
};

export function printCurrentDir() {
  console.log(`You are currently in ${store.currentDir}`);
}

export function goUp() {
  const dir = store.currentDir.split(path.sep).slice(0, -1).join(path.sep);
  store.currentDir = dir || path.sep;
}

export async function ls() {
  try {
    const dir = await fs.readdir(store.currentDir, { withFileTypes: true });

    const directories = dir
      .filter((dirent) => dirent.isDirectory())
      .sort((a, b) => a.name < b.name)
      .map((dirent) => {
        return { Name: dirent.name, Type: "directory" };
      });

    const files = dir
      .filter((dirent) => dirent.isFile())
      .sort((a, b) => a.name < b.name)
      .map((dirent) => {
        return { Name: dirent.name, Type: "file" };
      });

    console.table([...directories, ...files]);
  } catch (e) {
    console.log("Operation failed");
  }
}

export async function cd(newPath) {
  try {
    const resolvedPath = resolvePath(newPath);
    const stat = await fs.stat(resolvedPath);
    if (stat.isDirectory()) store.currentDir = resolvedPath;
  } catch (e) {
    console.log("Operation failed");
  }
}

export async function cat(filePath) {
  try {
    const resolvedPath = resolvePath(filePath);
    const stream = createReadStream(resolvedPath, "utf-8");
    await new Promise((resolve, reject) => {
      stream.pipe(process.stdout, { end: false });
      stream.on("end", () => process.stdout.write(EOL, resolve));
      stream.on("error", reject);
    });
  } catch (e) {
    console.log("Operation failed");
  }
}

export async function add(fileName) {
  try {
    const file = await fs.open(resolvePath(fileName), "a");
    await file.close();
  } catch (e) {
    console.log(e);
  }
}
