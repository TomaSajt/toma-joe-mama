import { PrefixCommand } from "../modules/commandutils";
import fs from "fs";
import path from "path";
export default Promise.all(
  fs
    .readdirSync(path.join(__dirname, "prefix"))
    .map(
      async (file) =>
        (await import("./prefix/" + file)).default as PrefixCommand
    )
);
