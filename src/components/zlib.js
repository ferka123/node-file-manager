import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { pipeline } from "stream/promises";
import { createReadStream, createWriteStream } from "fs";
import * as path from "path";

export async function compress(srcPath, destPath) {
      const file = path.parse(srcPath);
      const resolvedDestPath = path.join(path.resolve(destPath), file.base + ".br");
  
      const srcStream = createReadStream(path.resolve(srcPath));
      const destStream = createWriteStream(resolvedDestPath);
      const brotli = createBrotliCompress();
  
      await pipeline(srcStream, brotli, destStream);
  }

export async function decompress(srcPath, destPath) {
    const file = path.parse(srcPath);
    if (file.ext !== ".br") throw new Error("Not a brotli archive");
    const resolvedDestPath = path.join(path.resolve(destPath), file.name);

    const srcStream = createReadStream(path.resolve(srcPath));
    const destStream = createWriteStream(resolvedDestPath);
    const brotli = createBrotliDecompress();

    await pipeline(srcStream, brotli, destStream);
}