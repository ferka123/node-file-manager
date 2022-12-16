import * as path from "path";
import * as fs from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { EOL } from "os";
import { pipeline } from "stream/promises";

export const fsCommands = { up, ls, cd, cat, add, rn, cp, mv, rm };

function up() {
  process.chdir("..");
}

async function ls() {
  const dir = await fs.readdir(process.cwd(), { withFileTypes: true });

  const directories = dir
    .filter((dirent) => dirent.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((dirent) => {
      return { Name: dirent.name, Type: "directory" };
    });

  const files = dir
    .filter((dirent) => dirent.isFile())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((dirent) => {
      return { Name: dirent.name, Type: "file" };
    });

  console.table([...directories, ...files]);
}

async function cd(newPath) {
  process.chdir(path.resolve(newPath));
}

async function cat(filePath) {
  const resolvedPath = path.resolve(filePath);
  const stream = createReadStream(resolvedPath, "utf-8");
  await new Promise((resolve, reject) => {
    stream.pipe(process.stdout, { end: false });
    stream.on("end", () => process.stdout.write(EOL, resolve));
    stream.on("error", reject);
  });
}

async function add(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  const file = await fs.open(filePath, "a");
  await file.close();
}

async function rn(filePath, fileName) {
  const srcPath = path.resolve(filePath);
  const destPath = path.join(path.dirname(srcPath), fileName);

  const stat = await fs.stat(srcPath);
  if (stat.isFile()) await fs.rename(srcPath, destPath);
  else throw new Error("Wrong path");
}

async function cp(filePath, dirPath) {
  const readStream = createReadStream(path.resolve(filePath));
  const writeStream = createWriteStream(
    path.join(path.resolve(dirPath), path.basename(filePath))
  );
  await pipeline(readStream, writeStream);
}

async function mv(filePath, dirPath) {
  const resolvedFilePath = path.resolve(filePath);
  const readStream = createReadStream(resolvedFilePath);
  const writeStream = createWriteStream(
    path.join(path.resolve(dirPath), path.basename(filePath))
  );

  await pipeline(readStream, writeStream);
  await fs.unlink(resolvedFilePath);
}

async function rm(filePath) {
  await fs.unlink(path.resolve(filePath));
}
