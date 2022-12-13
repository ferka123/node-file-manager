import * as path from "path";
import * as fs from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { EOL } from "os";
import { pipeline } from "stream/promises";

export const fsCommands = { up, ls, cd, add, rn, cp, mv, rm };

function up() {
  process.chdir("..");
}

async function ls() {
  try {
    const dir = await fs.readdir(process.cwd(), { withFileTypes: true });

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

async function cd(newPath) {
  try {
    process.chdir(path.resolve(newPath));
  } catch (e) {
    console.log("Operation failed");
  }
}

async function cat(filePath) {
  try {
    const resolvedPath = path.resolve(filePath);
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

async function add(fileName) {
  try {
    const filePath = process.join(process.cwd(), fileName);
    const file = await fs.open(filePath, "a");
    await file.close();
  } catch (e) {
    console.log("Operation failed");
  }
}

async function rn(filePath, fileName) {
  try {
    const srcPath = process.resolve(filePath);
    const destPath = path.join(path.dirname(srcPath), fileName);

    const stat = await fs.stat(srcPath);
    if (stat.isFile()) await fs.rename(srcPath, destPath);
    else throw new Error("Wrong path");
  } catch (e) {
    console.log("Operation failed");
  }
}

async function cp(filePath, dirPath) {
  try {
    const readStream = createReadStream(path.resolve(filePath));
    const writeStream = createWriteStream(
      path.join(path.resolve(dirPath), path.basename(filePath))
    );
    await pipeline(readStream, writeStream);
  } catch (e) {
    console.log("Operation failed");
  }
}

async function mv(filePath, dirPath) {
  try {
    const resolvedFilePath = path.resolve(filePath);
    const readStream = createReadStream(resolvedFilePath);
    const writeStream = createWriteStream(
      path.join(path.resolve(dirPath), path.basename(filePath))
    );

    await pipeline(readStream, writeStream);
    await fs.unlink(resolvedFilePath);
  } catch (e) {
    console.log("Operation failed");
  }
}

async function rm(filePath) {
  try {
    await fs.unlink(path.resolve(filePath));
  } catch (e) {
    console.log("Operation failed");
  }
}
