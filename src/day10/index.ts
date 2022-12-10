import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

type Noop = {
  type: "noop";
};

type Addx = {
  type: "addx";
  arg: number;
};

type Operation = Noop | Addx;

const parseOperations = (input: string): Operation[] => {
  return input
    .trimEnd()
    .split("\n")
    .map((line) => {
      const [type, arg] = line.split(" ");
      if (type !== "noop" && type !== "addx") {
        throw new Error(`Invalid type: ${type}`);
      }

      return {
        type,
        arg: parseInt(arg),
      };
    });
};

const chunk = (arr: string[], len: number) => {
  const chunks = [];

  for (let i = 0; i < arr.length; i += len) {
    chunks.push(arr.slice(i, i + len));
  }

  return chunks;
};

const a = () => {
  const INTERESTING_CYCLES = [20, 60, 100, 140, 180, 220];
  const operations = parseOperations(input);

  const signalStrengthMap = new Map<number, number>();

  let registerX = 1;
  let cycle = 0;

  const incrementCycle = () => {
    cycle += 1;

    if (INTERESTING_CYCLES.includes(cycle)) {
      const signalStrength = cycle * registerX;

      signalStrengthMap.set(cycle, signalStrength);
    }
  };

  operations.forEach((op) => {
    if (op.type === "addx") {
      incrementCycle();
      incrementCycle();
      registerX += op.arg;
    } else {
      incrementCycle();
    }
  });

  let sum = 0;

  signalStrengthMap.forEach((value) => {
    sum += value;
  });

  return sum;
};

const b = () => {
  const screen: string[] = new Array(240).fill(undefined);

  let registerX = 1;
  let cycle = 0;

  const operations = parseOperations(input);

  const incrementCycle = () => {
    const isSpriteOnPixel =
      Math.abs(cycle - registerX) % 40 === 0 ||
      Math.abs(cycle - 1 - registerX) % 40 === 0 ||
      Math.abs(cycle + 1 - registerX) % 40 === 0;

    if (isSpriteOnPixel) {
      screen[cycle] = "#";
    } else {
      screen[cycle] = ".";
    }

    cycle += 1;
  };

  operations.forEach((op) => {
    if (op.type === "noop") {
      incrementCycle();
    } else {
      incrementCycle();
      incrementCycle();
      registerX += op.arg;
    }
  });

  const output = chunk(screen, 40)
    .map((line) => line.join(""))
    .join("\n");

  console.log(output);
};

console.log("a", a());
console.log("b", b());
