import { SlashCommand } from "../modules/commandutils";
import fs from "fs";
import path from "path";
export default Promise.all(
  fs
    .readdirSync(path.join(__dirname, "slash"))
    .map(
      async (file) =>
        (await import("./slash/" + file)).default as SlashCommand
    )
);
