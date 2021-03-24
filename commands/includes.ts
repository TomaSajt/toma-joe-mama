import { IncludesCommand } from "../modules/commandutils";
import fs from "fs";
import path from "path";
export default Promise.all(
  fs
    .readdirSync(path.join(__dirname, "includes")).filter(file => file.endsWith('.ts'))
    .map(
      async (file) =>
        (await import("./includes/" + file)).default as IncludesCommand
    )
);
