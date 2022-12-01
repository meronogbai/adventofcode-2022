import { execSync } from "node:child_process";
import { config } from "dotenv-flow";
import { resolve } from "node:path";
import { mkdirSync } from "node:fs";

config();

const main = () => {
  const day = Number(process.argv[2]);

  if (isNaN(day) || day === 0) {
    throw new Error("Please provide a valid day (greater than 0).");
  }

  const dayDirPath = resolve(__dirname, "..", "src", `day${day}`);
  mkdirSync(dayDirPath, { recursive: true });

  const downloadPath = resolve(dayDirPath, "input");
  execSync(
    `curl -s --cookie "session=${process.env.SESSION_COOKIE}" https://adventofcode.com/2022/day/${day}/input -o ${downloadPath}`
  );
};

main();
