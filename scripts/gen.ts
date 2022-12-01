import { execSync } from "node:child_process";
import { config } from "dotenv-flow";
import { resolve } from "node:path";
import { existsSync, mkdirSync } from "node:fs";

config();

const main = () => {
  const day = Number(process.argv[2]);

  if (isNaN(day) || day === 0) {
    throw new Error("Please provide a valid day (greater than 0).");
  }

  const dirPath = resolve(__dirname, "..", "src", `day${day}`);

  if (existsSync(dirPath)) {
    throw new Error(`Files for day${day} have already been generated.`);
  }

  mkdirSync(dirPath, { recursive: true });

  const templatePath = resolve(__dirname, "template");
  const firstPuzzlePath = resolve(dirPath, "a.ts");
  const secondPuzzlePath = resolve(dirPath, "b.ts");
  const testInputPath = resolve(dirPath, "test-input");
  const inputPath = resolve(dirPath, "input");

  execSync(`cp ${templatePath} ${firstPuzzlePath}`);
  execSync(`cp ${templatePath} ${secondPuzzlePath}`);
  execSync(`echo >> ${testInputPath}`);

  execSync(
    `curl -s --cookie "session=${process.env.SESSION_COOKIE}" https://adventofcode.com/2022/day/${day}/input -o ${inputPath}`
  );
};

main();
