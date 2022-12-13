import crypto from "crypto";
import { createReadStream } from "fs";
import * as path from "path";

export async function hash(filePath) {
  try {
    const input = createReadStream(path.resolve(filePath));
    const hash = crypto.createHash("sha256");
    await new Promise((resolve, reject) => {
      input.on("data", (chunk) => {
        hash.update(chunk);
      });
      input.on("error", reject);
      input.on("end", () => {
        console.log(hash.digest("hex"));
        resolve();
      });
    });
  } catch (e) {
    console.log("Operation failed");
  }
}
