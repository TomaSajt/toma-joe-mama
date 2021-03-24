import { SlashCommand } from "../modules/commandutils";
import fs from "fs";
import path from "path";
export default Promise.all(
  fs
    .readdirSync(path.join(__dirname, "slash")).filter(file => file.endsWith('.ts'))
    .map(
      async (file) => {
        console.log(file)
        return (await import("./slash/" + file)).default as SlashCommand
      }
    )
);
