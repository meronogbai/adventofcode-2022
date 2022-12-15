import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

type Line = (number | Line)[];

const parseLines = (input: string): [Line, Line][] => {
  return input
    .trimEnd()
    .split("\n\n")
    .map((block) => {
      const [line1, line2] = block.split("\n");
      const parsedLine1 = JSON.parse(line1);
      const parsedLine2 = JSON.parse(line2);

      return [parsedLine1, parsedLine2];
    });
};

enum PacketsOrderResult {
  EQUAL = 0,
  CORRECT = -1,
  INCORRECT = 1,
}

const arePacketsInOrder = (left: Line, right: Line): PacketsOrderResult => {
  const iterationCount = Math.max(left.length, right.length);

  for (let i = 0; i < iterationCount; i++) {
    const leftItem = left[i];
    const rightItem = right[i];

    if (leftItem === undefined) {
      return PacketsOrderResult.CORRECT;
    }

    if (rightItem === undefined) {
      return PacketsOrderResult.INCORRECT;
    }

    if (typeof leftItem === "number" && typeof rightItem === "number") {
      if (leftItem === rightItem) {
        continue;
      }

      if (leftItem < rightItem) {
        return PacketsOrderResult.CORRECT;
      }

      return PacketsOrderResult.INCORRECT;
    }

    const result = arePacketsInOrder(
      Array.isArray(leftItem) ? leftItem : [leftItem],
      Array.isArray(rightItem) ? rightItem : [rightItem]
    );

    if (result !== PacketsOrderResult.EQUAL) {
      return result;
    }
  }

  return PacketsOrderResult.EQUAL;
};

const a = () => {
  const parsedLines = parseLines(input);

  return parsedLines.reduce((acc, [left, right], index) => {
    const result = arePacketsInOrder(left, right);
    if (result === PacketsOrderResult.CORRECT) {
      return acc + index + 1;
    }

    return acc;
  }, 0);
};

const b = () => {
  const firstDividerLine = [[2]];
  const secondDividerLine = [[6]];

  const orderedLines = parseLines(input)
    .flat()
    .concat([firstDividerLine, secondDividerLine])
    .sort((a, b) => arePacketsInOrder(a, b));

  const indexOfFirstDividerLine =
    orderedLines.findIndex((line) => line === firstDividerLine) + 1;

  const indexOfSecondDividerLine =
    orderedLines.findIndex((line) => line === secondDividerLine) + 1;

  return indexOfFirstDividerLine * indexOfSecondDividerLine;
};

console.log("a", a());
console.log("b", b());
