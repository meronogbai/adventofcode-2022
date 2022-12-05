import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

type Crate = string;

type Stack = {
  crates: Crate[];
};

const parseStacks = (stacksData: string): Stack[] => {
  const stacksAsString = stacksData.split("\n").reverse();

  const stackLabels = stacksAsString[0].match(/\d+/g);

  if (!stackLabels) {
    throw new Error("Can't parse stack labels from input");
  }

  const stacks: Stack[] = stackLabels.map((label) => ({
    crates: [],
  }));

  const cratesData = stacksAsString.slice(1);

  cratesData.forEach((row, rowIndex) => {
    let i = 0;
    let columnIndex = 0;

    while (i <= row.length) {
      const crate = row.slice(i, i + 3).trim();
      if (crate !== "") {
        stacks[columnIndex].crates.push(crate[1]);
      }

      i += 4;
      columnIndex += 1;
    }
  });

  return stacks;
};

type Move = {
  numOfCrates: number;
  from: number;
  to: number;
};

const parseMoves = (movesData: string): Move[] => {
  return movesData.split("\n").map((line) => {
    const matches = line.match(/\d+/g);

    if (!matches) {
      throw new Error("Can't parse moves from input");
    }

    const [numOfCrates, fromLabel, toLabel] = matches;

    return {
      numOfCrates: Number(numOfCrates),
      from: Number(fromLabel) - 1,
      to: Number(toLabel) - 1,
    };
  });
};

const applyMovesOnStacks = ({
  stacks,
  moves,
  maintainOrder = false,
}: {
  stacks: Stack[];
  moves: Move[];
  maintainOrder?: boolean;
}) => {
  moves.forEach((move) => {
    const fromStack = stacks[move.from];
    const toStack = stacks[move.to];
    const itemsToMove = fromStack.crates.splice(
      fromStack.crates.length - move.numOfCrates,
      move.numOfCrates
    );

    if (maintainOrder) {
      toStack.crates.push(...itemsToMove);
    } else {
      toStack.crates.push(...itemsToMove.reverse());
    }
  });
};

const getCratesAtTop = (stacks: Stack[]) => {
  return stacks.reduce((acc, curr) => {
    return acc + curr.crates.at(-1);
  }, "");
};

const a = () => {
  const [stacksData, movesData] = input.trimEnd().split("\n\n");

  const stacks = parseStacks(stacksData);
  const moves = parseMoves(movesData);

  applyMovesOnStacks({ stacks, moves });

  const cratesAtTheTop = getCratesAtTop(stacks);

  return cratesAtTheTop;
};

const b = () => {
  const [stacksData, movesData] = input.trimEnd().split("\n\n");

  const stacks = parseStacks(stacksData);
  const moves = parseMoves(movesData);

  applyMovesOnStacks({ stacks, moves, maintainOrder: true });

  const cratesAtTheTop = getCratesAtTop(stacks);

  return cratesAtTheTop;
};

console.log("a", a());
console.log("b", b());
