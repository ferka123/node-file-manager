import { store } from "../store.js";
import * as path from "path";
import * as fs from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { EOL } from "os";
import { pipeline } from "stream/promises";

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
    console.log("Operation failed");
  }
}

export async function rn(filePath, fileName) {
  try {
    const resolvedPath = resolvePath(filePath);
    const newPath = path.join(path.dirname(resolvedPath), fileName);

    const stat = await fs.stat(resolvedPath);
    if (stat.isFile()) await fs.rename(resolvedPath, newPath);
    else console.log("Wrong path")

  } catch (e) {
    console.log("Operation failed");
  }
}

export async function cp(filePath, dirPath) {
  try {
    const resolvedFilePath = resolvePath(filePath);
    const resolvedDirPath = resolvePath(dirPath);
    const file = path.parse(filePath);

    const readStream = createReadStream(resolvedFilePath);
    const writeStream = createWriteStream(path.join(resolvedDirPath, file.base));
    await pipeline(readStream, writeStream);

  } catch (e) {
    console.log("Operation failed");
  }
}

export async function mv(filePath, dirPath) {
  try {
    const resolvedFilePath = resolvePath(filePath);
    const resolvedDirPath = resolvePath(dirPath);
    const file = path.parse(filePath);

    const readStream = createReadStream(resolvedFilePath);
    const writeStream = createWriteStream(path.join(resolvedDirPath, file.base));
    await pipeline(readStream, writeStream);

    await fs.unlink(resolvedFilePath);
  } catch (e) {
    console.log("Operation failed");
  }
}

export async function rm(filePath) {
  try {
    const resolvedFilePath = resolvePath(filePath);
    await fs.unlink(resolvedFilePath);

  } catch (e) {
    console.log("Operation failed");
  }
}
