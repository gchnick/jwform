import { exec } from "node:child_process";

import { NoInstalled } from "./errors";

const COMMAND = "pdftk --version";
export function isAvaliability() {
  exec(COMMAND, (error, stdout, stderr) => {
    if (error != undefined) {
      throw NoInstalled("Please install pdftk before use this application.");
    }
    if (stderr) {
      console.log("Upss! an error occurred.");
      console.error(`error message: ${stderr}`);
      globalThis.process.exit(1);
    }
    return stdout;
  });
}
