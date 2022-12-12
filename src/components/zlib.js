import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { pipeline } from "stream/promises";
import { createReadStream, createWriteStream } from "fs";
import { resolvePath } from "./fs.js";
import * as path from "path";

export async function compress(srcPath, destPath) {
    try {
      const file = path.parse(srcPath);
      const resolvedDestPath = path.join(resolvePath(destPath), file.base + ".br");
  
      const srcStream = createReadStream(resolvePath(srcPath));
      const destStream = createWriteStream(resolvedDestPath);
      const brotli = createBrotliCompress();
  
      await pipeline(srcStream, brotli, destStream);
    } catch (e) {
      console.log("Operation failed", e.message);
    }
  }

export async function decompress(srcPath, destPath) {
  try {
    const file = path.parse(srcPath);
    if (file.ext !== ".br") throw new Error("Not a brotli archive");
    const resolvedDestPath = path.join(resolvePath(destPath), file.name);

    const srcStream = createReadStream(resolvePath(srcPath));
    const destStream = createWriteStream(resolvedDestPath);
    const brotli = createBrotliDecompress();

    await pipeline(srcStream, brotli, destStream);
  } catch (e) {
    console.log("Operation failed: ", e.message);
  }
}